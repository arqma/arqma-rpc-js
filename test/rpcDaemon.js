'use strict'

const describe = require('mocha').describe
const it = require('mocha').it
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const RPCDaemon = require('../lib/rpcDaemon.js')

let config = require('./config.json')

describe('RPCDaemon tests functions', function () {
  let rpcDaemon = new RPCDaemon({
    url: config.daemonWithoutAuth
  })
  it('Connect socket', () => {
    return expect(rpcDaemon.socketConnect())
      .to.eventually.equal(true)
  })
  it('getBlockCount should return a block height', () => {
    return expect(rpcDaemon.getBlockCount())
      .to.eventually.have.property('count')
      .to.eventually.be.gt(0)
  })
  it('getBlockHash with height should return a hash', () => {
    let opts = {
      height: [1]
    }
    return expect(rpcDaemon.getBlockHash(opts))
      .to.eventually.equal(config.blockHash)
  })
  it('getBlockTemplate should return status OK', () => {
    let opts = {
      wallet_address: config.stagenetWalletAddressA,
      reserve_size: 0
    }
    return expect(rpcDaemon.getBlockTemplate(opts))
      .to.eventually.have.property('status', 'OK')
  })
  it('submitBlock with a blob should be rejected', () => {
    let opts = {
      blob: ['0707e6bdfedc053771512f1bc27c62731ae9e8f2443db64ce742f4e57f5cf8d393de28551e441a0000000002fb830a01ffbf830a018cfe88bee283060274c0aae2ef5730e680308d9c00b6da59187ad0352efe3c71d36eeeb28782f29f2501bd56b952c3ddc3e350c2631d3a5086cac172c56893831228b17de296ff4669de020200000000']
    }
    return expect(rpcDaemon.submitBlock(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .and.have.property('code', -7)
  })
  it('getLastBlockHeader should return a block header', () => {
    return expect(rpcDaemon.getLastBlockHeader())
      .to.eventually.have.property('block_header')
  })
  it('getBlockHeaderByHash with hash should return a block header', () => {
    let opts = {
      hash: config.blockHash
    }
    return expect(rpcDaemon.getBlockHeaderByHash(opts))
      .to.eventually.have.property('block_header')
      .to.eventually.have.property('height', 1)
  })
  it('getBlockHeaderByHeight with height should return a block header', () => {
    let opts = {
      height: 1
    }
    return expect(rpcDaemon.getBlockHeaderByHeight(opts))
      .to.eventually.have.property('block_header')
      .to.eventually.have.property('hash', config.blockHash)
  })
  it('getBlockHeadersRange with heights should return a block header', () => {
    let opts = {
      start_height: 1,
      end_height: 1
    }
    return expect(rpcDaemon.getBlockHeadersRange(opts))
      .to.eventually.have.property('headers')
  })
  it('getBlock with hash should return a block header', () => {
    let opts = {
      hash: config.blockHash
    }
    return expect(rpcDaemon.getBlock(opts))
      .to.eventually.have.property('block_header')
      .to.eventually.have.property('height', 1)
  })
  it('getConnections should retrieve information about connections', () => {
    return expect(rpcDaemon.getConnections())
      .to.eventually.have.property('status', 'OK')
  })
  it('getInfo should retrieve general informations', () => {
    return expect(rpcDaemon.getInfo())
      .to.eventually.have.property('block_size_limit')
  })
  it('getHardForkInfo should retrieve general informations', () => {
    return expect(rpcDaemon.getHardForkInfo())
      .to.eventually.have.property('status', 'OK')
  })
  it('setBans with parameter should return OK', () => {
    let opts = {
      bans: [{ host: '192.168.1.51', ban: true, seconds: 30 }, { ip: 838969536, 'ban': true, 'seconds': 30 }]
    }
    return expect(rpcDaemon.setBans(opts))
      .to.eventually.have.property('status', 'OK')
  })
  it('getBans with parameter should return banned hosts and ips', () => {
    return expect(rpcDaemon.getBans())
      .to.eventually.have.property('bans')
      .to.have.deep.members([ { host: '192.168.1.50', ip: 838969536, seconds: 30 },
        { host: '192.168.1.51', ip: 855746752, seconds: 30 } ])
  })
  it('flushTxPool should return OK', () => {
    return expect(rpcDaemon.flushTxPool())
      .to.eventually.have.property('status', 'OK')
  })
  it('getOutputHistogram should return status OK', () => {
    return expect(rpcDaemon.getOutputHistogram())
      .to.eventually.have.property('status', 'OK')
  })
  it('getCoinbaseTxSum should return status OK', () => {
    return expect(rpcDaemon.getCoinbaseTxSum({ height: 1, count: 100 }))
      .to.eventually.have.property('status', 'OK')
  })
  it('getVersion should return OK', () => {
    return expect(rpcDaemon.getVersion())
      .to.eventually.have.property('status', 'OK')
  })
  it('getFeeEstimate should return OK', () => {
    return expect(rpcDaemon.getFeeEstimate())
      .to.eventually.have.property('status', 'OK')
  })
  it('getAlternateChains should return OK', () => {
    return expect(rpcDaemon.getAlternateChains())
      .to.eventually.have.property('status', 'OK')
  })
  it('relayTx should be rejected', () => {
    let opts = {
      txids: config.txids
    }
    return expect(rpcDaemon.relayTx(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .and.have.property('code', 0)
  })
  it('syncInfo should return OK', () => {
    return expect(rpcDaemon.syncInfo())
      .to.eventually.have.property('status', 'OK')
  })
  it('getTxPoolBacklog should return OK', () => {
    return expect(rpcDaemon.getTxPoolBacklog())
      .to.eventually.have.property('status', 'OK')
  })
  it('getOutputDistribution should return OK', () => {
    let opts = {
      amounts: [100000],
      cumulative: true,
      from_height: 1,
      to_height: 100
    }
    return expect(rpcDaemon.getOutputDistribution(opts))
      .to.eventually.have.property('status', 'OK')
  })
  it('otherGetHeight should return OK', () => {
    return expect(rpcDaemon.otherGetHeight())
      .to.eventually.have.property('status', 'OK')
  })
  it('otherGetTransactions should return whole transaction', () => {
    let opts = {
      txs_hashes: [config.txids[0]]
    }
    return expect(rpcDaemon.otherGetTransactions(opts))
      .to.eventually.have.nested.property('txs[0].block_height', 7924)
  })
  it('otherGetAltBlocksHashes should return OK', () => {
    return expect(rpcDaemon.otherGetAltBlocksHashes())
      .to.eventually.have.property('status', 'OK')
  })
  it('otherIsKeyImageSpent should return 1', () => {
    let opts = {
      key_images: [config.spent_key]
    }
    return expect(rpcDaemon.otherIsKeyImageSpent(opts))
      .to.eventually.have.nested.property('spent_status[0]', 1)
  })
  it('otherSendRawTransaction with tx_as_hex should return OK', () => {
    let opts = {
      txs_hashes: [config.txids[0]]
    }
    return rpcDaemon.otherGetTransactions(opts).then((result) => {
      let txHex = result.txs_as_hex['0']
      opts = {
        tx_as_hex: txHex,
        do_not_relay: false
      }
      return expect(rpcDaemon.otherSendRawTransaction(opts))
        .to.eventually.have.property('status', 'OK')
    })
  })
  it('Save blockchain status should return OK', () => {
    return expect(rpcDaemon.otherSaveBc())
      .to.eventually.have.property('status', 'OK')
  })
  it('Get peer list status should return OK', () => {
    return expect(rpcDaemon.otherGetPeerList())
      .to.eventually.have.property('status', 'OK')
  })
  it('otherSetLogHashrate when not mining should be rejected', () => {
    let opts = {
      visible: true
    }
    return expect(rpcDaemon.otherSetLogHashrate(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error, 'NOT MINING')
  })
  it('otherSetLogLevel status should return OK', () => {
    let opts = {
      level: 1
    }
    return expect(rpcDaemon.otherSetLogLevel(opts))
      .to.eventually.have.property('status', 'OK')
  })
  it('otherSetLogCategories without parameter status should return OK', () => {
    return expect(rpcDaemon.otherSetLogCategories())
      .to.eventually.have.property('status', 'OK')
  })
  it('otherSetLogCategories with parameter should return parameter value', () => {
    let opts = {
      categories: '*:INFO'
    }
    return expect(rpcDaemon.otherSetLogCategories(opts))
      .to.eventually.have.property('categories', '*:INFO')
  })
  it('otherGetTransactionPool should return OK', () => {
    return expect(rpcDaemon.otherGetTransactionPool())
      .to.eventually.have.property('status', 'OK')
  })
  it('otherGetTransactionPoolStats should return OK', () => {
    return expect(rpcDaemon.otherGetTransactionPoolStats())
      .to.eventually.have.property('status', 'OK')
  })
  it('otherSetLimit should return OK', () => {
    let opts = {
      limit_up: 4096,
      limit_down: 8192
    }
    return expect(rpcDaemon.otherSetLimit(opts))
      .to.eventually.have.property('status', 'OK')
  })
  it('otherGetLimit should return correct limit_down', () => {
    return expect(rpcDaemon.otherGetLimit())
      .to.eventually.have.property('limit_down', 8192)
  })
  it('otherSetLimit should return OK', () => {
    let opts = {
      limit_down: -1,
      limit_up: -1
    }
    return expect(rpcDaemon.otherSetLimit(opts))
      .to.eventually.have.property('status', 'OK')
  })
  it('otherOutPeers should return OK', () => {
    let opts = {
      out_peers: 3232235535
    }
    return expect(rpcDaemon.otherOutPeers(opts))
      .to.eventually.have.property('status', 'OK')
  })
  it('otherInPeers should return OK', () => {
    let opts = {
      in_peers: 3232235535
    }
    return expect(rpcDaemon.otherInPeers(opts))
      .to.eventually.have.property('status', 'OK')
  })
  it('Start mining should return OK', () => {
    let opts = {
      do_background_mining: true,
      ignore_battery: true,
      miner_address: config.stagenetWalletAddressA,
      threads_count: 1
    }
    return expect(rpcDaemon.otherStartMining(opts))
      .to.eventually.have.property('status', 'OK')
  })
  it('Get mining status should return OK', () => {
    return expect(rpcDaemon.otherMiningStatus())
      .to.eventually.have.property('status', 'OK')
  })
  it('Stop mining status should return OK', () => {
    return expect(rpcDaemon.otherStopMining())
      .to.eventually.have.property('status', 'OK')
  })
  it('otherStopDaemon should return OK', () => {
    return expect(rpcDaemon.otherStopDaemon())
      .to.eventually.have.property('status', 'OK')
  })
  it('End socket', () => {
    return expect(rpcDaemon.socketEnd())
      .to.eventually.equal(true)
  })
  it('Destroy socket', () => {
    return expect(rpcDaemon.socketDestroy())
      .to.eventually.equal(true)
  })
})
