'use strict'

const describe = require('mocha').describe
const it = require('mocha').it
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const RPCDaemon = require('../lib/rpcDaemon.js')

let config = require('./config.json')

describe('RPCDaemon checks inputs of functions', function () {
  let rpcDaemon = new RPCDaemon({
    url: config.daemonWithoutAuth
  })
  it('getBlockHash without parameters should be rejected', () => {
    return expect(rpcDaemon.getBlockHash())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify height')
  })
  it('getBlockTemplate without parameters should be rejected', () => {
    return expect(rpcDaemon.getBlockTemplate())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify wallet_address')
  })
  it('getBlockTemplate without reserve_size should be rejected', () => {
    let opts = {
      wallet_address: config.stagenetWalletAddressA
    }
    return expect(rpcDaemon.getBlockTemplate(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify reserve_size')
  })
  it('submitBlock without blob should be rejected', () => {
    return expect(rpcDaemon.submitBlock())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify blob')
  })
  it('submitBlock with blob parameter as a string should be rejected', () => {
    let opts = { blob: 'thisisablock...' }
    return expect(rpcDaemon.submitBlock(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'blob should be an array of strings')
  })
  it('getBlockHeaderByHash without hash should be rejected', () => {
    return expect(rpcDaemon.getBlockHeaderByHash())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify hash')
  })
  it('getBlockHeaderByHeight without height should be rejected', () => {
    return expect(rpcDaemon.getBlockHeaderByHeight())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify height')
  })
  it('getBlockHeadersRange without start_height should be rejected', () => {
    let opts = {
      end_height: 114196
    }
    return expect(rpcDaemon.getBlockHeadersRange(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify start_height')
  })
  it('getBlockHeadersRange without end_height should be rejected', () => {
    let opts = {
      start_height: 114196
    }
    return expect(rpcDaemon.getBlockHeadersRange(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify end_height')
  })
  it('getBlock without parameter should be rejected', () => {
    return expect(rpcDaemon.getBlock())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify height or hash')
  })
  // need to check for subparameters
  it('setBans without parameter should be rejected', () => {
    return expect(rpcDaemon.setBans())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify bans')
  })
  it('getCoinbaseTxSum without parameters should be rejected', () => {
    return expect(rpcDaemon.getCoinbaseTxSum())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify height')
  })
  it('getCoinbaseTxSum without count parameter should be rejected', () => {
    let opts = {
      height: 1
    }
    return expect(rpcDaemon.getCoinbaseTxSum(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify count')
  })
  it('relayTx without parameters should be rejected', () => {
    return expect(rpcDaemon.relayTx())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify txids')
  })
  it('relayTx with txids parameter as a string should be rejected', () => {
    let opts = {
      txids: 'thisisatxids...'
    }
    return expect(rpcDaemon.relayTx(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'txids should be an array of strings')
  })
  it('getOutputDistribution without parameters should be rejected', () => {
    return expect(rpcDaemon.getOutputDistribution())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify amounts')
  })
  it('getOutputDistribution with amounts parameter as a number should be rejected', () => {
    let opts = {
      amounts: 100
    }
    return expect(rpcDaemon.getOutputDistribution(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'amounts should be an array of numbers')
  })
  it('otherGetTransactions without parameters should be rejected', () => {
    return expect(rpcDaemon.otherGetTransactions())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify txs_hashes')
  })
  it('otherGetTransactions with txs_hashes parameter as a string should be rejected', () => {
    let opts = {
      txs_hashes: 'these are some txs_hashes ...'
    }
    return expect(rpcDaemon.otherGetTransactions(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'txs_hashes should be an array of strings')
  })
  it('otherIsKeyImageSpent without parameters should be rejected', () => {
    return expect(rpcDaemon.otherIsKeyImageSpent())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify key_images')
  })
  it('otherIsKeyImageSpent with key_images parameter as a string should be rejected', () => {
    let opts = {
      key_images: 'these are some key_images ...'
    }
    return expect(rpcDaemon.otherIsKeyImageSpent(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'key_images should be an array of strings')
  })
  it('otherSendRawTransaction without parameters should be rejected', () => {
    return expect(rpcDaemon.otherSendRawTransaction())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify tx_as_hex')
  })
  it('otherSetLogHashrate without parameter should be rejected', () => {
    return expect(rpcDaemon.otherSetLogHashrate())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify visible')
  })
  it('otherSetLogLevel without parameter should be rejected', () => {
    return expect(rpcDaemon.otherSetLogLevel())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify level')
  })
  it('otherOutPeers without parameter should be rejected', () => {
    return expect(rpcDaemon.otherOutPeers())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify out_peers')
  })
  it('otherInPeers without parameter should be rejected', () => {
    return expect(rpcDaemon.otherInPeers())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify in_peers')
  })
})
