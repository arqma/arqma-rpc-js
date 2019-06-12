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
  describe('Test promised socket PRIVATE functions', function () {
    let rpcClient = new RPCClient({
      url: config.daemonWithoutAuth
    })
    it('Connect socket', () => {
      return expect(rpcClient._socket_connect())
        .to.eventually.equal(true)
    })
    it('Request rpc', () => {
      return expect(rpcClient._request(config.daemonData))
        .to.eventually.have.property('status', '404')
    })
    it('Reject socket when socket already connected', () => {
      return expect(rpcClient._socket_connect())
        .to.eventually.be.rejected
        .and.be.an.instanceOf(Error)
        .and.have.property('code', 'EISCONN')
    })
    it('End socket', () => {
      return expect(rpcClient._socket_end())
        .to.eventually.equal(true)
    })
    it('Destroy socket', () => {
      return expect(rpcClient._socket_destroy())
        .to.eventually.equal(true)
    })
  })
  describe('Test promised socket PUBLIC functions', function () {
    describe('WITHOUT authentification', function () {
      let rpcClient = new RPCClient({
        url: config.daemonWithoutAuth
      })
      it('Connect socket', () => {
        return expect(rpcClient.socketConnect())
          .to.eventually.equal(true)
      })
      it('changeURL', () => {
        return expect(rpcClient.changeURL(config.daemonWithoutAuth + '/json_rpc'))
          .to.eventually.equal(true)
      })
      it('Request rpc', () => {
        return expect(rpcClient.requestLimited(config.daemonData))
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
          expect(rpcClient.requestLimited(config.daemonData))
            .to.eventually.be.rejected
            .and.be.an.instanceOf(Error)
            .and.have.property('code', '404'),
          expect(rpcClient.requestLimited(config.daemonData))
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
  })
})
