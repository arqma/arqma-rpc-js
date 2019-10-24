'use strict'

const describe = require('mocha').describe
const it = require('mocha').it
const before = require('mocha').before
const after = require('mocha').after
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const rpcWallet = require('../../lib/rpcWallet.js')

const config = require('./config')

describe('RPCWallet wallet transfer split', function () {
  const walletClient = rpcWallet.createWalletClient({
    url: config.walletAddress,
    username: config.walletUsername,
    password: config.walletPassword
  })
  walletClient.sslRejectUnauthorized(false)

  const trn = {
    destinations: [{ amount: 100000000, address: config.stagenetWalletAddressA }, { amount: 50000000, address: config.stagenetWalletAddressB }],
    account_index: 0,
    subaddr_indices: [0],
    priority: 2,
    mixin: 11,
    ring_size: 12,
    unlock_time: 0,
    payment_id: config.payment_id,
    get_tx_keys: true,
    do_not_relay: false,
    get_tx_hex: false,
    new_algorithm: true,
    get_tx_metadata: false
  }

  before(async function () {
    try {
      await walletClient.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'transfer_split', seed: config.stagenetSeedB })
      await walletClient.refresh()
    } catch (e) {
      console.log('Error in before', e)
    }
  })
  after(async function () {
    try {
      console.log('Closing wallet ...')
      await walletClient.closeWallet()
    } catch (e) {
      console.log('Error in after', e)
    }
  })
  it('transfer', () => {
    return expect(walletClient.transfer(trn))
      .to.eventually.have.property('amount', 150000000)
  })
})
