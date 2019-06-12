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

describe('RPCWallet wallet transfer split', function () {
  before(async function () {
    try {
      await rpcWallet.socketConnect()
      await rpcWallet.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'payment_split', seed: config.stagenetSeedB })
      await rpcWallet.refresh()
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
  it('transferSplit', () => {
    let trn = {
      destinations: [{ amount: 100000000, address: config.stagenetWalletAddressA }],
      priority: 2,
      mixin: 20,
      ring_size: 21,
      unlock_time: 0,
      payment_id: config.payment_id
    }
    return expect(rpcWallet.transferSplit(trn))
      .to.eventually.have.nested.property('amount_list[0]', 100000000)
  })
})
