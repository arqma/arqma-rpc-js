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

let txKey = ''
let txHash = ''
let getTxKey = ''
let inPool = ''

describe('RPCWallet wallet proof functions', function () {
  before(async function () {
    try {
      await rpcWallet.socketConnect()
      console.log('Restoring wallet B ...')
      await rpcWallet.restoreDeterministicWallet({ restore_height: 0, filename: 'tx_key', seed: config.stagenetSeedA })
      console.log('Refreshing wallet B ...')
      await rpcWallet.refresh()
      let trn = {
        destinations: [{ amount: 7700000, address: config.stagenetWalletAddressA }],
        priority: 2,
        mixin: 21,
        ring_size: 22,
        unlock_time: 0,
        payment_id: config.payment_id,
        get_tx_key: true
      }
      console.log('Doing transfer to get a tx_key ...')
      let res = await rpcWallet.transfer(trn)
      txKey = res.tx_key
      txHash = res.tx_hash
      console.log('Getting tx_key from txid ...')
      res = await rpcWallet.getTxKey({ txid: txHash })
      getTxKey = res.tx_key
      console.log('Checking tx_key ...')
      res = await rpcWallet.checkTxKey({ txid: txHash, tx_key: txKey, address: config.stagenetWalletAddressB })
      inPool = res.in_pool
      console.log('Storing wallet ...')
      await rpcWallet.store()
      console.log('Closing wallet ...')
      await rpcWallet.closeWallet()
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
  it('Check if tx_key matches', function () {
    expect(txKey).to.equal(getTxKey)
  })
  it('Check if tx_key was in pool', function () {
    expect(inPool).to.equal(true)
  })
  it('openWallet', () => {
    return expect(rpcWallet.openWallet({ filename: 'tx_key' }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('checkTxKey', () => {
    return expect(rpcWallet.getTxKey({ txid: txHash }))
      .to.eventually.have.property('tx_key', getTxKey)
  })
  it('rescanBlockchain', () => {
    return expect(rpcWallet.rescanBlockchain())
      .to.eventually.be.an('object').that.is.empty
  })
  it('checkTxKey should be rejected', () => {
    return expect(rpcWallet.getTxKey({ txid: txHash }))
      .to.eventually.be.rejected
  })
  it('rescanSpent', () => {
    return expect(rpcWallet.rescanSpent())
      .to.eventually.be.an('object').that.is.empty
  })
})
