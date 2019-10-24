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

describe('RPCWallet wallet proof functions', function () {
  const walletClient = rpcWallet.createWalletClient({
    url: config.walletAddress,
    username: config.walletUsername,
    password: config.walletPassword
  })
  walletClient.sslRejectUnauthorized(false)

  let signature1 = ''
  let signature2 = ''
  let signature3 = ''

  before(async function () {
    try {
      console.log('Restoring wallet B ...')
      await walletClient.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'proof', seed: config.stagenetSeedB })
      console.log('Refreshing wallet B ...')
      await walletClient.refresh()
      console.log('Getting tx proof ...')
      let res = await walletClient.getTxProof({ txid: config.txOutIdB, address: config.stagenetWalletAddressB, message: 'gold' })
      signature1 = res.signature
      console.log('Getting spend proof ...')
      res = await walletClient.getSpendProof({ txid: config.txOutIdB, message: 'gold' })
      signature2 = res.signature
      res = await walletClient.getReserveProof({ all: false, account_index: 0, amount: 600000000, message: 'gold' })
      signature3 = res.signature
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
  it('checkTxProof', () => {
    return expect(walletClient.checkTxProof({ txid: config.txOutIdB, address: config.stagenetWalletAddressB, message: 'gold', signature: signature1 }))
      .to.eventually.have.property('good', true)
  })
  it('checkSpendProof', () => {
    return expect(walletClient.checkSpendProof({ txid: config.txOutIdB, message: 'gold', signature: signature2 }))
      .to.eventually.have.property('good', true)
  })
  it('checkSpendProof', () => {
    return expect(walletClient.checkReserveProof({ address: config.stagenetWalletAddressB, message: 'gold', signature: signature3 }))
      .to.eventually.have.property('good', true)
  })
})
