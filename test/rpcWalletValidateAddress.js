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

describe('RPCWallet wallet file creation', function () {
  before(async function () {
    try {
      await rpcWallet.socketConnect()
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
  it('validateAddress without an opened wallet and parameter any_net_type set to false', () => {
    return expect(rpcWallet.validateAddress({ address: config.stagenetWalletAddressA, any_net_type: false }))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'No wallet file')
  })
  it('restoreDeterministicWallet with seed', () => {
    return expect(rpcWallet.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'valdiation', seed: config.stagenetSeedA }))
      .to.eventually.have.property('address', config.stagenetWalletAddressA)
  })
  it('validateAddress with an opened wallet and parameter any_net_type set to false', () => {
    return expect(rpcWallet.validateAddress({ address: config.mainnetWalletAddressA, any_net_type: false }))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'Invalid address')
  })
  it('validateAddress with an opened wallet and parameter any_net_type set to false', () => {
    return expect(rpcWallet.validateAddress({ address: config.stagenetWalletAddressA, any_net_type: false }))
      .to.eventually.have.property('nettype', 'stagenet')
  })
  it('validateAddress with an opened wallet and parameter any_net_type set to true', () => {
    return expect(rpcWallet.validateAddress({ address: config.mainnetWalletAddressA, any_net_type: true }))
      .to.eventually.have.property('nettype', 'mainnet')
  })
  it('stopWallet', () => {
    return expect(rpcWallet.stopWallet())
      .to.eventually.be.an('object').that.is.empty
  })
})
