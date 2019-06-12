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

let signature1 = ''
let signature2 = ''
let signature3 = ''

describe('RPCWallet wallet proof functions', function () {
  before(async function () {
    try {
      await rpcWallet.socketConnect()
      console.log('Restoring wallet B ...')
      await rpcWallet.restoreDeterministicWallet({ restore_height: 0, filename: 'proof', seed: config.stagenetSeedB })
      console.log('Refreshing wallet B ...')
      await rpcWallet.refresh()
      console.log('Getting tx proof ...')
      let res = await rpcWallet.getTxProof({ txid: config.txOutIdB, address: config.stagenetWalletAddressB, message: 'gold' })
      signature1 = res.signature
      console.log('Getting spend proof ...')
      res = await rpcWallet.getSpendProof({ txid: config.txOutIdB, message: 'gold' })
      signature2 = res.signature
      res = await rpcWallet.getReserveProof({ all: false, account_index: 0, amount: 6000000000, message: 'gold' })
      signature3 = res.signature
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
  it('checkTxProof', () => {
    return expect(rpcWallet.checkTxProof({ txid: config.txOutIdB, address: config.stagenetWalletAddressB, message: 'gold', signature: signature1 }))
      .to.eventually.have.property('good', true)
  })
  it('checkSpendProof', () => {
    return expect(rpcWallet.checkSpendProof({ txid: config.txOutIdB, message: 'gold', signature: signature2 }))
      .to.eventually.have.property('good', true)
  })
  it('checkSpendProof', () => {
    return expect(rpcWallet.checkReserveProof({ address: config.stagenetWalletAddressB, message: 'gold', signature: signature3 }))
      .to.eventually.have.property('good', true)
  })
})
