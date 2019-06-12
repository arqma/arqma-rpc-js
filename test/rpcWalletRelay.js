'use strict'

const describe = require('mocha').describe
const it = require('mocha').it
const before = require('mocha').before
const after = require('mocha').after
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const RPCWallet = require('../lib/rpcWallet.js')

let config = require('./config.json')

let rpcWallet = new RPCWallet({
  url: config.rpcWalletWithAuth,
  username: config.rpcWalletUsername,
  password: config.rpcWalletPassword
})

let txMetadata = ''
let txHash = ''

describe('RPCWallet wallet relay transaction', function () {
  before(async function () {
    try {
      await rpcWallet.socketConnect()
      console.log('Restoring wallet ...')
      await rpcWallet.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'relay', seed: config.stagenetSeedA })
      console.log('Refreshing wallet ...')
      await rpcWallet.refresh()
      let trn = {
        destinations: [{ amount: 2000000000, address: config.stagenetWalletAddressB }],
        priority: 2,
        mixin: 21,
        ring_size: 22,
        unlock_time: 0,
        payment_id: config.payment_id,
        do_not_relay: true,
        get_tx_metadata: true
      }
      console.log('Preparing transfer ...')
      let res = await rpcWallet.transfer(trn)
      txMetadata = res.tx_metadata
      txHash = res.tx_hash
    } catch (e) {
      console.log('Error in before', e)
    }
  })
  after(async function () {
    try {
      await rpcWallet.closeWallet()
      await rpcWallet.socketEnd()
      await rpcWallet.socketDestroy()
    } catch (e) {
      console.log('Error in after', e)
      await rpcWallet.socketEnd()
      await rpcWallet.socketDestroy()
    }
  })
  it('relayTx', () => {
    return expect(rpcWallet.relayTx({ hex: txMetadata }))
      .to.eventually.have.property('tx_hash', txHash)
  })
})
