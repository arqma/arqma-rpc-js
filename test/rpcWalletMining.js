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

describe('RPCWallet wallet mining', function () {
  before(async function () {
    try {
      await rpcWallet.socketConnect()
      await rpcWallet.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'mining', seed: config.stagenetSeedA })
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
  it('Start mining', () => {
    let opts = {
      do_background_mining: true,
      ignore_battery: true,
      threads_count: 1
    }
    return expect(rpcWallet.startMining(opts))
      .to.eventually.be.an('object').that.is.empty
  })
  it('Stop mining', () => {
    return expect(rpcWallet.stopMining())
      .to.eventually.be.an('object').that.is.empty
  })
})
