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

let resA = ''

let trn = {
  address: config.stagenetWalletAddressA,
  account_index: 0,
  mixin: 31,
  ring_size: 32,
  unlock_time: 0,
  key_image: config.keyImageToSweep
}

describe('RPCWallet wallet sweep single', function () {
  before(async function () {
    try {
      await rpcWallet.socketConnect()
      console.log('Restoring wallet A ...')
      await rpcWallet.restoreDeterministicWallet({ restore_height: 0, filename: 'sweep_single', seed: config.stagenetSeedA })
      console.log('Refreshing wallet A ...')
      await rpcWallet.refresh()
      console.log('Sweeping transaction from wallet A ...')
      resA = await rpcWallet.sweepSingle(trn)
      console.log('Closing wallet A')
      await rpcWallet.closeWallet()
    } catch (e) {
      console.log('Error in before', e)
    }
  })
  after(async function () {
    try {
      await rpcWallet.socketEnd()
      await rpcWallet.socketDestroy()
    } catch (e) {
      console.log('Error in after', e)
      await rpcWallet.socketEnd()
      await rpcWallet.socketDestroy()
    }
  })
  it('sweepSingle', () => {
    return expect(resA).to.have.property('amount')
  })
})
