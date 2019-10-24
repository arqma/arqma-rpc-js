'use strict'

const describe = require('mocha').describe
const it = require('mocha').it
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

  it('validateAddress without an opened wallet and parameter any_net_type set to false', () => {
    return expect(walletClient.validateAddress({ address: config.stagenetWalletAddressA, any_net_type: false }))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'No wallet file')
  })
  it('restoreDeterministicWallet with seed', () => {
    return expect(walletClient.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'valdiation', seed: config.stagenetSeedA }))
      .to.eventually.have.property('address', config.stagenetWalletAddressA)
  })
  it('validateAddress with an opened wallet and parameter any_net_type set to false', () => {
    return expect(walletClient.validateAddress({ address: config.mainnetWalletAddressA, any_net_type: false }))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'Invalid address')
  })
  it('validateAddress with an opened wallet and parameter any_net_type set to false', () => {
    return expect(walletClient.validateAddress({ address: config.stagenetWalletAddressA, any_net_type: false }))
      .to.eventually.have.property('nettype', 'stagenet')
  })
  it('validateAddress with an opened wallet and parameter any_net_type set to true', () => {
    return expect(walletClient.validateAddress({ address: config.mainnetWalletAddressA, any_net_type: true }))
      .to.eventually.have.property('nettype', 'mainnet')
  })
  it('stopWallet', () => {
    return expect(walletClient.stopWallet())
      .to.eventually.be.an('object').that.is.empty
  })
})
