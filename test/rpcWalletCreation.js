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
  it('createWallet', () => {
    return expect(rpcWallet.createWallet({ filename: 'testWallet', password: 'testWallet', language: 'English' }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('changeWalletPassword', () => {
    return expect(rpcWallet.changeWalletPassword({ old_password: 'testWallet', new_password: 'newPassword' }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('getLanguages', () => {
    return expect(rpcWallet.getLanguages())
      .to.eventually.have.nested.property('languages[0]', 'Deutsch')
  })
  it('getHeight', () => {
    return expect(rpcWallet.getHeight())
      .to.eventually.have.property('height')
  })
  it('setLogLevel to level 4', () => {
    return expect(rpcWallet.setLogLevel({ level: 4 }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('setLogLevel out of bounds', () => {
    return expect(rpcWallet.setLogLevel({ level: 5 }))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .and.have.property('code', -44)
  })
  it('otherSetLogCategories without parameter status should return OK', () => {
    return expect(rpcWallet.setLogCategories())
      .to.eventually.have.property('categories', '')
  })
  it('otherSetLogCategories with parameter should return parameter value', () => {
    let opts = {
      categories: '*:INFO'
    }
    return expect(rpcWallet.setLogCategories(opts))
      .to.eventually.have.property('categories', '*:INFO')
  })
  it('autoRefresh', () => {
    return expect(rpcWallet.autoRefresh({ enable: true, period: 30 }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('closeWallet', () => {
    return expect(rpcWallet.closeWallet())
      .to.eventually.be.an('object').that.is.empty
  })
})
