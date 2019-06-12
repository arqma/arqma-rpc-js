'use strict'

const RPCClient = require('../lib/rpcClient.js')

var RPCWallet = (function () {
  /**
  * Initializes a new instance of RPCWallet.<br>
  * When no username is provided digest authentication will not be used.
  * @constructs RPCWallet
  * @param {Object} opts
  * @param {string} opts.url - complete url with port 'http://127.0.0.1:20000' or 'https://127.0.0.1:20000'.
  * @param {string} [opts.username='Mufasa'] - username.
  * @param {string} [opts.password='Circle of Life'] - password.
  * @return {RPCWallet} returns a new instance of RPCWallet.
  */
  RPCWallet.prototype = Object.create(RPCClient.prototype)
  RPCWallet.prototype.constructor = RPCWallet

  // remove requestLimited as we queue the top functions
  delete RPCWallet.prototype.requestLimited

  function RPCWallet (opts) {
    RPCClient.call(this, opts)
  }

  RPCWallet.prototype.getBalance = function (opts) {
    /**
    * Return the wallet's balance.
    * @function
    * @name RPCWallet#getBalance
    * @param {Object} opts
    * @param {number} opts.account_index - Return balance for this account.
    * @param {number[]} [opts.address_indices] - Return balance detail for those subaddresses.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  balance: 0,
    *  multisig_import_needed: false,
    *  unlocked_balance: 0
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.account_index === 'undefined') return reject(new Error('must specify account_index'))
        return this._request_rpc('get_balance')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getAddress = function (opts) {
    /**
    * Return the wallet's addresses for an account. Optionally filter for specific set of subaddresses.
    * @function
    * @name RPCWallet#getAddress
    * @param {Object} opts
    * @param {number} opts.account_index - Return subaddresses for this account.
    * @param {number[]} [opts.address_index] - List of subaddresses to return from an account.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  address: 'ar2ucUkifo5g39rBYsGk4KKkCySVhQcZtd8iazcvnrH8jVFTEZBnQYifVDj89prrYMeBah6BRm6HtN7n5aKuZwd72yZvbzmNL',
    *  addresses:
    *  [
    *   {
    *    address: 'ar2ucUkifo5g39rBYsGk4KKkCySVhQcZtd8iazcvnrH8jVFTEZBnQYifVDj89prrYMeBah6BRm6HtN7n5aKuZwd72yZvbzmNL',
    *    address_index: 0,
    *    label: 'Primary account',
    *    used: false
    *   }
    *  ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.account_index === 'undefined') return reject(new Error('must specify account_index'))
        return this._request_rpc('get_address', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getAddressIndex = function (opts) {
    /**
    * Get account and address indexes from a specific (sub)address.
    * @function
    * @name RPCWallet#getAddressIndex
    * @param {Object} opts
    * @param {string} opts.address - (sub)address to look for.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  index:
    *  {
    *   major: 0,
    *   minor: 0
    *  }
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.address === 'undefined') return reject(new Error('must specify address'))
        return this._request_rpc('get_address_index', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.createAddress = function (opts) {
    /**
    * Create a new address for an account. Optionally, label the new address.
    * @function
    * @name RPCWallet#createAddress
    * @param {Object} opts
    * @param {number} opts.account_index - Create a new address for this account.
    * @param {string} [opts.label] - Label for the new address.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  address: 'aRS3Pz1Zc2nNEo3K3wcZCWWRQWvVrom7B72XdoZem22wUHtFhyqSMJnAUtGBd2coHZGyqwrzWrXud4q2B6T4rGic3gDgVGoau7',
    *  address_index: 1
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.account_index === 'undefined') return reject(new Error('must specify account_index'))
        return this._request_rpc('create_address', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.labelAddress = function (opts) {
    /**
    * Label an address.
    * @function
    * @name RPCWallet#labelAddress
    * @param {Object} opts
    * @param {number} opts.index.major - Account index for the subaddress.
    * @param {number} opts.index.minor -  Index of the subaddress in the account.
    * @param {string} opts.label - Label for the new address.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.index === 'undefined') return reject(new Error('must specify index'))
        if (Object.keys(opts.index).length === 0 && opts.index.constructor === Object) return reject(new Error('must specify index subparameters'))
        if (typeof opts.index.major === 'undefined') return reject(new Error('must specify index.major'))
        if (typeof opts.index.minor === 'undefined') return reject(new Error('must specify index.minor'))
        if (typeof opts.label === 'undefined') return reject(new Error('must specify label'))
        return this._request_rpc('label_address', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getAccounts = function (opts) {
    /**
    * Get all accounts for a wallet. Optionally filter accounts by tag.
    * @function
    * @name RPCWallet#getAccounts
    * @param {Object} [opts]
    * @param {string} [opts.tag] - Tag for filtering accounts.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  subaddress_accounts:
    *  [
    *   {
    *    account_index: 0,
    *    balance: 0,
    *    base_address: 'ar2ucUkifo5g39rBYsGk4KKkCySVhQcZtd8iazcvnrH8jVFTEZBnQYifVDj89prrYMeBah6BRm6HtN7n5aKuZwd72yZvbzmNL',
    *    label: 'Primary account',
    *    tag: '',
    *    unlocked_balance: 0
    *   }
    *  ],
    *  total_balance: 0,
    *  total_unlocked_balance: 0
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        return this._request_rpc('get_accounts', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.createAccount = function (opts) {
    /**
    * Create a new account with an optional label.
    * @function
    * @name RPCWallet#createAccount
    * @param {Object} opts
    * @param {string} [opts.label] - Label for the account.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  account_index: 1,
    *  address: 'aRS3fTmhpE7JWf1cv4q9LWWEfWMGSEXHYPeMYHxHkupUHrequ4CNs5mCq248sLPmQVBz96yUdVhivNXq5hQr6C4s7sNcWH4LHh'
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        return this._request_rpc('create_account', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.labelAccount = function (opts) {
    /**
    * Label an account.
    * @function
    * @name RPCWallet#labelAccount
    * @param {Object} opts
    * @param {number} opts.account_index - Apply label to account at this index.
    * @param {string} opts.label - Label for the account.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.account_index === 'undefined') return reject(new Error('must specify account_index'))
        if (typeof opts.label === 'undefined') return reject(new Error('must specify label'))
        return this._request_rpc('label_account', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getAccountTags = function () {
    /**
    * Get a list of user-defined account tags.
    * @function
    * @name RPCWallet#getAccountTags
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  account_tags:
    *  [
    *   { accounts: [Array], label: '', tag: 'created accounts' }
    *  ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('get_account_tags')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.tagAccounts = function (opts) {
    /**
    * Apply a filtering tag to a list of accounts.
    * @function
    * @name RPCWallet#tagAccounts
    * @param {Object} opts
    * @param {string} opts.tag - Tag for the accounts.
    * @param {number[]} opts.accounts - Tag this list of accounts.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.tag === 'undefined') return reject(new Error('must specify tag'))
        if (typeof opts.accounts === 'undefined') return reject(new Error('must specify accounts'))
        if (!(opts.accounts instanceof Array) || Object.prototype.toString.call(opts.accounts) !== '[object Array]') return reject(new Error('accounts should be an array of numbers'))
        return this._request_rpc('tag_accounts', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.untagAccounts = function (opts) {
    /**
    * Remove filtering tag from a list of accounts.
    * @function
    * @name RPCWallet#untagAccounts
    * @param {Object} opts
    * @param {number[]} opts.accounts - Remove tag from this list of accounts.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.accounts === 'undefined') return reject(new Error('must specify accounts'))
        if (!(opts.accounts instanceof Array) || Object.prototype.toString.call(opts.accounts) !== '[object Array]') return reject(new Error('accounts should be an array of numbers'))
        return this._request_rpc('untag_accounts', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.setAccountTagDescription = function (opts) {
    /**
    * Set description for an account tag.
    * @function
    * @name RPCWallet#setAccountTagDescription
    * @param {Object} opts
    * @param {string} opts.tag - The tag to add description.
    * @param {string} opts.description - Description for the tag.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.tag === 'undefined') return reject(new Error('must specify tag'))
        if (typeof opts.description === 'undefined') return reject(new Error('must specify description'))
        return this._request_rpc('set_account_tag_description', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getHeight = function () {
    /**
    * Returns the wallet's current block height.
    * @function
    * @name RPCWallet#getHeight
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  height: 149880
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('get_height')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.transfer = function (opts) {
    /**
    * Send ARQ to a number of recipients.
    * @function
    * @name RPCWallet#transfer
    * @param {Object} opts
    * @param {string[]} opts.destinations - Array of destinations to receive ARQ.
    * @param {number} opts.destinations[].amount - Amount to send to each destination, in atomic units.
    * @param {string} opts.destinations[].address - Destination public address.
    * @param {number} [opts.account_index] - Transfer from this account index. (Defaults to 0).
    * @param {number[]} [opts.subaddr_indices] - Transfer from this set of subaddresses. (Defaults to 0).
    * @param {number} opts.priority - Set a priority for the transaction. Accepted Values are: 0-3 for: default, unimportant, normal, elevated, priority.
    * @param {number} opts.mixin - Number of outputs from the blockchain to mix with (0 means no mixing).
    * @param {number} opts.ring_size - Number of outputs to mix in the transaction (this output + N decoys from the blockchain).
    * @param {number} opts.unlock_time - Number of blocks before the ARQ can be spent (0 to not add a lock).
    * @param {string} [opts.payment_id] - Random 32-byte/64-character hex string to identify a transaction.
    * @param {boolean} [opts.get_tx_key] - Return the transaction key after sending.
    * @param {boolean} [opts.do_not_relay] -  If true, the newly created transaction will not be relayed to the ArQmA network. (Defaults to false).
    * @param {boolean} [opts.get_tx_hex] - Return the transaction as hex string after sending (Defaults to false).
    * @param {boolean} [opts.get_tx_metadata] - Return the metadata needed to relay the transaction. (Defaults to false).
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  amount: 1000000000,
    *  fee: 121500,
    *  multisig_txset: '',
    *  tx_blob: '',
    *  tx_hash: '90796ef384f803d2aca1e32f0fce91a07b86ab8745cfaa1ebe60f7ae07c7e0d8',
    *  tx_key: '',
    *  tx_metadata: '',
    *  unsigned_txset: ''
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.destinations === 'undefined') return reject(new Error('must specify destinations'))
        if (typeof opts.destinations[0].amount === 'undefined') return reject(new Error('must specify destinations[0].amount'))
        if (typeof opts.destinations[0].address === 'undefined') return reject(new Error('must specify destinations[0].address'))
        if (typeof opts.priority === 'undefined') return reject(new Error('must specify priority'))
        if (typeof opts.mixin === 'undefined') return reject(new Error('must specify mixin'))
        if (typeof opts.ring_size === 'undefined') return reject(new Error('must specify ring_size'))
        if (typeof opts.unlock_time === 'undefined') return reject(new Error('must specify unlock_time'))
        return this._request_rpc('transfer', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.transferSplit = function (opts) {
    /**
    * Same as transfer, but can split into more than one tx if necessary.
    * @function
    * @name RPCWallet#transferSplit
    * @param {Object} opts
    * @param {string[]} opts.destinations - Array of destinations to receive ARQ.
    * @param {number} opts.destinations[].amount - Amount to send to each destination, in atomic units.
    * @param {string} opts.destinations[].address - Destination public address.
    * @param {number} [opts.account_index] - Transfer from this account index. (Defaults to 0).
    * @param {number[]} [opts.subaddr_indices] - Transfer from this set of subaddresses. (Defaults to 0).
    * @param {number} opts.mixin - Number of outputs from the blockchain to mix with (0 means no mixing).
    * @param {number} opts.ring_size - Sets ringsize to n (mixin + 1).
    * @param {number} opts.unlock_time - Number of blocks before the ARQ can be spent (0 to not add a lock).
    * @param {string} [opts.payment_id] - Random 32-byte/64-character hex string to identify a transaction.
    * @param {boolean} [opts.get_tx_keys] - Return the transaction keys after sending.
    * @param {number} opts.priority - Set a priority for the transaction. Accepted Values are: 0-3 for: default, unimportant, normal, elevated, priority.
    * @param {boolean} [opts.do_not_relay] -  If true, the newly created transaction will not be relayed to the ArQmA network. (Defaults to false).
    * @param {boolean} [opts.get_tx_hex] - Return the transactions as hex string after sending.
    * @param {boolean} [opts.new_algorithm] - True to use the new transaction construction algorithm, defaults to false.
    * @param {boolean} [opts.get_tx_metadata] - Return list of transaction metadata needed to relay the transfer later.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  amount_list: [ 10000000000 ],
    *  fee_list: [ 121500 ],
    *  multisig_txset: '',
    *  tx_hash_list:
    *  [ '550a0ad4520bc6dc93e039e9d5e752302d27e13526e877074536948faf3c5a1f' ],
    *  unsigned_txset: ''
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.destinations === 'undefined') return reject(new Error('must specify destinations'))
        if (typeof opts.destinations[0].amount === 'undefined') return reject(new Error('must specify destinations[0].amount'))
        if (typeof opts.destinations[0].address === 'undefined') return reject(new Error('must specify destinations[0].address'))
        if (typeof opts.mixin === 'undefined') return reject(new Error('must specify mixin'))
        if (typeof opts.ring_size === 'undefined') return reject(new Error('must specify ring_size'))
        if (typeof opts.unlock_time === 'undefined') return reject(new Error('must specify unlock_time'))
        if (typeof opts.priority === 'undefined') return reject(new Error('must specify priority'))
        return this._request_rpc('transfer_split', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.signTransfer = function (opts) {
    /**
    * Set description for an account tag.
    * @function
    * @name RPCWallet#signTransfer
    * @param {Object} opts
    * @param {string} opts.unsigned_txset - Set of unsigned tx returned by "transfer" or "transferSplit" methods.
    * @param {boolean} [opts.export_raw] - If true, return the raw transaction data. (Defaults to false).
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  signed_txset:'4172516d41207 ...',
    *  tx_hash_list: ['11dc58c45e048cf4596ff4726b0130bf389933c55bc0b48f82d168980eca122e']
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.unsigned_txset === 'undefined') return reject(new Error('must specify unsigned_txset'))
        return this._request_rpc('sign_transfer', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.submitTransfer = function (opts) {
    /**
    * Set description for an account tag.
    * @function
    * @name RPCWallet#submitTransfer
    * @param {Object} opts
    * @param {string} opts.tx_data_hex - Set of signed tx returned by "sign_transfer".
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  tx_hash_list: [ '11dc58c45e048cf4596ff4726b0130bf389933c55bc0b48f82d168980eca122e' ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.tx_data_hex === 'undefined') return reject(new Error('must specify tx_data_hex'))
        return this._request_rpc('submit_transfer', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.sweepDust = function (opts) {
    /**
    * Send all dust outputs back to the wallet's, to make them easier to spend (and mix).
    * @function
    * @name RPCWallet#sweepDust
    * @param {Object} opts
    * @param {boolean} [opts.get_tx_keys] - Return the transaction keys after sending.
    * @param {boolean} [opts.do_not_relay] - If true, the newly created transaction will not be relayed to the ArQmA network. (Defaults to false).
    * @param {boolean} [opts.get_tx_hex] - Return the transactions as hex string after sending. (Defaults to false).
    * @param {boolean} [opts.get_tx_metadata] - Return list of transaction metadata needed to relay the transfer later. (Defaults to false).
    * @returns {Promise} Promise object.
    * @example <caption><b>Output when there is no dust.</b></caption>
    * {
    *  multisig_txset: '',
    *  unsigned_txset: ''
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        return this._request_rpc('sweep_dust', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.sweepAll = function (opts) {
    /**
    * Send all unlocked balance to an address.
    * @function
    * @name RPCWallet#sweepAll
    * @param {Object} opts
    * @param {string} opts.address - Destination public address.
    * @param {number} opts.account_index - Sweep transactions from this account.
    * @param {number[]} [opts.subaddr_indices] - Sweep from this set of subaddresses in the account.
    * @param {number} [opts.priority] - Priority for sending the sweep transfer, partially determines fee.
    * @param {number} opts.mixin - Number of outputs from the blockchain to mix with (0 means no mixing).
    * @param {number} opts.ring_size - Sets ringsize to n (mixin + 1).
    * @param {number} opts.unlock_time - Number of blocks before the ARQ can be spent (0 to not add a lock).
    * @param {string} [opts.payment_id] - Random 32-byte/64-character hex string to identify a transaction.
    * @param {boolean} [opts.get_tx_keys] -  Return the transaction keys after sending.
    * @param {number} [opts.below_amount] - Include outputs below this amount.
    * @param {boolean} [opts.do_not_relay] - If true, do not relay this sweep transfer. (Defaults to false).
    * @param {boolean} [opts.get_tx_hex] - Return the transactions as hex encoded string. (Defaults to false).
    * @param {boolean} [opts.get_tx_metadata] - Return the transaction metadata as a string. (Defaults to false).
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  amount_list: [ 322790663594, 303554155996, 322790933785, 263080732210 ],
    *  fee_list: [ 105300, 105300, 105300, 97200 ],
    *  multisig_txset: '',
    *  tx_hash_list:
    *   [
    *    '1b192df60976e25f64aa161a6c8101aa58f9a4df8a807eda6efb45f6cc4c9954',
    *    '9ab16dc055543b93fd6cdb72088841453d8f0434c2c4fe0b973731a9802d2833',
    *    'cfdbb18284f0e48e2c3e90e365ff1fc027773016176cc5b45d6961b9783dcfb9',
    *    '7a515c0f87d5a1f330b46fe2b21eb13466b15499c2374c705f0e98ec7fd64471'
    *   ],
    *  unsigned_txset: ''
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.address === 'undefined') return reject(new Error('must specify address'))
        if (typeof opts.account_index === 'undefined') return reject(new Error('must specify account_index'))
        if (typeof opts.mixin === 'undefined') return reject(new Error('must specify mixin'))
        if (typeof opts.ring_size === 'undefined') return reject(new Error('must specify ring_size'))
        if (typeof opts.unlock_time === 'undefined') return reject(new Error('must specify unlock_time'))
        return this._request_rpc('sweep_all', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.sweepSingle = function (opts) {
    /**
    * Send all of a specific unlocked output to an address.
    * @function
    * @name RPCWallet#sweepSingle
    * @param {Object} opts
    * @param {string} opts.address - Destination public address.
    * @param {number} opts.account_index - Sweep transactions from this account.
    * @param {number[]} [opts.subaddr_indices] - Sweep from this set of subaddresses in the account.
    * @param {number} [opts.priority] - Priority for sending the sweep transfer, partially determines fee.
    * @param {number} opts.mixin - Number of outputs from the blockchain to mix with (0 means no mixing).
    * @param {number} opts.ring_size - Sets ringsize to n (mixin + 1).
    * @param {number} opts.unlock_time - Number of blocks before the ARQ can be spent (0 to not add a lock).
    * @param {string} [opts.payment_id] - Random 32-byte/64-character hex string to identify a transaction.
    * @param {boolean} [opts.get_tx_keys] -  Return the transaction keys after sending.
    * @param {number} [opts.below_amount] - Include outputs below this amount.
    * @param {boolean} [opts.do_not_relay] - If true, do not relay this sweep transfer. (Defaults to false).
    * @param {boolean} [opts.get_tx_hex] - Return the transactions as hex encoded string. (Defaults to false).
    * @param {boolean} [opts.get_tx_metadata] - Return the transaction metadata as a string. (Defaults to false).
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  amount: 20178483807,
    *  fee: 32280,
    *  multisig_txset: '',
    *  tx_blob: '',
    *  tx_hash: 'c71baea6d6e159def22666487d43b7bb9d5ee4bd141497bf5b289714d0089b46',
    *  tx_key: '',
    *  tx_metadata: '',
    *  unsigned_txset: ''
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.address === 'undefined') return reject(new Error('must specify address'))
        if (typeof opts.account_index === 'undefined') return reject(new Error('must specify account_index'))
        if (typeof opts.mixin === 'undefined') return reject(new Error('must specify mixin'))
        if (typeof opts.ring_size === 'undefined') return reject(new Error('must specify ring_size'))
        if (typeof opts.unlock_time === 'undefined') return reject(new Error('must specify unlock_time'))
        return this._request_rpc('sweep_single', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.relayTx = function (opts) {
    /**
    * Relay a transaction previously created with "do_not_relay":true.
    * @function
    * @name RPCWallet#relayTx
    * @param {Object} opts
    * @param {string} opts.hex - Transaction metadata returned from a transfer method with get_tx_metadata set to true.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  fee: 0,
    *  tx_blob: '',
    *  tx_hash: 'd5131629c1fea507ff9e1aae4da4207c7addc7fe1700343834304aa1208fe284',
    *  tx_key: ''
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.hex === 'undefined') return reject(new Error('must specify hex'))
        return this._request_rpc('relay_tx', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.store = function () {
    /**
    * Save the wallet file.
    * @function
    * @name RPCWallet#store
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('store')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getPayments = function (opts) {
    /**
    * Get a list of incoming payments using a given payment id.
    * @function
    * @name RPCWallet#getPayments
    * @param {Object} opts
    * @param {string} opts.payment_id - Payment ID used to find the payments (16 characters hex).
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  payments:
    *  [
    *   {
    *    address: 'as3ne6ewX5GBfSkQZsWi5YWjTG9xRSA5fMYBM7sfawiqWr2n1qd5Y4JJEWKXE1dKRCNuVWQLeknUmWascmFBNwKi1zyBaB9n2',
    *    amount: 1100000000,
    *    block_height: 8667,
    *    payment_id: '8ca523f5e9506fed',
    *    subaddr_index: [Object],
    *    tx_hash: '577d8d53135d49b46238c37fe2429e38610b0fcc4f06799969a7b60c69388d53',
    *    unlock_time: 0
    *   },
    *   ...
    *  ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.payment_id === 'undefined') return reject(new Error('must specify payment_id'))
        return this._request_rpc('get_payments', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getBulkPayments = function (opts) {
    /**
    * Get a list of incoming payments using a given payment id, or a list of payments ids, from a given height. This method is the preferred method over get_payments because it has the same functionality but is more extendable. Either is fine for looking up transactions by a single payment ID.
    * @function
    * @name RPCWallet#getBulkPayments
    * @param {Object} opts
    * @param {string[]} opts.payment_id - Payment IDs used to find the payments (16 characters hex).
    * @param {number} opts.min_block_height - The block height at which to start looking for payments.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  payments:
    *  [
    *   {
    *    address: 'as3ne6ewX5GBfSkQZsWi5YWjTG9xRSA5fMYBM7sfawiqWr2n1qd5Y4JJEWKXE1dKRCNuVWQLeknUmWascmFBNwKi1zyBaB9n2',
    *    amount: 1100000000,
    *    block_height: 8667,
    *    payment_id: '8ca523f5e9506fed',
    *    subaddr_index: [Object],
    *    tx_hash: '577d8d53135d49b46238c37fe2429e38610b0fcc4f06799969a7b60c69388d53',
    *    unlock_time: 0
    *   },
    *   ...
    *  ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.payment_ids === 'undefined') return reject(new Error('must specify payment_ids'))
        if (!(opts.payment_ids instanceof Array) || Object.prototype.toString.call(opts.payment_ids) !== '[object Array]') return reject(new Error('payments_ids should be an array of strings'))
        if (typeof opts.min_block_height === 'undefined') return reject(new Error('must specify min_block_height'))
        return this._request_rpc('get_bulk_payments', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.incomingTransfers = function (opts) {
    /**
    * Return a list of incoming transfers to the wallet.
    * @function
    * @name RPCWallet#incomingTransfers
    * @param {Object} opts
    * @param {string} opts.transfer_type - "all": all the transfers, "available": only transfers which are not yet spent, OR "unavailable": only transfers which are already spent.
    * @param {number} [opts.account_index] - Return transfers for this account. (defaults to 0).
    * @param {number[]} [opts.subaddr_indices] - Return transfers sent to these subaddresses.
    * @param {boolean} [opts.verbose] - Enable verbose output, return key image if true.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  transfers:
    *  [
    *   {
    *    amount: 262791826099,
    *    global_index: 11793,
    *    key_image: '44fb690de7d1cd53b8e8541bf7e15b107cbf9d6f3df22b15cd3ce969913f48c5',
    *    spent: false,
    *    subaddr_index: [Object],
    *    tx_hash: 'f10f1629f2196466aa084aa2431a603f2f600178e6fb56019654a51f9c82f44f',
    *    tx_size: 763
    *   },
    *   ...
    *  ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.transfer_type === 'undefined') return reject(new Error('must specify transfer_type'))
        return this._request_rpc('incoming_transfers', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.queryKey = function (opts) {
    /**
    * Return the spend or view private key.
    * @function
    * @name RPCWallet#queryKey
    * @param {Object} opts
    * @param {string} opts.key_type - Which key to retrieve: "mnemonic" - the mnemonic seed (older wallets do not have one) OR "view_key" OR "spend_key".
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { key: 'fa33f26d6ff9a77ef83e080aa6ae51e0d59b7d0e395e83100923e8c4708c3c0a' }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.key_type === 'undefined') return reject(new Error('must specify key_type'))
        return this._request_rpc('query_key', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.makeIntegratedAddress = function (opts) {
    /**
    * Make an integrated address from the wallet address and a payment id.
    * @function
    * @name RPCWallet#makeIntegratedAddress
    * @param {Object} [opts]
    * @param {string} [opts.standard_address] - Defaults to primary address. Destination public address.
    * @param {string} [opts.payment_id] - Defaults to a random ID. 16 characters hex encoded.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  integrated_address: 'aRi1jaEgqSRHvoAkNKDLGKB8xVtSxUMf6e8UW7nKdVb6KFLxtYXBQqR6p9EstjPcqTZ5yb4L6RcWeXf5ijwo68MiCgHwN7uH3J843oBLn3e1Z',
    *  payment_id: '8ca523f5e9506fed'
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        return this._request_rpc('make_integrated_address', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.splitIntegratedAddress = function (opts) {
    /**
    * Retrieve the standard address and payment id corresponding to an integrated address.
    * @function
    * @name RPCWallet#splitIntegratedAddress
    * @param {Object} opts
    * @param {string} opts.integrated_address - Integrated address.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  is_subaddress: false,
    *  payment_id: 'e558803fb1958fc8',
    *  standard_address: 'as3ne6ewX5GBfSkQZsWi5YWjTG9xRSA5fMYBM7sfawiqWr2n1qd5Y4JJEWKXE1dKRCNuVWQLeknUmWascmFBNwKi1zyBaB9n2'
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.integrated_address === 'undefined') return reject(new Error('must specify integrated_address'))
        return this._request_rpc('split_integrated_address', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.stopWallet = function () {
    /**
    * Stops the wallet, storing the current state.
    * @function
    * @name RPCWallet#stopWallet
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('stop_wallet')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.rescanBlockchain = function () {
    /**
    * Rescan the blockchain from scratch, losing any information which can not be recovered from the blockchain itself. This includes destination addresses, tx secret keys, tx notes, etc.
    * @function
    * @name RPCWallet#rescanBlockchain
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('rescan_blockchain')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.setTxNotes = function (opts) {
    /**
    * Set arbitrary string notes for transactions.
    * @function
    * @name RPCWallet#setTxNotes
    * @param {Object} opts
    * @param {string[]} opts.txids - Transaction ids.
    * @param {string[]} opts.notes - Notes for the transactions.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.txids === 'undefined') return reject(new Error('must specify txids'))
        if (!(opts.txids instanceof Array) || Object.prototype.toString.call(opts.txids) !== '[object Array]') return reject(new Error('txids should be an array of strings'))
        if (typeof opts.notes === 'undefined') return reject(new Error('must specify notes'))
        if (!(opts.notes instanceof Array) || Object.prototype.toString.call(opts.notes) !== '[object Array]') return reject(new Error('notes should be an array of strings'))
        return this._request_rpc('set_tx_notes', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getTxNotes = function (opts) {
    /**
    * Get string notes for transactions.
    * @function
    * @name RPCWallet#getTxNotes
    * @param {Object} opts
    * @param {string[]} opts.txids - Transaction ids.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  notes: [ 'coffee', 'bread' ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.txids === 'undefined') return reject(new Error('must specify txids'))
        if (!(opts.txids instanceof Array) || Object.prototype.toString.call(opts.txids) !== '[object Array]') return reject(new Error('txids should be an array of strings'))
        return this._request_rpc('get_tx_notes', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.setAttribute = function (opts) {
    /**
    * Set arbitrary attribute.
    * @function
    * @name RPCWallet#setAttribute
    * @param {Object} opts
    * @param {string} opts.key - Attribute name.
    * @param {string} opts.value - Attribute value.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.key === 'undefined') return reject(new Error('must specify key'))
        if (typeof opts.value === 'undefined') return reject(new Error('must specify value'))
        return this._request_rpc('set_attribute', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getAttribute = function (opts) {
    /**
    * Get arbitrary attribute.
    * @function
    * @name RPCWallet#getAttribute
    * @param {Object} opts
    * @param {string} opts.key - Attribute name.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  value": 'my_value'
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.key === 'undefined') return reject(new Error('must specify key'))
        return this._request_rpc('get_attribute', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getTxKey = function (opts) {
    /**
    * Get transaction secret key from transaction id.
    * @function
    * @name RPCWallet#getTxKey
    * @param {Object} opts
    * @param {string} opts.txid - Transaction id.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  tx_key: '1f2e9895ff77c15eb11ad971b668c353943aa5f0f7a328cd01f9ff5d47b43d09'
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.txid === 'undefined') return reject(new Error('must specify txid'))
        return this._request_rpc('get_tx_key', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.checkTxKey = function (opts) {
    /**
    * Check a transaction in the blockchain with its secret key.
    * @function
    * @name RPCWallet#checkTxKey
    * @param {Object} opts
    * @param {string} opts.txid - Transaction id.
    * @param {string} opts.tx_key - Transaction secret key.
    * @param {string} opts.address - Destination public address of the transaction.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  confirmations: 18446744073709552000,
    *  in_pool: true,
    *  received: 0
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.txid === 'undefined') return reject(new Error('must specify txid'))
        if (typeof opts.tx_key === 'undefined') return reject(new Error('must specify tx_key'))
        if (typeof opts.address === 'undefined') return reject(new Error('must specify address'))
        return this._request_rpc('check_tx_key', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getTxProof = function (opts) {
    /**
    * Get transaction signature to prove it.
    * @function
    * @name RPCWallet#getTxProof
    * @param {Object} opts
    * @param {string} opts.txid - Transaction id.
    * @param {string} opts.address - Destination public address of the transaction.
    * @param {string} [opts.message] - Add a message to the signature to further authenticate the prooving process.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  signature: 'InProofV1MupvkPBMgUS3Se3X1jjJqjFmZpv2DfrU7AVPoSe7fizkC3C6fcXxEpFfPqVxzmWu8d1wcoBvqjaQoJUD7Wh133PzbG1CdRC2WfABu5kkg3Ko1e4nPjRZhgzLeDY464TVoTTJ'
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.txid === 'undefined') return reject(new Error('must specify txid'))
        if (typeof opts.address === 'undefined') return reject(new Error('must specify address'))
        return this._request_rpc('get_tx_proof', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.checkTxProof = function (opts) {
    /**
    * Prove a transaction by checking its signature.
    * @function
    * @name RPCWallet#checkTxProof
    * @param {Object} opts
    * @param {string} opts.txid - Transaction id.
    * @param {string} opts.address - Destination public address of the transaction.
    * @param {string} [opts.message] - Should be the same message used in get_tx_proof.
    * @param {string} opts.signature - Transaction signature to confirm.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  confirmations: 1502,
    *  good: true,
    *  in_pool: false,
    *  received: 12000000000
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.txid === 'undefined') return reject(new Error('must specify txid'))
        if (typeof opts.address === 'undefined') return reject(new Error('must specify address'))
        if (typeof opts.signature === 'undefined') return reject(new Error('must specify signature'))
        return this._request_rpc('check_tx_proof', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getSpendProof = function (opts) {
    /**
    * Generate a signature to prove a spend. Unlike proving a transaction, it does not requires the destination public address.
    * @function
    * @name RPCWallet#getSpendProof
    * @param {Object} opts
    * @param {string} opts.txid - Transaction id.
    * @param {string} [opts.message] - Add a message to the signature to further authenticate the prooving process.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { signature: 'SpendProofV1TsQK...' }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.txid === 'undefined') return reject(new Error('must specify txid'))
        return this._request_rpc('get_spend_proof', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.checkSpendProof = function (opts) {
    /**
    * Prove a spend using a signature. Unlike proving a transaction, it does not requires the destination public address.
    * @function
    * @name RPCWallet#checkSpendProof
    * @param {Object} opts
    * @param {string} opts.txid - Transaction id.
    * @param {string} [opts.message] - Should be the same message used in get_tx_proof.
    * @param {string} opts.signature - Transaction signature to confirm.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { good: true }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.txid === 'undefined') return reject(new Error('must specify txid'))
        if (typeof opts.signature === 'undefined') return reject(new Error('must specify signature'))
        return this._request_rpc('check_spend_proof', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getReserveProof = function (opts) {
    /**
    * Generate a signature to prove of an available amount in a wallet.
    * @function
    * @name RPCWallet#getReserveProof
    * @param {Object} opts
    * @param {boolean} opts.all - Proves all wallet balance to be disposable.
    * @param {number} opts.account_index - Specify the account from witch to prove reserve. (ignored if all is set to true).
    * @param {number} opts.amount - Amount (in atomic units) to prove the account has for reserve. (ignored if all is set to true).
    * @param {string} [opts.message] - Should be the same message used in get_tx_proof.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { signature: 'ReserveProofV11BZ2 ...' }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.all === 'undefined') return reject(new Error('must specify all'))
        if (typeof opts.account_index === 'undefined') return reject(new Error('must specify account_index'))
        if (typeof opts.amount === 'undefined') return reject(new Error('must specify amount'))
        return this._request_rpc('get_reserve_proof', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.checkReserveProof = function (opts) {
    /**
    * Proves a wallet has a disposable reserve using a signature.
    * @function
    * @name RPCWallet#checkReserveProof
    * @param {Object} opts
    * @param {string} opts.address - Public address of the wallet.
    * @param {string} [opts.message] - Should be the same message used in get_reserve_proof.
    * @param {string} opts.signature - Reserve signature to confirm.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  good: true,
    *  spent: 0,
    *  total: 6000000000
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.address === 'undefined') return reject(new Error('must specify address'))
        if (typeof opts.signature === 'undefined') return reject(new Error('must specify signature'))
        return this._request_rpc('check_reserve_proof', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getTransfers = function (opts) {
    /**
    * Returns a list of transfers.
    * @function
    * @name RPCWallet#getTransfers
    * @param {Object} [opts]
    * @param {boolean} [opts.in] - Include incoming transfers.
    * @param {boolean} [opts.out] - Include outgoing transfers.
    * @param {boolean} [opts.pending] - Include pending transfers.
    * @param {boolean} [opts.failed] - Include failed transfers.
    * @param {boolean} [opts.pool] - Include transfers from the daemon's transaction pool.
    * @param {boolean} [opts.filter_by_height] - Filter transfers by block height.
    * @param {boolean} [opts.min_height] - Minimum block height to scan for transfers, if filtering by height is enabled.
    * @param {boolean} [opts.max_height] - Maximum block height to scan for transfers, if filtering by height is enabled.
    * @param {number} [opts.account_index] - Index of the account to query for transfers. (defaults to 0).
    * @param {number[]} [opts.subaddr_indices] - List of subaddress indices to query for transfers. (defaults to 0).
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  in:
    *  [
    *   { address: 'as3ne6ewX5GBfSkQZsWi5YWjTG9xRSA5fMYBM7sfawiqWr2n1qd5Y4JJEWKXE1dKRCNuVWQLeknUmWascmFBNwKi1zyBaB9n2',
    *     amount: 303838957143,
    *     confirmations: 960,
    *     double_spend_seen: false,
    *     fee: 105040,
    *     height: 7878,
    *     note: '',
    *     payment_id: '0000000000000000',
    *     subaddr_index: [Object],
    *     suggested_confirmations_threshold: 16,
    *     timestamp: 1558406226,
    *     txid: '666d97c738679527d0943e2c03bcfec5889b488ad4b84cb6f0b40d8f0970bc4a',
    *     type: 'in',
    *     unlock_time: 0
    *    },
    *    ...
    *  ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        return this._request_rpc('get_transfers', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getTransferByTxId = function (opts) {
    /**
    * Show information about a transfer to/from this address.
    * @function
    * @name RPCWallet#getTransferByTxId
    * @param {Object} opts
    * @param {string} opts.txid - Transaction ID used to find the transfer.
    * @param {string} [opts.account_index] - Index of the account to query for the transfer.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  transfer:
    *  {
    *   address: 'as3ne6ewX5GBfSkQZsWi5YWjTG9xRSA5fMYBM7sfawiqWr2n1qd5Y4JJEWKXE1dKRCNuVWQLeknUmWascmFBNwKi1zyBaB9n2',
    *   amount: 12000000000,
    *   confirmations: 918,
    *   double_spend_seen: false,
    *   fee: 24240,
    *   height: 7924,
    *   note: '',
    *   payment_id: '8ca523f5e9506fed',
    *   subaddr_index: { major: 0, minor: 0 },
    *   suggested_confirmations_threshold: 1,
    *   timestamp: 1558474233,
    *   txid: 'cf51c2ce7c0197a7cc813b264d6289095170b06c0ef2540ad8f22f36cd656869',
    *   type: 'in',
    *   unlock_time: 0
    *  },
    *  transfers:
    *  [
    *   {
    *    address: 'as3ne6ewX5GBfSkQZsWi5YWjTG9xRSA5fMYBM7sfawiqWr2n1qd5Y4JJEWKXE1dKRCNuVWQLeknUmWascmFBNwKi1zyBaB9n2',
    *    amount: 12000000000,
    *    confirmations: 918,
    *    double_spend_seen: false,
    *    fee: 24240,
    *    height: 7924,
    *    note: '',
    *    payment_id: '8ca523f5e9506fed',
    *    subaddr_index: [Object],
    *    suggested_confirmations_threshold: 1,
    *    timestamp: 1558474233,
    *    txid: 'cf51c2ce7c0197a7cc813b264d6289095170b06c0ef2540ad8f22f36cd656869',
    *    type: 'in',
    *    unlock_time: 0
    *   }
    *  ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.txid === 'undefined') return reject(new Error('must specify txid'))
        return this._request_rpc('get_transfer_by_txid', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.sign = function (opts) {
    /**
    * Sign a string.
    * @function
    * @name RPCWallet#sign
    * @param {Object} opts
    * @param {string} opts.data - Anything you need to sign.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { signature: 'SigV1DXD2ELMXAZyREwEoVMinMyXww7nfdtwCje47UbUGHjDY8Qk6QF9Ckdz7EnbcpkXQ3h3FCDSNBr7Us3cqaPnoQswn' }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.data === 'undefined') return reject(new Error('must specify data'))
        return this._request_rpc('sign', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.verify = function (opts) {
    /**
    * Verify a signature on a string.
    * @function
    * @name RPCWallet#verify
    * @param {Object} opts
    * @param {string} opts.data - What should have been signed.
    * @param {string} opts.address - Public address of the wallet used to sign the data.
    * @param {string} opts.signature - Signature generated by sign method.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { good: true }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.data === 'undefined') return reject(new Error('must specify data'))
        if (typeof opts.address === 'undefined') return reject(new Error('must specify address'))
        if (typeof opts.signature === 'undefined') return reject(new Error('must specify signature'))
        return this._request_rpc('verify', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.exportOutputs = function (opts) {
    /**
    * Export all outputs in hex format.
    * @function
    * @name RPCWallet#exportOutputs
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  outputs_data_hex: '4172516d41206f ...f'
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        return this._request_rpc('export_outputs', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.importOutputs = function (opts) {
    /**
    * Import outputs in hex format.
    * @function
    * @name RPCWallet#importOutputs
    * @param {Object} opts
    * @param {string} opts.outputs_data_hex - Wallet outputs in hex format.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { num_imported: 24 }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.outputs_data_hex === 'undefined') return reject(new Error('must specify outputs_data_hex'))
        return this._request_rpc('import_outputs', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.exportKeyImages = function (opts) {
    /**
    * Export a signed set of key images.
    * @function
    * @name RPCWallet#exportKeyImages
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  signed_key_images:
    *  [
    *   { key_image: '264d2998d74a60292322f8a1ec4b317bd8e4c16147385cca92aef734bda2e5f7',
    *     signature: '97bc571ce5634117fd96a5fab65bd1817dd35176e11125b752014d9039478f0c4386000f2719c338a8e7db02b6af6a81ccd346fbb3284f5a495e93510272ac09'
    *   },
    *   ...
    *  ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        return this._request_rpc('export_key_images', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.importKeyImages = function (opts) {
    /**
    * Import signed key images list and verify their spent status.
    * @function
    * @name RPCWallet#importKeyImages
    * @param {Object} opts
    * @param {string[]} opts.signed_key_images - Signed key images.
    * @param {string} opts.signed_key_images[].key_image - Key image.
    * @param {string} opts.signed_key_images[].signature - Signature.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  height: 5536,
    *  spent: 343653984001,
    *  unspent: 141498689149
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.signed_key_images === 'undefined') return reject(new Error('must specify signed_key_images'))
        if (!(opts.signed_key_images instanceof Array) || Object.prototype.toString.call(opts.signed_key_images) !== '[object Array]') return reject(new Error('signed_key_images should be an array of {key, signature}'))
        if (typeof opts.signed_key_images[0].key_image === 'undefined') return reject(new Error('must specify signed_key_images[0].key'))
        if (typeof opts.signed_key_images[0].signature === 'undefined') return reject(new Error('must specify signed_key_images[0].signature'))
        return this._request_rpc('import_key_images', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.makeUri = function (opts) {
    /**
    * Create a payment URI using the official URI spec.
    * @function
    * @name RPCWallet#makeUri
    * @param {Object} opts
    * @param {string} opts.address - Wallet address.
    * @param {number} [opts.amount] - The integer amount to receive, in atomic units.
    * @param {string} [opts.payment_id] - 16 or 64 character hexadecimal payment id.
    * @param {string} [opts.recipient_name] - Name of the payment recipient.
    * @param {string} [opts.tx_description] - Description of the reason for the tx.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  uri: 'arqma:as3ne6ewX5GBfSkQZsWi5YWjTG9xRSA5fMYBM7sfawiqWr2n1qd5Y4JJEWKXE1dKRCNuVWQLeknUmWascmFBNwKi1zyBaB9n2?tx_payment_id=8ca523f5e9506fed&tx_amount=1.000000000&recipient_name=stagenet%20B&tx_description=test'
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.address === 'undefined') return reject(new Error('must specify address'))
        return this._request_rpc('make_uri', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.parseUri = function (opts) {
    /**
    * Parse a payment URI to get payment information.
    * @function
    * @name RPCWallet#parseUri
    * @param {Object} opts
    * @param {string} opts.uri - This contains all the payment input information as a properly formatted payment URI.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  uri:
    *  {
    *   address: 'as3ne6ewX5GBfSkQZsWi5YWjTG9xRSA5fMYBM7sfawiqWr2n1qd5Y4JJEWKXE1dKRCNuVWQLeknUmWascmFBNwKi1zyBaB9n2',
    *   amount: 1000000000,
    *   payment_id: '8ca523f5e9506fed',
    *   recipient_name: 'stagenet B',
    *   tx_description: 'test'
    *  }
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.uri === 'undefined') return reject(new Error('must specify uri'))
        return this._request_rpc('parse_uri', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getAddressBook = function (opts) {
    /**
    * Retrieves entries from the address book.
    * @function
    * @name RPCWallet#getAddressBook
    * @param {Object} opts
    * @param {number[]} opts.entries - Indices of the requested address book entries.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  entries:
    *   [
    *    {
    *     address: 'ar3oJsuAn3f31weg11zx27AoReEBPRtv5XRLtoYJRGVcQFNuXJcPtftBvcZz4YW7Fj4c4iV9G81299rz1ZB72kie2M3afy6ho',
    *     description: 'test',
    *     index: 0,
    *     payment_id: '0000000000000000000000000000000000000000000000000000000000000000'
    *    }
    *  ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.entries === 'undefined') return reject(new Error('must specify entries'))
        if (!(opts.entries instanceof Array) || Object.prototype.toString.call(opts.entries) !== '[object Array]') return reject(new Error('entries should be an array of unsigned int'))
        return this._request_rpc('get_address_book', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.addAddressBook = function (opts) {
    /**
    * Retrieves entries from the address book.
    * @function
    * @name RPCWallet#addAddressBook
    * @param {Object} opts
    * @param {string} opts.address - Address.
    * @param {string} [opts.payment_id] - Defaults to "0000000000000000000000000000000000000000000000000000000000000000".
    * @param {string} [opts.description] - Defaults to "".
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  index: 0
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.address === 'undefined') return reject(new Error('must specify address'))
        return this._request_rpc('add_address_book', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.deleteAddressBook = function (opts) {
    /**
    * Delete an entry from the address book.
    * @function
    * @name RPCWallet#deleteAddressBook
    * @param {Object} opts
    * @param {number} opts.index - The index of the address book entry.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.index === 'undefined') return reject(new Error('must specify index'))
        return this._request_rpc('delete_address_book', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.refresh = function (opts) {
    /**
    * Refresh a wallet after opening.
    * @function
    * @name RPCWallet#refresh
    * @param {Object} [opts]
    * @param {number} [opts.start_height] - The block height from which to start refreshing.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  blocks_fetched: 3,
    *  received_money: false
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        return this._request_rpc('refresh', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.autoRefresh = function (opts) {
    /**
    * Refresh wallet on interval.
    * @function
    * @name RPCWallet#autoRefresh
    * @param {Object} [opts]
    * @param {boolean} opts.enable - True to enable. False to deactivate.
    * @param {number} [opts.period] - Interval in seconds. Default is 20.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        return this._request_rpc('auto_refresh', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.rescanSpent = function (opts) {
    /**
    * Refresh a wallet after opening.
    * @function
    * @name RPCWallet#rescanSpent
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('rescan_spent')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.startMining = function (opts) {
    /**
    * Start mining in the ArQmA daemon.
    * @function
    * @name RPCWallet#startMining
    * @param {Object} opts
    * @param {number} opts.threads_count - Number of threads created for mining.
    * @param {boolean} opts.do_background_mining - Allow to start the miner in smart mining mode.
    * @param {boolean} opts.ignore_battery - Ignore battery status (for smart mining only).
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.threads_count === 'undefined') return reject(new Error('must specify threads_count'))
        if (typeof opts.do_background_mining === 'undefined') return reject(new Error('must specify do_background_mining'))
        if (typeof opts.ignore_battery === 'undefined') return reject(new Error('must specify ignore_battery'))
        return this._request_rpc('start_mining', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.stopMining = function (opts) {
    /**
    * Refresh a wallet after opening.
    * @function
    * @name RPCWallet#stopMining
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('stop_mining')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getLanguages = function () {
    /**
    * Get a list of available languages for your wallet's seed.
    * @function
    * @name RPCWallet#getLanguages
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  languages:
    *  [
    *   'Deutsch',
    *   'English',
    *   'Español',
    *   'Français',
    *   'Italiano',
    *   'Nederlands',
    *   'Português',
    *   'русский язык',
    *   '日本語',
    *   '简体中文 (中国)',
    *   'Esperanto',
    *   'Lojban'
    *  ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('get_languages')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.createWallet = function (opts) {
    /**
    * Create a new wallet. You need to have set the argument "–wallet-dir" when launching arqma-wallet-rpc to make this work.
    * @function
    * @name RPCWallet#createWallet
    * @param {Object} opts
    * @param {string} opts.filename - Wallet file name.
    * @param {string} [opts.password] - password to protect the wallet.
    * @param {string} opts.language - Language for your wallets' seed.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.filename === 'undefined') return reject(new Error('must specify filename'))
        if (typeof opts.language === 'undefined') return reject(new Error('must specify language'))
        return this._request_rpc('create_wallet', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.openWallet = function (opts) {
    /**
    * Open a wallet. You need to have set the argument "–wallet-dir" when launching arqma-wallet-rpc to make this work.
    * @function
    * @name RPCWallet#openWallet
    * @param {Object} opts
    * @param {string} opts.filename - Wallet name stored in –wallet-dir.
    * @param {string} [opts.password] - Only needed if the wallet has a password defined.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.filename === 'undefined') return reject(new Error('must specify filename'))
        return this._request_rpc('open_wallet', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.closeWallet = function () {
    /**
    * Close the currently opened wallet, after trying to save it.
    * @function
    * @name RPCWallet#closeWallet
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('close_wallet')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.changeWalletPassword = function (opts) {
    /**
    * Change a wallet password.
    * @function
    * @name RPCWallet#changeWalletPassword
    * @param {Object} [opts]
    * @param {string} [opts.old_password] - Current wallet password, if defined.
    * @param {string} [opts.new_password] - New wallet password, if not blank.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        return this._request_rpc('change_wallet_password', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.generateFromKeys = function (opts) {
    /**
    * Restore wallet using mnemonic seed.
    * @function
    * @name RPCWallet#generateFromKeys
    * @param {Object} opts
    * @param {number} [opts.restore_height] - Start height for scanning the blockchain.
    * @param {string} opts.filename - Wallet filename.
    * @param {string} opts.address - Wallet address.
    * @param {string} [opts.spendkey] - Wallet spend key.
    * @param {string} opts.viewkey - Wallet view key.
    * @param {string} [opts.password] - Wallet password.
    * @param {boolean} [opts.autosave_current] - Save wallet.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  address: 'ar47HiRLKrEcQdgRhN2FTfEnJwkXoUWKH8WAwTucZ8RP9QxB2WMhh6Ffzhfh2panETahxdMX7cjhaiV6ShvG5gdY2iALecvcL',
    *  info: 'Wallet has been restored successfully.',
    *  seed: 'pulp peeled picked succeed wildly lymph edgy sushi limits hitched balding rising syndrome omission getting unafraid feline hornet darted mixture napkin remedy uptight wield unafraid',
    *  was_deprecated: false
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.filename === 'undefined') return reject(new Error('must specify filename'))
        if (typeof opts.address === 'undefined') return reject(new Error('must specify address'))
        if (typeof opts.viewkey === 'undefined') return reject(new Error('must specify viewkey'))
        return this._request_rpc('generate_from_keys', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.restoreDeterministicWallet = function (opts) {
    /**
    * Restore wallet using mnemonic seed.
    * @function
    * @name RPCWallet#restoreDeterministicWallet
    * @param {Object} opts
    * @param {number} [opts.restore_height] - Start height for scanning the blockchain.
    * @param {string} opts.filename - Wallet filename.
    * @param {string} opts.seed - Mnemonic seed.
    * @param {string} [opts.seed_offset] - Seed offset.
    * @param {string} [opts.password] - Wallet password.
    * @param {string} [opts.language] - Language for the wallet seed.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  address: 'ar47HiRLKrEcQdgRhN2FTfEnJwkXoUWKH8WAwTucZ8RP9QxB2WMhh6Ffzhfh2panETahxdMX7cjhaiV6ShvG5gdY2iALecvcL',
    *  info: 'Wallet has been restored successfully.',
    *  seed: 'pulp peeled picked succeed wildly lymph edgy sushi limits hitched balding rising syndrome omission getting unafraid feline hornet darted mixture napkin remedy uptight wield unafraid',
    *  was_deprecated: false
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.filename === 'undefined') return reject(new Error('must specify filename'))
        if (typeof opts.seed === 'undefined') return reject(new Error('must specify seed'))
        return this._request_rpc('restore_deterministic_wallet', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.isMultisig = function () {
    /**
    * Check if a wallet is a multisig one.
    * @function
    * @name RPCWallet#isMultisig
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  multisig: true,
    *  ready: true,
    *  threshold: 2,
    *  total: 2
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('is_multisig')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.prepareMultisig = function () {
    /**
    * Prepare a wallet for multisig by generating a multisig string to share with peers.
    * @function
    * @name RPCWallet#prepareMultisig
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  multisig_info: 'MultisigV1Wqtpx5Nt5A3aLE5TKVwnTX7jvyCz7ZoKAHWhzM2fB3jnHDN4TPAY9Gbd5nfErL1KVjXG6rUCfL9NDdnnpNvtS4GyGGT7UxpDCtFGEyHUfRkU4ce9xX8vtoLMKLN8U62rL8RxHzLzjExt8WR1ZTa8PqzbzJj2MxeKFxbtoB7iyu522u13'
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('prepare_multisig')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.makeMultisig = function (opts) {
    /**
    * Make a wallet multisig by importing peers multisig string.
    * @function
    * @name RPCWallet#makeMultisig
    * @param {Object} opts
    * @param {string[]} opts.multisig_info - List of multisig string from peers.
    * @param {number} opts.threshold - Amount of signatures needed to sign a transfer. Must be less or equal than the amount of signature in multisig_info.
    * @param {string} opts.password - Wallet password.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  address: 'as23DCaEx6j3ta9ZUrp1KYDeWehshV9uPNqw7EY8tsNW2XBdSc7g6UeWX7oPxam8m6SZpLFh9uZuT4btcg3vV6Xq1jBADk8Dj',
    *  multisig_info: ''
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.multisig_info === 'undefined') return reject(new Error('must specify multisig_info'))
        if (!(opts.multisig_info instanceof Array) || Object.prototype.toString.call(opts.multisig_info) !== '[object Array]') return reject(new Error('multisig_info should be an array of strings'))
        if (typeof opts.threshold === 'undefined') return reject(new Error('must specify threshold'))
        if (typeof opts.password === 'undefined') return reject(new Error('must specify password'))
        return this._request_rpc('make_multisig', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.exportMultisigInfo = function () {
    /**
    * Export multisig info for other participants.
    * @function
    * @name RPCWallet#exportMultisigInfo
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { info: '4172516d41206d756c7469736967206578706f72740130d905ab541a07f7b0ace79b045361535cd857210c96dd09c8fc1c5b0ef3735e60418f042f5e870b77e0143f7851983022138ba2b0951352850ab8165fd97a7314428ec0d5320cc02f139b5282f039eb677eaf8045d1e91d835e1240842deef73dd77d76dee2334d19dfa7b9bb7093345b013ce5a31bfc797f22435e1b71d90d06d2cece32f45bc67c5abc64e43de9e37555933f8e17044ead5a837fdd6be88cc89527194bb901c797c9911d0fd993f504d7d78718acb521d2911b39e1a3b00968f403c2c8240b' }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        return this._request_rpc('export_multisig_info')
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.importMultisigInfo = function (opts) {
    /**
    * Import multisig info from other participants.
    * @function
    * @name RPCWallet#importMultisigInfo
    * @param {Object} opts
    * @param {string[]} opts.info - List of multisig info in hex format from other participants.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { n_outputs: 1 }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.info === 'undefined') return reject(new Error('must specify info'))
        if (!(opts.info instanceof Array) || Object.prototype.toString.call(opts.info) !== '[object Array]') return reject(new Error('info should be an array of strings'))
        return this._request_rpc('import_multisig_info', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.finalizeMultisig = function (opts) {
    /**
    * Turn this wallet into a multisig wallet, extra step for N-1/N wallets.
    * @function
    * @name RPCWallet#finalizeMultisig
    * @param {Object} opts
    * @param {string[]} opts.multisig_info - List of multisig string from peers.
    * @param {string} opts.password - Wallet password.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * To be completed
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.multisig_info === 'undefined') return reject(new Error('must specify multisig_info'))
        if (!(opts.multisig_info instanceof Array) || Object.prototype.toString.call(opts.multisig_info) !== '[object Array]') return reject(new Error('multisig_info should be an array of strings'))
        if (typeof opts.password === 'undefined') return reject(new Error('must specify password'))
        return this._request_rpc('finalize_multisig', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.signMultisig = function (opts) {
    /**
    * Sign a transaction in multisig.
    * @function
    * @name RPCWallet#signMultisig
    * @param {Object} opts
    * @param {string} opts.tx_data_hex - Multisig transaction in hex format, as returned by transfer under multisig_txset.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { tx_data_hex: '4172516d ... ',
    *   tx_hash_list: [ 'bf54ffccfaf56f4d6af9ca103eb35fc4ede31325eaead960bef296f4c7ea0a07' ]
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.tx_data_hex === 'undefined') return reject(new Error('must specify tx_data_hex'))
        return this._request_rpc('sign_multisig', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.submitMultisig = function (opts) {
    /**
    * Submit a signed multisig transaction.
    * @function
    * @name RPCWallet#submitMultisig
    * @param {Object} opts
    * @param {string} opts.tx_data_hex - Multisig transaction in hex format, as returned by sign_multisig under tx_data_hex.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { tx_hash_list: [ '0d8a5f9028000667a393a66f13ae8b25589694186b872a7f38fec5ef60150e10' ] }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.tx_data_hex === 'undefined') return reject(new Error('must specify tx_data_hex'))
        return this._request_rpc('submit_multisig', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.validateAddress = function (opts) {
    /**
    * Parse an address to validate if it's a valid ArQmA address.
    * @function
    * @name RPCWallet#validateAddress
    * @param {Object} opts
    * @param {string} opts.address - Wallet address to check.
    * @param {boolean} [opts.any_net_type] - If true check on all nets (mainnet, testnet, stagenet), else check if same net as the conencted wallet. Default is false.
    * @param {boolean} [opts.allow_openalias] - If true resolve the Openalias to an address. Default is false.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    *  integrated: false,
    *  nettype: 'stagenet',
    *  openalias_address: '',
    *  subaddress: false,
    *  valid: true
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.address === 'undefined') return reject(new Error('must specify address'))
        return this._request_rpc('validate_address', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.setDaemon = function (opts) {
    /**
    * Set the daemon to connect with.
    * @function
    * @name RPCWallet#setDaemon
    * @param {Object} opts
    * @param {string} opts.address - Use daemon instance at <host>:<port>.
    * @param {boolean} [opts.trusted] - Enable commands which rely on a trusted daemon.
    * @param {string} [opts.ssl_support] - Enable SSL on daemon RPC connections: enabled, disabled, autodetect.
    * @param {string} [opts.ssl_private_key_path] - Path to a PEM format private key.
    * @param {string} [opts.ssl_certificate_path] - Path to a PEM format certificate.
    * @param {string} [opts.ssl_ca_file] - Path to file containing concatenated PEM format certificate(s) to replace system CA(s).
    * @param {string[]} [opts.ssl_allowed_fingerprints] - List of valid fingerprints of allowed RPC servers.
    * @param {boolean} [opts.ssl_allow_any_cert] - Allow any SSL certificate from the daemon.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {}
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.address === 'undefined') return reject(new Error('must specify address'))
        return this._request_rpc('set_daemon', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.setLogLevel = function (opts) {
    /**
    * Set the daemon log level. By default, log level is set to 0.
    * @function
    * @name RPCWallet#setLogLevel
    * @param {Object} opts
    * @param {number} opts.level - Wallet log level to set from 0 (less verbose) to 4 (most verbose).
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        opts = opts || {}
        if (typeof opts.level === 'undefined') return reject(new Error('must specify level'))
        return this._request_rpc('set_log_level', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.setLogCategories = function (opts) {
    /**
    * Set the daemon log categories. Categories are represented as a comma separated list of <Category>:<level> (similarly to syslog standard <Facility>:<Severity-level>).
    * @function
    * @name RPCWallet#setLogCategories
    * @param {Object} [opts]
    * @param {string} [opts.categories] - Daemon log categories to enable.
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * {
    * }
    */
    return new Promise((resolve, reject) => {
      return this.queue.add(() => {
        // opts = opts || {}
        return this._request_rpc('set_log_categories', opts)
          .then((res) => {
            return resolve(res)
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  RPCWallet.prototype.getVersion = function () {
    /**
    * Get RPC version Major & Minor integer-format, where Major is the first 16 bits and Minor the last 16 bits.
    * @function
    * @name RPCWallet#getVersion
    * @returns {Promise} Promise object.
    * @example <caption><b>Output</b></caption>
    * { release: false, version: 65548 }
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

  RPCWallet.prototype._request_rpc = function (method, parameters) {
    return new Promise((resolve, reject) => {
      this.options.path = '/json_rpc'
      if (typeof parameters === 'undefined') {
        return this._request(`{"jsonrpc":"2.0","id":"0","method":"${method}"}`).then((res) => {
          if (res.status === '200') {
            let json = JSON.parse(res.body)
            if (json.result) {
              return resolve(json.result)
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
        return this._request(`{"jsonrpc":"2.0","id":"0","method":"${method}","params":${JSON.stringify(parameters)}}`).then((res) => {
          if (res.status === '200') {
            let json = JSON.parse(res.body)
            if (json.result) {
              return resolve(json.result)
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

  return RPCWallet
})()

module.exports = RPCWallet
