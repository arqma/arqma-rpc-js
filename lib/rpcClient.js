'use strict'

const net = require('net')
const tls = require('tls')

const urllib = require('url')

const HTTPDigest = require('./httpDigest.js')
const PQueue = require('p-queue')

// TOC CHECK: https://techbrij.com/node-js-tcp-server-client-promisify

var RPCClient = (function () {
  /**
  * Initializes a new instance of RPCClient.<br>
  * When no username is provided digest authentication will not be used.
  * @constructs RPCClient
  * @param {Object} opts
  * @param {string} opts.url - complete url with port 'http://127.0.0.1:20000/'
  * @param {string} [opts.username = 'Mufasa'] - username
  * @param {string} [opts.password = 'Circle of Life'] - password
  * @return {RPCClient} returns a new instance of RPCClient.
  */

  // We only use one socket for all request and reuse it to avoid multiple authentication with digest
  var wwwAuthHeaders = ''

  function RPCClient (opts) {
    if (typeof opts.url === 'undefined') {
      throw new Error('Missing url parameter')
    }
    const parsedURL = urllib.parse(opts.url)

    this.options = {
      protocol: parsedURL.protocol,
      hostname: parsedURL.hostname,
      port: parsedURL.port,
      path: parsedURL.path,
      method: 'POST'
    }

    // Digest is only declared if username and password are supplied
    if (typeof opts.username !== 'undefined' && typeof opts.password !== 'undefined') {
      this.digest = new HTTPDigest({
        username: opts.username,
        password: opts.password,
        cnonce: '',
        nc: ''
      })
      this.authenticated = false
    }
    // declare queue to process requests sequentially

    this.queue = new PQueue({ concurrency: 1 })

    this.connected = false

    if (this.options.protocol === 'http:') {
      this.socket = new net.Socket()
    } else if (this.options.protocol === 'https:') {
      this.socket = new tls.TLSSocket()
    } else {
      throw new Error('no http or https specified in url!')
    }

    this.socket.setEncoding('utf8')
  }

  RPCClient.prototype.socketConnect = function () {
  /**
  * Connect socket.
  * @function
  * @name RPCClient#socketConnect
  * */
    return new Promise((resolve, reject) => {
      let digest = this.digest
      return this.queue.add(() => {
        if (typeof digest !== 'undefined') {
          digest.generateCnonce()
          return this._socket_connect().then((res) => {
            return this._socket_authenticate()
          })
        } else {
          return this._socket_connect()
        }
      })
        .then((res) => {
          return resolve(res)
        }).catch((err) => {
          return reject(err)
        })
    })
  }

  RPCClient.prototype.requestLimited = function (rpc) {
  /**
  * Request queued rpc method.
  * @function
  * @name RPCClient#requestLimited
  * @param {string} rpc - rpc request prameters
  * @example
  * let rpc =  '{"jsonrpc":"2.0","id":"0","method":"get_info"}'
  * let rpc = '{"jsonrpc":"2.0","id":"0","method":"get_address","params":""}'
  * */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request(rpc)
      }).then((res) => {
        if (res.status === '200') {
          resolve(res)
        } else {
          let error = new Error('HTTP error!')
          error.code = res.status
          reject(error)
        }
      })
        .catch((err) => reject(err))
    })
  }

  RPCClient.prototype.changeURL = function (url) {
    /**
   * Change url.
   * @function
   * @name RPCClient#changeURL
   * @param {string} - url
   * @example
   * let url = 'http://127.0.0.1:20000/json_rpc'
   * let url = 'http://127.0.0.1/json_rpc'
   */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        let parsedURL = urllib.parse(url)
        this.options.protocol = parsedURL.protocol
        this.options.hostname = parsedURL.hostname
        this.path = parsedURL.path
        if (typeof parsedURL.port !== 'undefined') {
          this.port = parsedURL.port
        }
      })
        .then((res) => {
          return resolve(true)
        }).catch((err) => {
          return reject(err)
        })
    })
  }

  RPCClient.prototype.socketEnd = function () {
    /**
   * Sent FIN Packet to close connection.
   * @function
   * @name RPCClient#socketEnd
   */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => this._socket_end())
        .then((res) => {
          return resolve(res)
        }).catch((err) => {
          return reject(err)
        })
    })
  }

  RPCClient.prototype.socketDestroy = function () {
    /**
   * Destroy socket.<br>
   * <caption>[nodejs socket.destroy]{@link https://nodejs.org/api/net.html#net_socket_destroy_exception}</caption></br>
   * Accordingly to best practice, the socket should only be destroyed on error.
   * @function
   * @name RPCClient#socketDestroy
   */
    return new Promise((resolve, reject) => {
      let context = this
      return this.queue.add(() => context._socket_destroy())
        .then((res) => {
          return resolve(res)
        }).catch((err) => {
          return reject(err)
        })
    })
  }

  // promised authentication
  RPCClient.prototype._socket_authenticate = function () {
    let context = this
    return new Promise((resolve, reject) => {
      return context._request()
        .then((res) => {
          if (res.status === '401') {
            return context._request('')
          }
        }).then(function (res) {
          if (res.status === '200' || res.status === '404') {
            context.authenticated = true
            resolve(true)
          } else {
            let error = new Error('Authentication error!')
            error.status = res.status
            reject(error)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // promised request function
  RPCClient.prototype._request = function (rpc) {
    let options = this.options
    let context = this
    let digest = this.digest
    let socket = this.socket

    return new Promise((resolve, reject) => {
      let res = {}
      let str = ''
      let chunkNumber = 0
      if (wwwAuthHeaders === '') {
        str = this._create_headers(options.method, options.path, rpc)
      } else {
        str = this._create_headers(options.method, options.path, rpc, digest.handleResponse(this.options, wwwAuthHeaders))
        digest.incNonce()
      }

      socket.write(str)

      socket.on('data', function getData (data) {
        context._parseResponse(chunkNumber, data, res)
        if (Number(res.headers['Content-Length']) === Buffer.from(res.body).length) {
          if (typeof res.headers['WWW-authenticate'] !== 'undefined') {
            wwwAuthHeaders = res.headers['WWW-authenticate']
          }
          this.removeListener('data', getData)
          return resolve(res)
        }
        chunkNumber++
      })
    })
  }

  // promised socket connect
  RPCClient.prototype._socket_connect = function () {
    let options = this.options
    let socket = this.socket
    let context = this

    return new Promise(function (resolve, reject) {
      socket.on('error', function getError (err) {
        context._socket_destroy()
        this.removeListener('error', getError)
        reject(err)
      })

      socket.on('ready', function getReady (ready) {
        context.connected = true
        this.removeListener('ready', getReady)
        resolve(true)
      })

      socket.on('timeout', function getTimeout (timeout) {
        this._socket_destroy()
        this.removeListener('timeout', getTimeout)
        reject(timeout)
      })

      socket.on('close', function getClose () {
        context.connected = false
        if (typeof context.digest !== 'undefined') {
          context.digest.nc = '00000001'
          context.authenticated = false
          wwwAuthHeaders = ''
        }
        this.removeListener('close', getClose)
      })
      socket.connect(options.port, options.hostname)
    })
  }

  // promised socket end / Half-close
  RPCClient.prototype._socket_end = function () {
    let socket = this.socket
    return new Promise(function (resolve, reject) {
      let end = socket.end()
      // only check writeableSat because of half-close
      if (end._writableState['ended'] === true) {
        resolve(true)
      } else {
        let err = new Error('Socket did not half-close!')
        reject(err)
      }
    })
  }

  // promised socket destroy
  RPCClient.prototype._socket_destroy = function () {
    let context = this
    let socket = context.socket
    return new Promise(function (resolve, reject) {
      let destroy = socket.destroy()
      if (destroy._writableState['destroyed'] === true && destroy._readableState['destroyed'] === true) {
        resolve(true)
      } else {
        let err = new Error('Socket not destroyed!')
        reject(err)
      }
    })
  }

  /*
  https://tools.ietf.org/html/rfc7230#page-20
  The normal procedure for parsing an HTTP message is to read the
  start-line into a structure, read each header field into a hash table
  by field name until the empty line, and then use the parsed data to
  determine if a message body is expected.  If a message body has been
  indicated, then it is read as a stream until an amount of octets
  equal to the message body length is read or the connection is closed
   */

  RPCClient.prototype._parseResponse = function (chunkNumber, data, res) {
    if (chunkNumber === 0) {
      let response = data.split('\r\n')
      let statusLine = response[0].split(' ')
      let nb = response[0].length + 2

      res.status = statusLine[1]

      // remove status line from response
      response.splice(0, 1)

      let len = response.length
      let headers = {}
      // find end of response headers '/r/n/r/n'
      for (let i = 0; i < len; ++i) {
        nb += response[i].length + 2
        if (response[i] === '') {
          break
        } else {
          let x = response[i].split(':')
          headers[x[0]] = x[1].trim()
        }
      }
      res.headers = headers
      res.body = data.substring(nb, data.length)
    } else {
      // aggregate chunked response for body
      res.body = res.body + data
    }
  }

  // Create headers for request
  // Headers are created differently based on supplied input variables
  RPCClient.prototype._create_headers = function (method, path, data, wwwAuth) {
    let str = method + ' ' + path + ' HTTP/1.1\r\n'
    if (typeof wwwAuth !== 'undefined') {
      str = str + 'Authorization: ' + wwwAuth + '\r\n'
    }
    str = str + 'User-Agent: arqma/1.0\r\n'
    str = str + 'Accept: */*\r\n'
    str = str + 'Content-Type: application/json\r\n'
    if (typeof data !== 'undefined') {
      str = str + 'Content-Length: ' + Buffer.from(data).length + '\r\n\r\n'
      str = str + data
    } else if (typeof data === 'undefined' && typeof wwwAuth === 'undefined') {
      str = str + 'Content-Length: 0\r\n\r\n'
    }
    return str
  }
  return RPCClient
})()

module.exports = RPCClient
