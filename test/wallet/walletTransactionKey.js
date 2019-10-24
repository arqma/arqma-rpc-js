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

  let txKey = ''
  let txHash = ''
  let getTxKey = ''
  let inPool = ''

  before(async function () {
    try {
      console.log('Restoring wallet B ...')
      await walletClient.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'tx_key', seed: config.stagenetSeedA })
      console.log('Refreshing wallet B ...')
      await walletClient.refresh()
      const trn = {
        destinations: [{ amount: 7700000, address: config.stagenetWalletAddressA }],
        priority: 2,
        mixin: 21,
        ring_size: 22,
        unlock_time: 0,
        payment_id: config.payment_id,
        get_tx_key: true
      }
      console.log('Doing transfer to get a tx_key ...')
      let res = await walletClient.transfer(trn)
      txKey = res.tx_key
      txHash = res.tx_hash
      console.log('Getting tx_key from txid ...')
      res = await walletClient.getTxKey({ txid: txHash })
      getTxKey = res.tx_key
      console.log('Checking tx_key ...')
      res = await walletClient.checkTxKey({ txid: txHash, tx_key: txKey, address: config.stagenetWalletAddressB })
      inPool = res.in_pool
      console.log('Storing wallet ...')
      await walletClient.store()
      console.log('Closing wallet ...')
      await walletClient.closeWallet()
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
  it('Check if tx_key matches', function () {
    expect(txKey).to.equal(getTxKey)
  })
  it('Check if tx_key was in pool', function () {
    expect(inPool).to.equal(true)
  })
  it('openWallet', () => {
    return expect(walletClient.openWallet({ filename: 'tx_key' }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('getTxKey', () => {
    return expect(walletClient.getTxKey({ txid: txHash }))
      .to.eventually.have.property('tx_key', getTxKey)
  })
  it('rescanBlockchain', () => {
    return expect(walletClient.rescanBlockchain({ hard: true }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('getTxKey should be rejected', () => {
    return expect(walletClient.getTxKey({ txid: txHash }))
      .to.eventually.be.rejected
  })
  it('rescanSpent', () => {
    return expect(walletClient.rescanSpent())
      .to.eventually.be.an('object').that.is.empty
  })
})
