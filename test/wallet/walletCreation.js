'use strict'

const describe = require('mocha').describe
const it = require('mocha').it
const after = require('mocha').after
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const rpcWallet = require('../../lib/rpcWallet.js')

const config = require('./config')

describe('RPCWallet wallet creation functions', function () {
  const walletClient = rpcWallet.createWalletClient({
    url: config.walletAddress,
    username: config.walletUsername,
    password: config.walletPassword
  })
  walletClient.sslRejectUnauthorized(false)

  after(async function () {
    try {
      await walletClient.closeWallet()
    } catch (e) {
      console.log('Error in after', e)
    }
  })
  it('createWallet', () => {
    return expect(walletClient.createWallet({ filename: 'testWallet', password: 'testWallet', language: 'English' }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('autoRefresh', () => {
    return expect(walletClient.autoRefresh({ enable: true, period: 30 }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('changeWalletPassword', () => {
    return expect(walletClient.changeWalletPassword({ old_password: 'testWallet', new_password: 'newPassword' }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('getHeight', () => {
    return expect(walletClient.getHeight())
      .to.eventually.have.property('height')
  })
  it('getLanguages', () => {
    return expect(walletClient.getLanguages())
      .to.eventually.have.nested.property('languages[0]', 'Deutsch')
  })
  it('setLogCategories without parameter status should return OK', () => {
    return expect(walletClient.setLogCategories())
      .to.eventually.have.property('categories', '')
  })
  it('setLogCategories with parameter should return parameter value', () => {
    const opts = {
      categories: '*:INFO'
    }
    return expect(walletClient.setLogCategories(opts))
      .to.eventually.have.property('categories', '*:INFO')
  })
  it('setLogLevel to level 4', () => {
    return expect(walletClient.setLogLevel({ level: 4 }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('setLogLevel out of bounds', () => {
    return expect(walletClient.setLogLevel({ level: 5 }))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .and.have.property('code', -44)
  })
})
