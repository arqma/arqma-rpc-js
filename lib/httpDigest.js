'use strict'

// adapted from https://gist.github.com/LPGhatguy/aa3a65bff58e0070d488
// https://tools.ietf.org/html/rfc7616

var crypto = require('crypto')

var HTTPDigest = (function () {
  /**
  * Initializes a new instance of HTTPDigest.
  * @constructs HTTPDigest
  * @param {Object} opts
  * @param {string} opts.username - username
  * @param {string} opts.password - password
  * @param {string} [opts.nc='00000001'] - nonce count, default: '00000001'.
  * @param {string} [opts.cnonce=''] - cnonce, default: ''.
  * @return {HTTPDigest} returns a new instance of HTTPDigest.
  */
  function HTTPDigest (opts) {
    if (typeof opts.username === 'undefined') {
      throw new Error('Missing username')
    }
    if (typeof opts.password === 'undefined') {
      throw new Error('Missing password')
    }
    this.username = opts.username
    this.password = opts.password
    this.nc = opts.nc || '00000001'
    this.cnonce = opts.cnonce || ''
  }

  HTTPDigest.prototype.handleResponse = function (options, authHeaders) {
    /**
    * Calculate digest request.
    * @name HTTPDigest#handleResponse
    * @function
    * @param {Object} options
    * @param {string} options.method - Http method like GET, POST, HEAD, ...
    * @param {string} options.path - url path without host address / hostname like '/json_rpc'.
    * @param {string} authHeaders - authentication headers received by the server.
    * @return {string} The string for the WWW-Authorization http field.
    * @example <caption>[HTTP Digest Access Authentication Specs]{@link https://tools.ietf.org/html/rfc7616#section-3.9}</caption>
    * let wwwAuth = 'Digest qop="auth",realm="http-auth@example.org",algorithm=MD5,nonce="7ypf/xlj9XXwfDPEoM4URrv/xwf94BcCAzFZH4GiTo0v",opaque="FQhe/qaU925kfnzjCev0ciny7QMkPqMAFRtzCUYo5tdS"'
    * let digest = new HTTPDigest({
    *        username: 'Mufasa',
    *        password: 'Circle of Life',
    *        nc: '00000001',
    *        cnonce: 'f2/wE4q74E6zIJEtWaHKaf5wv/H5QzzpXusqGemxURZJ'
    *      })
    * let header = digest.handleResponse(options, wwwAuth)
    */

    let challenge = this._parse_challenge(authHeaders)
    let requestParams = {
      username: this.username,
      realm: challenge.realm,
      nonce: challenge.nonce,
      uri: options.path,
      cnonce: this.cnonce,
      nc: this.nc,
      algorithm: 'MD5',
      response: this._generate_response_hash(options, challenge),
      qop: challenge.qop
    }
    return this._render_digest(requestParams)
  }

  HTTPDigest.prototype.generateCnonce = function () {
    /**
    * Generate MD5 cnonce.
    * @name HTTPDigest#generateCnonce
    * @function
    */
    let ha1 = crypto.createHash('MD5')
    ha1.update(crypto.randomBytes(16).toString('base64'))
    this.cnonce = ha1.digest('hex')
  }

  HTTPDigest.prototype.incNonce = function () {
    /**
    *  Increment and format nonce.
    * @function
    * @name HTTPDigest#incNonce
    */
    if (this.nc === 'ffffffff') {
      this.nc = '00000001'
    } else {
      let s = '00000000' + (parseInt(this.nc, 16) + 1).toString(16)
      this.nc = s.substr(s.length - 8)
    }
  }

  HTTPDigest.prototype._generate_response_hash = function (options, challenge) {
    let ha1 = crypto.createHash('MD5')
    ha1.update([this.username, challenge.realm, this.password].join(':'))

    let ha2 = crypto.createHash('MD5')
    ha2.update([options.method, options.path].join(':'))

    let res = crypto.createHash('MD5')
    let joined = [ha1.digest('hex'), challenge.nonce, this.nc, this.cnonce, challenge.qop, ha2.digest('hex')].join(':')

    res.update(joined)

    return res.digest('hex')
  }

  HTTPDigest.prototype._parse_challenge = function (header) {
    let prefix = 'Digest'
    let challenge = header.substr(header.indexOf(prefix) + prefix.length)
    let parts = challenge.split(',')
    let length = parts.length
    let params = {}
    for (let i = 0; i < length; i++) {
      let part = parts[i].match(/^\s*?([a-zA-Z0-0]+)="(.*)"\s*?$/)
      if (part && part.length > 2) {
        params[part[1]] = part[2]
      }
    }
    return params
  }

  HTTPDigest.prototype._render_digest = function (params) {
    let parts = []
    for (let i in params) {
      if (i === 'nc' || i === 'algorithm') {
        parts.push(i + '=' + params[i])
      } else {
        parts.push(i + '="' + params[i] + '"')
      }
    }
    return 'Digest ' + parts.join(',')
  }

  return HTTPDigest
})()

module.exports = HTTPDigest
