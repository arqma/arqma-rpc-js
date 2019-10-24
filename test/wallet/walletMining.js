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

describe('RPCWallet wallet mining', function () {
  const walletClient = rpcWallet.createWalletClient({
    url: config.walletAddress,
    username: config.walletUsername,
    password: config.walletPassword
  })
  walletClient.sslRejectUnauthorized(false)

  before(async function () {
    try {
      console.log('Restoring view wallet from keys ...')
      await walletClient.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'mining', seed: config.stagenetSeedA })
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
  it('Start mining', () => {
    const opts = {
      do_background_mining: true,
      ignore_battery: true,
      threads_count: 1
    }
    return expect(walletClient.startMining(opts))
      .to.eventually.be.an('object').that.is.empty
  })
  it('Stop mining', () => {
    return expect(walletClient.stopMining())
      .to.eventually.be.an('object').that.is.empty
  })
})
