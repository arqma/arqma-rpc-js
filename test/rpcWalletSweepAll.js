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
let resB = ''

let trn = {
  address: config.stagenetWalletAddressA,
  account_index: 0,
  mixin: 31,
  ring_size: 32,
  unlock_time: 0
}

describe('RPCWallet wallet sweep all', function () {
  before(async function () {
    try {
      await rpcWallet.socketConnect()
      console.log('Restoring wallet A ...')
      await rpcWallet.restoreDeterministicWallet({ restore_height: 0, filename: 'sweep_all_A', seed: config.stagenetSeedA })
      console.log('Refreshing wallet A ...')
      await rpcWallet.refresh()
      console.log('Sweeping All in wallet A ...')
      resA = await rpcWallet.sweepAll(trn)
      console.log('Closing wallet A')
      await rpcWallet.closeWallet()
      console.log('Restoring wallet B ...')
      await rpcWallet.restoreDeterministicWallet({ restore_height: 0, filename: 'sweep_all_B', seed: config.stagenetSeedB })
      console.log('Refreshing wallet B ...')
      await rpcWallet.refresh()
      console.log('Sweeping All in wallet B ...')
      trn.address = config.stagenetWalletAddressB
      resA = await rpcWallet.sweepAll(trn)
      console.log('Closing wallet B')
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
  it('sweepAll wallet A', () => {
    return expect(resA)
      .to.have.property('amount_list')
  })
  it('sweepAll wallet B', () => {
    return expect(resB)
      .to.have.property('amount_list')
  })
})
