'use strict'

const RPCClient = require('../lib/rpcClient.js')

var RPCDaemon = (function () {
  /**
  * Initializes a new instance of RPCDaemon.<br>
  * When no username is provided digest authentication will not be used.
  * @constructs RPCDaemon
  * @param {Object} opts
  * @param {string} opts.url - complete url with port 'http://127.0.0.1:19994' or 'https://127.0.0.1:19994'.
  * @param {string} [opts.username='Mufasa'] - username.
  * @param {string} [opts.password='Circle of Life'] - password.
  * @return {RPCDaemon} returns a new instance of RPCDaemon.
  */
  RPCDaemon.prototype = Object.create(RPCClient.prototype)
  RPCDaemon.prototype.constructor = RPCDaemon

  // remove requestLimited as we queue the top functions
  delete RPCDaemon.prototype.requestLimited

  function RPCDaemon (opts) {
    RPCClient.call(this, opts)
  }

  RPCDaemon.prototype.getBlockCount = function () {
    /**
    * Look up how many blocks are in the longest chain known to the node.
    * @function
    * @name RPCDaemon#getBlockCount
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  count: 144188,
    *  status: 'OK'
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('getblockcount')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getBlockHash = function (opts) {
    /**
    * Look up a block's hash by its height.
    * @function
    * @name RPCDaemon#getBlockHash
    * @param {Object} opts
    * @param {number[]} opts.height - block height (only one unsigned integer).
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * 6115a8e9902af15d31d14c698621d54e9bb594b0da053591ec5d1ceb537960ea
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.height === 'undefined') return reject(new Error('must specify height'))
        return this._request_rpc('on_get_block_hash', opts.height)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getBlockTemplate = function (opts) {
    /**
    * Get a block template on which mining a new block.
    * @function
    * @name RPCDaemon#getBlockTemplate
    * @param {Object} opts
    * @param {string} opts.wallet_address - Address of wallet to receive coinbase transactions if block is successfully mined.
    * @param {number} opts.reserve_size - Reserve size.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  blockhashing_blob: '0b0bdc83ffe405686cd8e06fea333582a7d521c6899a00266f107e9212ebe7b7626258893c9a
    *                     9000000000cc172232b1465580877b898f8f6021ad264705fb44d4ce4116576c951865dc6e02',
    *  blocktemplate_blob: '0b0bdc83ffe405686cd8e06fea333582a7d521c6899a00266f107e9212ebe7b7626258893c9a
    *                      900000000002b3e70801ffa1e70801919ef5bc46027fecb474827691e150863765eeb11c7fda
    *                      e88e9cf413468b3f46a6fd1416174f2101958d80e5dd64b962d539a18e2fab89cd6abf1ddd2d
    *                      f4b6c2b890c1fad31acd310001eae8de4b74bf117c059ba9b68c9e81a2465997319dd5805a90
    *                      dfae8290b33ab9',
    *  difficulty: 58700182,
    *  expected_reward: 18918231825,
    *  height: 144289,
    *  prev_hash: '686cd8e06fea333582a7d521c6899a00266f107e9212ebe7b7626258893c9a90',
    *  reserved_offset: 127,
    *  status: 'OK',
    *  untrusted: false
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.wallet_address === 'undefined') return reject(new Error('must specify wallet_address'))
        if (typeof opts.reserve_size === 'undefined') return reject(new Error('must specify reserve_size'))
        return this._request_rpc('getblocktemplate', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.submitBlock = function (opts) {
    /**
    * Look up a block's hash by its height.
    * @function
    * @name RPCDaemon#submitBlock
    * @param {Object} opts
    * @param {string[]} opts.blob -  list of block blobs which have been mined.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output with error message when the block is not accepted. You need to catch it with promise.</b></caption>
    * { Error: Block not accepted
    *   at _request.then (C:\myDev\arqma-rpc-js\src\rpcDaemon.js:761:25)
    *   at process._tickCallback (internal/process/next_tick.js:68:7) code: -7 }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.blob === 'undefined') return reject(new Error('must specify blob'))
        if (!(opts.blob instanceof Array) || Object.prototype.toString.call(opts.blob) !== '[object Array]') return reject(new Error('blob should be an array of strings'))
        return this._request_rpc('submit_block', opts.blob)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getLastBlockHeader = function () {
    /**
    * Block header information for the most recent block is easily retrieved with this method.
    * @function
    * @name RPCDaemon#getLastBlockHeader
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  block_header:
    *  {
    *    block_size: 147,
    *    cumulative_difficulty: 20379479802883,
    *    depth: 0,
    *    difficulty: 61400097,
    *    hash: 'c99c2f9a53e4bab5d08f9820ee555d62059e0e9bf799fbe07a6137aac607f4e8',
    *    height: 145009,
    *    major_version: 11,
    *    minor_version: 11,
    *    nonce: 3441194797,
    *    num_txes: 0,
    *    orphan_status: false,
    *    pow_hash: '',
    *    prev_hash: '53d6437ac32fc49e0ee8b24f63046c6e1e6e0491f6d1b6797b025b66ad1b4a40',
    *    reward: 18911700042,
    *    timestamp: 1554058920 },
    *    status: 'OK',
    *    untrusted: false
    *  }
    *  count: 144188,
    *  status: 'OK'
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('get_last_block_header')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getBlockHeaderByHash = function (opts) {
    /**
    * Block header information can be retrieved using hash.
    * @function
    * @name RPCDaemon#getBlockHeaderByHash
    * @param {Object} opts
    * @param {string} opts.hash - The block's sha256 hash.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  block_header:
    *  {
    *   block_size: 147,
    *   cumulative_difficulty: 16146009479722,
    *   depth: 30823,
    *   difficulty: 109000131,
    *   hash: '5859dbfca776cc006f6bfd00a41363f8ffcc20e6f217c484df0b47ae8cc2458a',
    *   height: 114196,
    *   major_version: 10,
    *   minor_version: 10,
    *   nonce: 2147508795,
    *   num_txes: 0,
    *   orphan_status: false,
    *   pow_hash: '',
    *   prev_hash: 'be9bcd157ff60f9b174217608a5b419c451afa1d9d76c49edf54ac829bf24e74',
    *   reward: 19191616421,
    *   timestamp: 1550322226
    *  },
    *  status: 'OK',
    *  untrusted: false
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.hash === 'undefined') return reject(new Error('must specify hash'))
        return this._request_rpc('get_block_header_by_hash', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getBlockHeaderByHeight = function (opts) {
    /**
    * Block header information can be retrieved using height.
    * @function
    * @name RPCDaemon#getBlockHeaderByHeight
    * @param {Object} opts
    * @param {number} opts.height - The block's height.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  block_header:
    *  {
    *   block_size: 147,
    *   cumulative_difficulty: 16146009479722,
    *   depth: 30823,
    *   difficulty: 109000131,
    *   hash: '5859dbfca776cc006f6bfd00a41363f8ffcc20e6f217c484df0b47ae8cc2458a',
    *   height: 114196,
    *   major_version: 10,
    *   minor_version: 10,
    *   nonce: 2147508795,
    *   num_txes: 0,
    *   orphan_status: false,
    *   pow_hash: '',
    *   prev_hash: 'be9bcd157ff60f9b174217608a5b419c451afa1d9d76c49edf54ac829bf24e74',
    *   reward: 19191616421,
    *   timestamp: 1550322226
    *  },
    *  status: 'OK',
    *  untrusted: false
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.height === 'undefined') return reject(new Error('must specify height'))
        return this._request_rpc('get_block_header_by_height', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getBlockHeadersRange = function (opts) {
    /**
    * Similar to get_block_header_by_height above, but for a range of blocks.
    * This method includes a starting block height and an ending block height as parameters.
    * @function
    * @name RPCDaemon#getBlockHeaderByHeight
    * @param {Object} opts
    * @param {number} opts.start_height - The starting block's height.
    * @param {number} opts.end_height - The ending block's height.
    * @returns {Promise} Promise object
    * @example <caption><b>Output</b></caption>
    * {
    *  headers:
    *  [
    *   {
    *    block_size: 147,
    *    cumulative_difficulty: 16146009479722,
    *    depth: 30831,
    *    difficulty: 109000131,
    *    hash: '5859dbfca776cc006f6bfd00a41363f8ffcc20e6f217c484df0b47ae8cc2458a',
    *    height: 114196,
    *    major_version: 10,
    *    minor_version: 10,
    *    nonce: 2147508795,
    *    num_txes: 0,
    *    orphan_status: false,
    *    pow_hash: '',
    *    prev_hash: 'be9bcd157ff60f9b174217608a5b419c451afa1d9d76c49edf54ac829bf24e74',
    *    reward: 19191616421,
    *    timestamp: 1550322226
    *   },
    *   {
    *    block_size: 147,
    *    cumulative_difficulty: 16146120479856,
    *    depth: 30830,
    *    difficulty: 111000134,
    *    hash: 'c27c128325bb3f47d76816789995d376268ee25f3cdcfb714580e34fe5cc8e08',
    *    height: 114197,
    *    major_version: 10,
    *    minor_version: 10,
    *    nonce: 541065496,
    *    num_txes: 0,
    *    orphan_status: false,
    *    pow_hash: '',
    *    prev_hash: '5859dbfca776cc006f6bfd00a41363f8ffcc20e6f217c484df0b47ae8cc2458a',
    *    reward: 19191607270,
    *    timestamp: 1550322551
    *   }
    *  ],
    *  status: 'OK',
    *  untrusted: false
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.start_height === 'undefined') return reject(new Error('must specify start_height'))
        if (typeof opts.end_height === 'undefined') return reject(new Error('must specify end_height'))
        return this._request_rpc('get_block_headers_range', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getBlock = function (opts) {
    /**
    * Full block information can be retrieved by either block height or hash.
    * @function
    * @name RPCDaemon#getBlock
    * @param {Object} opts
    * @param {number} [opts.height] -  The block's height.
    * @param {string} [opts.hash] -  The block's hash.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  blob: '0a0ab294a0e305be9bcd157ff60f9b174217608a5b419c451afa1d9d76c49edf54ac829bf24e
    *         743b62008002a6fc0601ff94fc0601a5a7a3bf4702f0f7be480164ced3d5d28c49dd9baeb5ab2bd3
    *         29910838afd3e26cd85ad49b3e6101311398a1783551ba88c64c00135d0439d982fc4d70f48e1dff
    *         cca8146454e84303210091abcad5e3b8bc208e5361ffeebbb68a35e102a5225f4865e3503cf7e76a
    *         ff92021b000000000000000000000000005602009e000000000000000000000000',
    *  block_header:
    *  {
    *   block_size: 147,
    *   cumulative_difficulty: 16146009479722,
    *   depth: 31535,
    *   difficulty: 109000131,
    *   hash: '5859dbfca776cc006f6bfd00a41363f8ffcc20e6f217c484df0b47ae8cc2458a',
    *   height: 114196,
    *   major_version: 10,
    *   minor_version: 10,
    *   nonce: 2147508795,
    *   num_txes: 0,
    *   orphan_status: false,
    *   pow_hash: '',
    *   prev_hash: 'be9bcd157ff60f9b174217608a5b419c451afa1d9d76c49edf54ac829bf24e74',
    *   reward: 19191616421,
    *   timestamp: 1550322226
    *  },
    *  json: '{\n  "major_version": 10, \n  "minor_version": 10, \n  "timestamp": 15503222
    *  26, \n  "prev_id": "be9bcd157ff60f9b174217608a5b419c451afa1d9d76c49edf54ac829bf2
    *  4e74", \n  "nonce": 2147508795, \n  "miner_tx": {\n    "version": 2, \n    "unlo
    *  ck_time": 114214, \n    "vin": [ {\n        "gen": {\n          "height": 114196
    *  \n        }\n      }\n    ], \n    "vout": [ {\n        "amount": 19191616421, \
    *  n        "target": {\n          "key": "f0f7be480164ced3d5d28c49dd9baeb5ab2bd329
    *  910838afd3e26cd85ad49b3e"\n        }\n      }\n    ], \n    "extra": [ 1, 49, 19
    *  , 152, 161, 120, 53, 81, 186, 136, 198, 76, 0, 19, 93, 4, 57, 217, 130, 252, 77,
    *  112, 244, 142, 29, 255, 204, 168, 20, 100, 84, 232, 67, 3, 33, 0, 145, 171, 202
    *  , 213, 227, 184, 188, 32, 142, 83, 97, 255, 238, 187, 182, 138, 53, 225, 2, 165,
    *  34, 95, 72, 101, 227, 80, 60, 247, 231, 106, 255, 146, 2, 27, 0, 0, 0, 0, 0, 0,
    *  0, 0, 0, 0, 0, 0, 0, 86, 2, 0, 158, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0\n    ], \n
    *  "rct_signatures": {\n      "type": 0\n    }\n  }, \n  "tx_hashes": [ ]\n}',
    *  miner_tx_hash: '691e09ce198a2953c391a292ed79d7a239ec929740503400a0ab3e3ee8cfad84',
    *  status: 'OK',
    *  untrusted: false
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if ((typeof opts.height === 'undefined') && (typeof opts.hash === 'undefined')) return reject(new Error('must specify height or hash'))
        return this._request_rpc('get_block', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getConnections = function () {
    /**
    * Retrieve information about incoming and outgoing connections to your node.
    * @function
    * @name RPCDaemon#getConnections
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  connections:
    *  [
    *   {
    *    address: '192.154.226.212:19993',
    *    avg_download: 1,
    *    avg_upload: 0,
    *    connection_id: 'cb8f0270c5b740fa9eb7aa1aedddb5cb',
    *    current_download: 2,
    *    current_upload: 0,
    *    height: 145745,
    *    host: '192.154.226.212',
    *    incoming: false,
    *    ip: '192.154.226.212',
    *    live_time: 20,
    *    local_ip: false,
    *    localhost: false,
    *    peer_id: 'c7f323892fb18784',
    *    port: '19993',
    *    pruning_seed: 0,
    *    recv_count: 22852,
    *    recv_idle_time: 13,
    *    send_count: 568,
    *    send_idle_time: 13,
    *    state: 'normal',
    *    support_flags: 1
    *   }, ...
    *  ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('get_connections')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getInfo = function () {
    /**
    * Retrieve general information about the state of your node and the network.
    * @function
    * @name RPCDaemon#getInfo
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  alt_blocks_count: 0,
    *  block_size_limit: 600000,
    *  block_size_median: 147,
    *  bootstrap_daemon_address: '',
    *  cumulative_difficulty: 20431347989483,
    *  database_size: 0,
    *  difficulty: 75600102,
    *  free_space: 243485646848,
    *  grey_peerlist_size: 62,
    *  height: 145746,
    *  height_without_bootstrap: 145746,
    *  incoming_connections_count: 7,
    *  mainnet: true,
    *  nettype: 'mainnet',
    *  offline: false,
    *  outgoing_connections_count: 8,
    *  rpc_connections_count: 2,
    *  stagenet: false,
    *  start_time: 1554144733,
    *  status: 'OK',
    *  target: 120,
    *  target_height: 145732,
    *  testnet: false,
    *  top_block_hash: '9df96b39bb2ca8953cbf8f2fffc8f9896a74f430cbe29dc0ad356986ef93024c',
    *  tx_count: 179362,
    *  tx_pool_size: 10,
    *  untrusted: false,
    *  was_bootstrap_ever_used: false,
    *  white_peerlist_size: 38
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('get_info')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getHardForkInfo = function () {
    /**
    * Look up information regarding hard fork voting and readiness.
    * @function
    * @name RPCDaemon#getHardForkInfo
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  earliest_height: 131650,
    *  enabled: true,
    *  state: 2,
    *  status: 'OK',
    *  threshold: 0,
    *  untrusted: false,
    *  version: 11,
    *  votes: 10080,
    *  voting: 11,
    *  window: 10080
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('hard_fork_info')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.setBans = function (opts) {
    /**
    * Ban another node by IP.
    * @function
    * @name RPCDaemon#setBans
    * @param {Object} opts
    * @param {string} [opts.host] - Host to ban.
    * @param {number} [opts.ip] - IP address to ban, in Int format.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { status: 'OK' }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.bans === 'undefined') return reject(new Error('must specify bans'))
        return this._request_rpc('set_bans', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getBans = function () {
    /**
    * Get list of banned IPs.
    * @function
    * @name RPCDaemon#getBans
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  bans:
    *  [
    *   { host: '192.168.1.50', ip: 838969536, seconds: 30 },
    *   { host: '192.168.1.51', ip: 855746752, seconds: 30 }
    *  ],
    *  status: 'OK'
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('get_bans')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.flushTxPool = function (opts) {
    /**
    * Flush tx ids from transaction pool.
    * @function
    * @name RPCDaemon#flushTxPool
    * @param {Object} [opts]
    * @param {string[]} [opts.txids] - list of transactions IDs to flush from pool (all tx ids flushed if empty).
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { status: 'OK' }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        return this._request_rpc('flush_txpool', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getOutputHistogram = function (opts) {
    /**
    * Get a histogram of output amounts.
    * @function
    * @name RPCDaemon#getOutputHistogram
    * @param {Object} [opts]
    * @param {number[]} [opts.amounts] -  list of unsigned int.
    * @param {number} [opts.min_count] -  unsigned int.
    * @param {number} [opts.max_count] -  unsigned int.
    * @param {boolean} [unlocked] -  boolean.
    * @param {number} [recent_cutoff] -  unsigned int.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  histogram:
    *  [
    *   {
    *    amount: 10000000,
    *    recent_instances: 0,
    *    total_instances: 1481,
    *    unlocked_instances: 0
    *   }
    *  ],
    *  status: 'OK',
    *  untrusted: false
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        return this._request_rpc('get_output_histogram', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getCoinbaseTxSum = function (opts) {
    /**
    * Get the coinbase amount and the fees ammount for n last blocks starting at particular height.
    * @function
    * @name RPCDaemon#getCoinbaseTxSum
    * @param {Object} opts
    * @param {number} opts.height -  unsigned int; Block height from which getting the amounts.
    * @param {number} opts.count -  unsigned int; number of blocks to include in the sum
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  emission_amount: 7502006245466748,
    *  fee_amount: 0,
    *  status: 'OK'
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.height === 'undefined') return reject(new Error('must specify height'))
        if (typeof opts.count === 'undefined') return reject(new Error('must specify count'))
        return this._request_rpc('get_coinbase_tx_sum', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getVersion = function () {
    /**
    * Give the node current version.
    * @function
    * @name RPCDaemon#getVersion
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { status: 'OK', untrusted: false, version: 131077 }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('get_version')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getFeeEstimate = function (opts) {
    /**
    * Gives an estimation on fees per kB.
    * @function
    * @name RPCDaemon#getFeeEstimate
    * @param {Object} opts
    * @param {number} [opts.grace_blocks] - unsigned int.
    * @example <caption><b>Output</b></caption>
    * { fee: 7560, status: 'OK', untrusted: false }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        return this._request_rpc('get_fee_estimate', opts)
      }).then((res) => {
        resolve(res)
      })
        .catch((err) => {
          reject(err)
        })
    })
  }

  RPCDaemon.prototype.getAlternateChains = function () {
    /**
    * Display alternative chains seen by the node.
    * @function
    * @name RPCDaemon#getAlternateChains
    * @example <caption><b>Output</b></caption>
    * { status: 'OK' }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('get_alternate_chains')
      }).then((res) => {
        resolve(res)
      })
        .catch((err) => {
          reject(err)
        })
    })
  }

  RPCDaemon.prototype.relayTx = function (opts) {
    /**
    * Relay a list of transaction IDs.
    * @function
    * @name RPCDaemon#relayTx
    * @param {Object} opts
    * @param {string[]} opts.txids - list of transaction IDs to relay.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { status: 'OK' }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.txids === 'undefined') return reject(new Error('must specify txids'))
        if (!(opts.txids instanceof Array) || Object.prototype.toString.call(opts.txids) !== '[object Array]') return reject(new Error('txids should be an array of strings'))
        return this._request_rpc('relay_tx', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.syncInfo = function () {
    /**
    * Get synchronisation informations.
    * @function
    * @name RPCDaemon#syncInfo
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  height: 149027,
    *  next_needed_pruning_seed: 0,
    *  overview: '[]',
    *  peers:
    *  [
    *   { info: [Object] },
    *   { info: [Object] },
    *   ... ,
    *   { info: [Object] }
    *  ],
    *  status: 'OK',
    *  target_height: 149009
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('sync_info')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getTxPoolBacklog = function () {
    /**
    * Get all transaction pool backlog.
    * @function
    * @name RPCDaemon#getTxPoolBacklog
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { status: 'OK', untrusted: false }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('get_txpool_backlog')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.getOutputDistribution = function (opts) {
    /**
    * Get Ouput Distribution.
    * @function
    * @name RPCDaemon#getOutputDistribution
    * @param {Object} opts
    * @param {number[]} opts.amounts -  list of amounts to look for.
    * @param {boolean} [opts.cumulative] - (default is false) States if the result should be cumulative (true or false).
    * @param {number} [opts.from_height] - (default is 0) - unsigned int.
    * @param {number} [opts.to_height] - (default is 0) - unsigned int.
    * @example <caption><b>Output</b></caption>
    * { status: 'OK', untrusted: false }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        // JSON does not like binary data from this query
        opts.binary = false
        if (typeof opts.amounts === 'undefined') return reject(new Error('must specify amounts'))
        if (!(opts.amounts instanceof Array) || Object.prototype.toString.call(opts.amounts) !== '[object Array]') return reject(new Error('amounts should be an array of numbers'))
        return this._request_rpc('get_output_distribution', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherGetHeight = function () {
    /**
    * Get the node's current height.
    * @function
    * @name RPCDaemon#otherGetHeight
    * @example <caption><b>Output</b></caption>
    * { height: 149045, status: 'OK', untrusted: false }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        this._request_other('get_height')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherGetTransactions = function (opts) {
    /**
    * Full block information can be retrieved by either block height or hash.
    * @function
    * @name RPCDaemon#otherGetTransactions
    * @param {Object} opts
    * @param {string[]} opts.tx_hashes -  List of transaction hashes to look up.
    * @param {boolean} [opts.decode_as_json] - (false by default). If set true, the returned transaction information will be decoded rather than binary.
    * @param {boolean} [opts.prune] - (false by default).
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  status: 'OK',
    *  txs:
    *  [
    *   {
    *    as_hex: '02000202 ... 0f',
    *    as_json: '',
    *    block_height: 140732,
    *    block_timestamp: 1553537372,
    *    double_spend_seen: false,
    *    in_pool: false,
    *    output_indices: [Array],
    *    prunable_as_hex: '',
    *    prunable_hash:
    *    '79f87397ef265f27b32a659e0f3f73496527e2cb97228ee4a82f31ec972bd65b',
    *    pruned_as_hex: '',
    *    tx_hash: 'a43c51e3a216bb702e6be2746c02a366c8e3a05b08b50da5ada8e9481418e350'
    *   }
    *  ],
    *  txs_as_hex: [ '02000202 ... 0f' ],
    *  untrusted: false
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.txs_hashes === 'undefined') return reject(new Error('must specify txs_hashes'))
        if (!(opts.txs_hashes instanceof Array) || Object.prototype.toString.call(opts.txs_hashes) !== '[object Array]') return reject(new Error('txs_hashes should be an array of strings'))
        return this._request_other('get_transactions', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherGetAltBlocksHashes = function () {
    /**
    * Get the known blocks hashes which are not on the main chain.
    * @function
    * @name RPCDaemon#otherGetAltBlocksHashes
    * @returns {Promise} Promise object.
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        this._request_other('get_alt_blocks_hashes')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherIsKeyImageSpent = function (opts) {
    /**
    * Check if outputs have been spent using the key image associated with the output.
    * @function
    * @name RPCDaemon#otherIsKeyImageSpent
    * @param {Object} opts
    * @param {string[]} opts.key_images -  list of block blobs which have been mined.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { spent_status: [ 1 ], status: 'OK', untrusted: false }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.key_images === 'undefined') return reject(new Error('must specify key_images'))
        if (!(opts.key_images instanceof Array) || Object.prototype.toString.call(opts.key_images) !== '[object Array]') return reject(new Error('key_images should be an array of strings'))
        return this._request_other('is_key_image_spent', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherSendRawTransaction = function (opts) {
    /**
    * Broadcast a raw transaction to the network.
    * @function
    * @name RPCDaemon#otherSendRawTransaction
    * @param {Object} opts
    * @param {string} opts.tx_as_hex -  Full transaction information as hexidecimal string.
    * @param {boolean} [opts.do_not_relay] - (false by default). Stop relaying transaction to other nodes.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  double_spend: false,
    *  fee_too_low: false,
    *  invalid_input: false,
    *  invalid_output: false,
    *  low_mixin: false,
    *  not_rct: false,
    *  not_relayed: true,
    *  overspend: false,
    *  reason: 'Not relayed',
    *  status: 'OK',
    *  too_big: false,
    *  untrusted: false
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.tx_as_hex === 'undefined') return reject(new Error('must specify tx_as_hex'))
        return this._request_other('send_raw_transaction', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherStartMining = function (opts) {
    /**
    * Start mining on the daemon.
    * @function
    * @name RPCDaemon#otherStartMining
    * @param {Object} opts
    * @param {boolean} opts.do_background_mining - States if the mining should run in background (true) or foreground (false).
    * @param {boolean} opts.ignore_battery - States if batery state (on laptop) should be ignored (true) or not (false).
    * @param {string} opts.miner_address - Account address to mine to.
    * @param {number} opts.threads_count - Number of mining thread to run.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { status: 'OK' }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.do_background_mining === 'undefined') return reject(new Error('must specify do_background_mining'))
        if (typeof opts.ignore_battery === 'undefined') return reject(new Error('must specify ignore_battery'))
        if (typeof opts.miner_address === 'undefined') return reject(new Error('must specify miner_address'))
        if (typeof opts.threads_count === 'undefined') return reject(new Error('must specify threads_count'))
        return this._request_other('start_mining', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherStopMining = function () {
    /**
    * Stop mining on the daemon.
    * @function
    * @name RPCDaemon#otherStopMining
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { status: 'OK' }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        this._request_other('stop_mining')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherMiningStatus = function () {
    /**
    * Get the mining status of the daemon.
    * @function
    * @name RPCDaemon#otherStopMining
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  active: true,
    *  address: 'ar4bfzwH4726kamvTg2wRNLkw16MR6DbbZMyuShYgKs58SknoAF8q7PBQ1XXAsGgH9feTWKKmYZNjaWphc7Wce1u33iKe2cL9',
    *  is_background_mining_enabled: true,
    *  speed: 2,
    *  status: 'OK',
    *  threads_count: 1
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        this._request_other('mining_status')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherSaveBc = function () {
    /**
    * Save the blockchain. The blockchain does not need saving and is always saved when modified, however it does a sync to flush the filesystem cache onto the disk for safety purposes against Operating System or Harware crashes.
    * @function
    * @name RPCDaemon#otherSaveBc
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { status: 'OK' }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        this._request_other('save_bc')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherGetPeerList = function () {
    /**
    * Get the known peers list.
    * @function
    * @name RPCDaemon#otherGetPeerList
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  gray_list:
    *  [
    *   { host: '135790251',
    *     id: 17703185689409910000,
    *     ip: 135790251,
    *     last_seen: 1551473999,
    *     port: 19993,
    *     pruning_seed: 0 }, ...
    *  ]
    *  status: 'OK',
    *  white_list:
    *  [
    *   { host: '35263064',
    *     id: 3764929947382960000,
    *     ip: 35263064,
    *     last_seen: 1554553579,
    *     port: 19993,
    *     pruning_seed: 0 }, ...
    *  ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        this._request_other('get_peer_list')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherSetLogHashrate = function (opts) {
    /**
    * Set the log hash rate display mode.
    * @function
    * @name RPCDaemon#otherSetLogHashrate
    * @param {Object} opts
    * @param {boolean} opts.visible - States if hash rate logs should be visible (true) or hidden (false)
    * @returns {Promise} Promise object.
    * @example <caption><b>Output while mining</b></caption>
    * { "status": "OK" }
    * @example <caption><b>Output while NOT mining. You need to catch it with promise.</b></caption>
    * Error: NOT MINING
    * at _request.then (C:\myDev\arqma-rpc-js\src\rpcDaemon.js:1418:27)
    * at process._tickCallback (internal/process/next_tick.js:68:7)
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.visible === 'undefined') return reject(new Error('must specify visible'))
        return this._request_other('set_log_hash_rate', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherSetLogLevel = function (opts) {
    /**
    * Set the daemon log level. By default, log level is set to 0.
    * @function
    * @name RPCDaemon#otherSetLogLevel
    * @param {Object} opts
    * @param {number} opts.level - Daemon log level to set from 0 (less verbose) to 4 (most verbose).
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { "status": "OK" }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.level === 'undefined') return reject(new Error('must specify level'))
        return this._request_other('set_log_level', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherSetLogCategories = function (opts) {
    /**
    * Set the daemon log categories.<br>
    * Categories are represented as a comma separated list of <Category\>:<level\> (similarly to syslog standard <Facility\>:<Severity-level\>), where:
    * <p><ul>
    * Category is one of the following:
    *   <li>\* - All facilities</li>
    *   <li>default</li>
    *   <li>net</li>
    *   <li>net.http</li>
    *   <li>net.p2p</li>
    *   <li>logging</li>
    *   <li>net.throttle</li>
    *   <li>blockchain.db</li>
    *   <li>blockchain.db.lmdb</li>
    *   <li>bcutil</li>
    *   <li>checkpoints</li>
    *   <li>net.dns</li>
    *   <li>net.dl</li>
    *   <li>i18n</li>
    *   <li>perf</li>
    *   <li>stacktrace</li>
    *   <li>updates</li>
    *   <li>account</li>
    *   <li>cn</li>
    *   <li>difficulty</li>
    *   <li>hardfork</li>
    *   <li>miner</li>
    *   <li>blockchain</li>
    *   <li>txpool</li>
    *   <li>cn.block_queue</li>
    *   <li>net.cn</li>
    *   <li>daemon</li>
    *   <li>debugtools.deserialize</li>
    *   <li>debugtools.objectsizes</li>
    *   <li>device.ledger</li>
    *   <li>wallet.gen_multisig</li>
    *   <li>multisig</li>
    *   <li>bulletproofs</li>
    *   <li>ringct</li>
    *   <li>daemon.rpc</li>
    *   <li>wallet.simplewallet</li>
    *   <li>WalletAPI</li>
    *   <li>wallet.ringdb</li>
    *   <li>wallet.wallet2</li>
    *   <li>wallet.rpc</li>
    *   <li>tests.core
    *   </ul>
    * <ul>
    * Level is one of the following:
    *   <li>FATAL - higher level</li>
    *   <li>ERROR</li>
    *   <li>WARNING</li>
    *   <li>INFO</li>
    *   <li>DEBUG</li>
    *   <li>TRACE - lower level A level automatically includes higher level.</li>
    *   </ul></p>
    *   By default, categories are set to *:WARNING,net:FATAL,net.p2p:FATAL,net.cn:FATAL,global:INFO,verify:FATAL,stacktrace:INFO,logging:INFO,msgwriter:INFO.<br>
    *   Setting the categories to "" prevent any logs to be outputed.
    * @function
    * @name RPCDaemon#otherSetLogCategories
    * @param {Object} opts
    * @param {number} [opts.categories] - Daemon log categories to enable.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  "categories": "*:INFO",
    *  "status": "OK"
    * }
    */
    return new Promise((resolve, reject) => {
      opts = opts || {}
      return this.queue.add(() => {
        return this._request_other('set_log_categories', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherGetTransactionPool = function () {
    /**
    * Show information about valid transactions seen by the node but not yet mined into a block, as well as spent key image information for the txpool in the node's memory.
    * @function
    * @name RPCDaemon#otherGetTransactionPool
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  spent_key_images:
    *  [
    *   { id_hash: '12f6051aea57b598e7aefe436545ab55f449b11d392fffd76e33eef53ad9b962',
    *     txs_hashes: [Array] },
     *    ...
     * ],
     * status: 'OK',
     * transactions:
     * [
     *  { blob_size: 4384,
     *    do_not_relay: false,
     *    double_spend_seen: false,
     *    fee: 37750,
     *    id_hash:
     *    '3fa2745621696d4e87d997e32409469cc3d734fda186f37878b8db2972a99a41',
     *    kept_by_block: false,
     *    last_failed_height: 0,
     *    last_failed_id_hash:
     *    '0000000000000000000000000000000000000000000000000000000000000000',
     *    last_relayed_time: 1554589504,
     *    max_used_block_height: 149373,
     *    max_used_block_id_hash:
     *    '3ed0b7d1c294def73dda48c6b3f43d724525fcbc08672782ec3a1e4c5a1b2f01',
     *    receive_time: 1554589504,
     *    relayed: true,
     *    tx_blob: ... ,
     *    tx_json: ... ,
     *   }
     * ],
     * untrusted: false
     * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        this._request_other('get_transaction_pool')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherGetTransactionPoolStats = function () {
    /**
    * Get the transaction pool statistics.
    * @function
    * @name RPCDaemon#otherGetTransactionPool
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  pool_stats:
    *  {
    *   bytes_max: 2785,
    *   bytes_med: 2785,
    *   bytes_min: 2785,
    *   bytes_total: 2785,
    *   fee_total: 22650,
    *   histo_98pc: 0,
    *   num_10m: 0,
    *   num_double_spends: 0,
    *   num_failing: 0,
    *   num_not_relayed: 0,
    *   oldest: 1554589922,
    *   txs_total: 1
    *  },
    *  status: 'OK',
    *  untrusted: false
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        this._request_other('get_transaction_pool_stats')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherStopDaemon = function () {
    /**
    * Send a command to the daemon to safely disconnect and shut down.
    * @function
    * @name RPCDaemon#otherStopDaemon
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { "status": "OK" }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        this._request_other('stop_daemon')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  /*
  // This method is a convenient backward support and should not be used anymore. See get_info JSON RPC for details.
  RPCDaemon.prototype.otherGetInfo = function () {
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        this._request_other('get_info')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }
*/

  RPCDaemon.prototype.otherGetLimit = function () {
    /**
    * Get daemon bandwidth limits.
    * @function
    * @name RPCDaemon#otherGetLimit
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  "limit_down": 8192,
    *  "limit_up": 128,
    *  "status": "OK",
    *  "untrusted": false
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        this._request_other('get_limit')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherSetLimit = function (opts) {
    /**
    * Set daemon bandwidth limits.
    * @function
    * @name RPCDaemon#otherSetLimit
    * @param {Object} opts
    * @param {number} [opts.limit_down] - Download limit in kBytes per second (-1 reset to default, 0 don't change the current limit).
    * @param {number} [opts.limit_up] - Upload limit in kBytes per second (-1 reset to default, 0 don't change the current limit).
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  limit_down: 16384,
    *  limit_up: 4096,
    *  status: 'OK'
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_other('set_limit', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherOutPeers = function (opts) {
    /**
    * Limit number of outgoing peers.
    * @function
    * @name RPCDaemon#otherOutPeers
    * @param {Object} opts
    * @param {number} opts.out_peers - Max number of outgoing peers.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { status: 'OK' }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.out_peers === 'undefined') return reject(new Error('must specify out_peers'))
        return this._request_other('out_peers', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCDaemon.prototype.otherInPeers = function (opts) {
    /**
    * Limit number of incoming peers.
    * @function
    * @name RPCDaemon#otherOutPeers
    * @param {Object} opts
    * @param {number} opts.in_peers - Max number of incoming peers.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { status: 'OK' }
    */

    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.in_peers === 'undefined') return reject(new Error('must specify in_peers'))
        return this._request_other('in_peers', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }
  /*
  // Obsolete. Conserved here for reference.
  RPCDaemon.prototype.otherStartSaveGraph = function () {
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        this._request_other('start_save_graph')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

    // Obsolete. Conserved here for reference.
    RPCDaemon.prototype.otherStopSaveGraph = function () {
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        this._request_other('stop_save_graph')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }
  */

  // /get_outs to implement
  // /update to implement

  RPCDaemon.prototype._request_rpc = function (method, parameters) {
    return new Promise((resolve, reject) => {
      this.options.path = '/json_rpc'
      if (typeof parameters === 'undefined') {
        return this._request(`{"jsonrpc":"2.0","id":"0","method":"${method}"}`).then((res) => {
          let json = JSON.parse(res.body)
          if (json.result && json.result['status'] === 'OK') {
            return resolve(json.result)
          } else {
            let error = new Error('RPC Error!')
            error.code = json.error['code']
            error.message = json.error['message']
            return reject(error)
          }
        }).catch((err) => {
          return reject(err)
        })
      } else {
        return this._request(`{"jsonrpc":"2.0","id":"0","method":"${method}","params":${JSON.stringify(parameters)}}`).then((res) => {
          let json = JSON.parse(res.body)
          if (json.result) {
            return resolve(json.result)
          } else {
            let error = new Error('RPC Error!')
            error.code = json.error['code']
            error.message = json.error['message']
            return reject(error)
          }
        }).catch((err) => {
          return reject(err)
        })
      }
    })
  }

  RPCDaemon.prototype._request_other = function (method, parameters) {
    return new Promise((resolve, reject) => {
      this.options.path = '/' + method
      if (typeof parameters === 'undefined') {
        return this._request().then((res) => {
          if (res.status === '200') {
            let json = JSON.parse(res.body)
            if (json.status === 'OK') {
              return resolve(json)
            } else {
              let error = new Error('RPC Error!')
              error.code = json.error['code']
              error.message = json.error['message']
              return reject(error)
            }
          } else {
            let error = new Error('HTTP Error!')
            error.code = res.status
            error.message = res.body
            return reject(error)
          }
        }).catch((err) => {
          return reject(err)
        })
      } else {
        return this._request(`${JSON.stringify(parameters)}`).then((res) => {
          if (res.status === '200') {
            let json = JSON.parse(res.body)
            if (json.status === 'OK') {
              return resolve(json)
            } else {
              let error = new Error('RPC Error!')
              error.code = json.error['code']
              error.message = json.error['message']
              return reject(error)
            }
          } else {
            let error = new Error('HTTP Error!')
            error.code = res.status
            error.message = res.body
            return reject(error)
          }
        }).catch((err) => {
          return reject(err)
        })
      }
    })
  }

  return RPCDaemon
})()

module.exports = RPCDaemon
