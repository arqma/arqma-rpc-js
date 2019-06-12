'use strict'

const describe = require('mocha').describe
const it = require('mocha').it
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const RPCClient = require('../lib/rpcClient.js')

let config = require('./config.json')

describe('RPCClient', function () {
  describe('WITH authentification', function () {
    var rpcClient = new RPCClient({
      url: config.rpcWalletWithAuth,
      username: config.rpcWalletUsername,
      password: config.rpcWalletPassword
    })
    it('Connect socket', () => {
      return expect(rpcClient.socketConnect())
        .to.eventually.equal(true)
    })
    it('Request rpc', () => {
      return expect(rpcClient.requestLimited(config.rpcWalletData))
        .to.eventually.be.rejected
        .and.be.an.instanceOf(Error)
        .and.have.property('code', '404')
    })
    it('Second request rpc', () => {
      return expect(rpcClient.requestLimited(config.rpcWalletData))
        .to.eventually.be.rejected
        .and.be.an.instanceOf(Error)
        .and.have.property('code', '404')
    })
    it('End socket', () => {
      return expect(rpcClient.socketEnd())
        .to.eventually.equal(true)
    })
    it('Destroy socket', () => {
      return expect(rpcClient.socketDestroy())
        .to.eventually.equal(true)
    })
    it('Test the whole sequence', () => {
      return Promise.all([
        expect(rpcClient.socketConnect())
          .to.eventually.equal(true),
        expect(rpcClient.requestLimited(config.rpcWalletData))
          .to.eventually.be.rejected
          .and.be.an.instanceOf(Error)
          .and.have.property('code', '404'),
        expect(rpcClient.requestLimited(config.rpcWalletData))
          .to.eventually.be.rejected
          .and.be.an.instanceOf(Error)
          .and.have.property('code', '404'),
        expect(rpcClient.socketEnd())
          .to.eventually.equal(true),
        expect(rpcClient.socketDestroy())
          .to.eventually.equal(true)
      ])
    })
  })
  describe('Connect to server WITH authentification WITHOUT supplying one', function () {
    let rpcClient = new RPCClient({
      url: config.rpcWalletWithAuth
    })
    it('Connect socket', () => {
      return expect(rpcClient.socketConnect())
        .to.eventually.equal(true)
    })
    it('Request rpc', () => {
      return expect(rpcClient.requestLimited(config.rpcWalletData))
        .to.eventually.be.rejected
        .and.be.an.instanceOf(Error)
        .and.have.property('code', '401')
    })
    it('End socket', () => {
      return expect(rpcClient.socketEnd())
        .to.eventually.equal(true)
    })
    it('Destroy socket', () => {
      return expect(rpcClient.socketDestroy())
        .to.eventually.equal(true)
    })
  })
})
