'use strict'

const describe = require('mocha').describe
const it = require('mocha').it
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const RPCWallet = require('../lib/rpcWallet.js')

let config = require('./config.json')

describe('RPCWallet checks inputs of functions', function () {
  let rpcWallet = new RPCWallet({
    url: config.rpcWalletWithAuth,
    username: config.rpcWalletUsername,
    password: config.rpcWalletPassword
  })
  it('getBalance without parameters should be rejected', () => {
    return expect(rpcWallet.getBalance())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify account_index')
  })
  it('getAddress without parameters should be rejected', () => {
    return expect(rpcWallet.getAddress())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify account_index')
  })
  it('getAddressIndex without parameters should be rejected', () => {
    return expect(rpcWallet.getAddressIndex())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify address')
  })
  it('createAddress without parameters should be rejected', () => {
    return expect(rpcWallet.createAddress())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify account_index')
  })
  it('labelAddress without parameters should be rejected', () => {
    return expect(rpcWallet.labelAddress())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify index')
  })
  it('labelAddress without index subparameters should be rejected', () => {
    let opts = {
      index: {}
    }
    return expect(rpcWallet.labelAddress(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify index subparameters')
  })
  it('labelAddress without index.minor should be rejected', () => {
    let opts = {
      index: {
        major: 0
      }
    }
    return expect(rpcWallet.labelAddress(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify index.minor')
  })
  it('labelAddress without index.major should be rejected', () => {
    let opts = {
      index: {
        minor: 0
      }
    }
    return expect(rpcWallet.labelAddress(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify index.major')
  })
  it('labelAddress without label parameter should be rejected', () => {
    let opts = {
      index: {
        major: 0,
        minor: 5
      }
    }
    return expect(rpcWallet.labelAddress(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify label')
  })
  it('labelAccount without parameters should be rejected', () => {
    return expect(rpcWallet.labelAccount())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify account_index')
  })
  it('labelAccount without label parameter should be rejected', () => {
    let opts = {
      account_index: 0
    }
    return expect(rpcWallet.labelAccount(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify label')
  })
  it('tagAccounts without parameters should be rejected', () => {
    return expect(rpcWallet.tagAccounts())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify tag')
  })
  it('tagAccounts without accounts parameter should be rejected', () => {
    let opts = {
      tag: 'test'
    }
    return expect(rpcWallet.tagAccounts(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify accounts')
  })
  it('tagAccounts with accounts parameter as a number should be rejected', () => {
    let opts = {
      tag: 'test',
      accounts: 1
    }
    return expect(rpcWallet.tagAccounts(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'accounts should be an array of numbers')
  })
  it('untagAccounts without parameters should be rejected', () => {
    return expect(rpcWallet.untagAccounts())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify accounts')
  })
  it('untagAccounts with accounts parameter as a number should be rejected', () => {
    let opts = {
      accounts: 1
    }
    return expect(rpcWallet.untagAccounts(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'accounts should be an array of numbers')
  })
  it('setAccountTagDescription without parameters should be rejected', () => {
    return expect(rpcWallet.setAccountTagDescription())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify tag')
  })
  it('setAccountTagDescription without description parameter should be rejected', () => {
    let opts = {
      tag: 'test'
    }
    return expect(rpcWallet.setAccountTagDescription(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify description')
  })
  it('transfer without parameters should be rejected', () => {
    return expect(rpcWallet.transfer())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify destinations')
  })
  it('transfer without destinations[0].amount  should be rejected', () => {
    let opts = {
      destinations:
              [
                { address: config.stagenetWalletAddressA }
              ]
    }
    return expect(rpcWallet.transfer(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify destinations[0].amount')
  })
  it('transfer without destinations[0].address  should be rejected', () => {
    let opts = {
      destinations:
              [
                { amount: 10 }
              ]
    }
    return expect(rpcWallet.transfer(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify destinations[0].address')
  })
  it('transfer without priority  should be rejected', () => {
    let opts = {
      destinations:
              [
                {
                  amount: 10,
                  address: config.stagenetWalletAddressA
                }
              ]
    }
    return expect(rpcWallet.transfer(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify priority')
  })
  it('transfer without mixin should be rejected', () => {
    let opts = {
      destinations:
              [
                {
                  amount: 10,
                  address: config.stagenetWalletAddressA
                }
              ],
      priority: 3
    }
    return expect(rpcWallet.transfer(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify mixin')
  })
  it('transfer without ring_size should be rejected', () => {
    let opts = {
      destinations:
              [
                {
                  amount: 10,
                  address: config.stagenetWalletAddressA
                }
              ],
      priority: 3,
      mixin: 9
    }
    return expect(rpcWallet.transfer(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify ring_size')
  })
  it('transfer without unlock_time should be rejected', () => {
    let opts = {
      destinations:
              [
                {
                  amount: 10,
                  address: config.stagenetWalletAddressA
                }
              ],
      priority: 3,
      mixin: 9,
      ring_size: 5
    }
    return expect(rpcWallet.transfer(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify unlock_time')
  })
  it('transferSplit without parameters should be rejected', () => {
    return expect(rpcWallet.transferSplit())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify destinations')
  })
  it('transferSplit without destinations[0].amount  should be rejected', () => {
    let opts = {
      destinations:
              [
                { address: config.stagenetWalletAddressA }
              ]
    }
    return expect(rpcWallet.transferSplit(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify destinations[0].amount')
  })
  it('transferSplit without destinations[0].address  should be rejected', () => {
    let opts = {
      destinations:
              [
                { amount: 10 }
              ]
    }
    return expect(rpcWallet.transferSplit(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify destinations[0].address')
  })
  it('transferSplit without mixin should be rejected', () => {
    let opts = {
      destinations:
              [
                {
                  amount: 10,
                  address: config.stagenetWalletAddressA
                }
              ]
    }
    return expect(rpcWallet.transferSplit(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify mixin')
  })
  it('transferSplit without ring_size should be rejected', () => {
    let opts = {
      destinations:
              [
                {
                  amount: 10,
                  address: config.stagenetWalletAddressA
                }
              ],
      mixin: 9
    }
    return expect(rpcWallet.transferSplit(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify ring_size')
  })
  it('transferSplit without unlock_time should be rejected', () => {
    let opts = {
      destinations:
              [
                {
                  amount: 10,
                  address: config.stagenetWalletAddressA
                }
              ],
      mixin: 9,
      ring_size: 5
    }
    return expect(rpcWallet.transferSplit(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify unlock_time')
  })
  it('transferSplit without priority  should be rejected', () => {
    let opts = {
      destinations:
              [
                {
                  amount: 10,
                  address: config.stagenetWalletAddressA
                }
              ],
      mixin: 9,
      ring_size: 5,
      unlock_time: 100
    }
    return expect(rpcWallet.transferSplit(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify priority')
  })
  it('signTransfer without parameters should be rejected', () => {
    return expect(rpcWallet.signTransfer())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify unsigned_txset')
  })
  it('submitTransfer without parameters should be rejected', () => {
    return expect(rpcWallet.submitTransfer())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify tx_data_hex')
  })
  it('sweepAll without parameters should be rejected', () => {
    return expect(rpcWallet.sweepAll())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify address')
  })
  it('sweepAll without account_index should be rejected', () => {
    let opts = {
      address: config.stagenetWalletAddressA
    }
    return expect(rpcWallet.sweepAll(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify account_index')
  })
  it('sweepAll without mixin should be rejected', () => {
    let opts = {
      address: config.stagenetWalletAddressA,
      account_index: 0
    }
    return expect(rpcWallet.sweepAll(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify mixin')
  })
  it('sweepAll without ring_size should be rejected', () => {
    let opts = {
      address: config.stagenetWalletAddressA,
      account_index: 0,
      mixin: 9
    }
    return expect(rpcWallet.sweepAll(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify ring_size')
  })
  it('sweepAll without unlock_time should be rejected', () => {
    let opts = {
      address: config.stagenetWalletAddressA,
      account_index: 0,
      mixin: 9,
      ring_size: 5
    }
    return expect(rpcWallet.sweepAll(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify unlock_time')
  })
  it('sweepSingle without parameters should be rejected', () => {
    return expect(rpcWallet.sweepSingle())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify address')
  })
  it('sweepSingle without account_index should be rejected', () => {
    let opts = {
      address: config.stagenetWalletAddressA
    }
    return expect(rpcWallet.sweepSingle(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify account_index')
  })
  it('sweepSingle without mixin should be rejected', () => {
    let opts = {
      address: config.stagenetWalletAddressA,
      account_index: 0
    }
    return expect(rpcWallet.sweepSingle(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify mixin')
  })
  it('sweepSingle without ring_size should be rejected', () => {
    let opts = {
      address: config.stagenetWalletAddressA,
      account_index: 0,
      mixin: 9
    }
    return expect(rpcWallet.sweepSingle(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify ring_size')
  })
  it('sweepSingle without unlock_time should be rejected', () => {
    let opts = {
      address: config.stagenetWalletAddressA,
      account_index: 0,
      mixin: 9,
      ring_size: 5
    }
    return expect(rpcWallet.sweepSingle(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify unlock_time')
  })
  it('relayTx without parameters should be rejected', () => {
    return expect(rpcWallet.relayTx())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify hex')
  })
  it('getPayments without parameters should be rejected', () => {
    return expect(rpcWallet.getPayments())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify payment_id')
  })
  it('getBulkPayments without parameters should be rejected', () => {
    return expect(rpcWallet.getBulkPayments())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify payment_ids')
  })
  it('getBulkPayments with payment_ids parameter as a string should be rejected', () => {
    let opts = { payment_ids: 'lalala' }
    return expect(rpcWallet.getBulkPayments(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'payments_ids should be an array of strings')
  })
  it('getBulkPayments without min_block_height parameter should be rejected', () => {
    let opts = { payment_ids: ['lalala'] }
    return expect(rpcWallet.getBulkPayments(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify min_block_height')
  })
  it('incomingTransfers without parameters should be rejected', () => {
    return expect(rpcWallet.incomingTransfers())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify transfer_type')
  })
  it('queryKey without parameters should be rejected', () => {
    return expect(rpcWallet.queryKey())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify key_type')
  })
  it('splitIntegratedAddress without parameters should be rejected', () => {
    return expect(rpcWallet.splitIntegratedAddress())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify integrated_address')
  })
  it('setTxNotes without parameters should be rejected', () => {
    return expect(rpcWallet.setTxNotes())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify txids')
  })
  it('setTxNotes with txids parameter as a string should be rejected', () => {
    let opts = {
      txids: '9fd75c429cbe52da9a52f2ffc5fbd107fe7fd2099c0d8de274dc8a67e0c98613'
    }
    return expect(rpcWallet.setTxNotes(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'txids should be an array of strings')
  })
  it('setTxNotes without notes parameter should be rejected', () => {
    let opts = {
      txids: ['9fd75c429cbe52da9a52f2ffc5fbd107fe7fd2099c0d8de274dc8a67e0c98613']
    }
    return expect(rpcWallet.setTxNotes(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify notes')
  })
  it('setTxNotes with notes parameter as a string should be rejected', () => {
    let opts = {
      txids: ['9fd75c429cbe52da9a52f2ffc5fbd107fe7fd2099c0d8de274dc8a67e0c98613'],
      notes: 'lala'
    }
    return expect(rpcWallet.setTxNotes(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'notes should be an array of strings')
  })
  it('getTxNotes without parameters should be rejected', () => {
    return expect(rpcWallet.getTxNotes())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify txids')
  })
  it('getTxNotes with txids parameter as a string should be rejected', () => {
    let opts = {
      txids: '9fd75c429cbe52da9a52f2ffc5fbd107fe7fd2099c0d8de274dc8a67e0c98613'
    }
    return expect(rpcWallet.getTxNotes(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'txids should be an array of strings')
  })
  it('setAttribute without parameters should be rejected', () => {
    return expect(rpcWallet.setAttribute())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify key')
  })
  it('setAttribute without value parameter should be rejected', () => {
    let opts = {
      key: 'my_attribute'
    }
    return expect(rpcWallet.setAttribute(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify value')
  })
  it('getAttribute without parameters should be rejected', () => {
    return expect(rpcWallet.getAttribute())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify key')
  })
  it('getTxKey without parameters should be rejected', () => {
    return expect(rpcWallet.getTxKey())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify txid')
  })
  it('checkTxKey without parameters should be rejected', () => {
    return expect(rpcWallet.checkTxKey())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify txid')
  })
  it('checkTxKey without tx_key parameter should be rejected', () => {
    let opts = {
      txid: '9fd75c429cbe52da9a52f2ffc5fbd107fe7fd2099c0d8de274dc8a67e0c98613'
    }
    return expect(rpcWallet.checkTxKey(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify tx_key')
  })
  it('checkTxKey without address parameter should be rejected', () => {
    let opts = {
      txid: '9fd75c429cbe52da9a52f2ffc5fbd107fe7fd2099c0d8de274dc8a67e0c98613',
      tx_key: 'cdea662cf8fb6d0d1da18fc9b70ab28e01cc76311278fdd7fe7ab16360754b06'
    }
    return expect(rpcWallet.checkTxKey(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify address')
  })
  it('getTxProof without parameters should be rejected', () => {
    return expect(rpcWallet.getTxProof())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify txid')
  })
  it('getTxProof without address parameter should be rejected', () => {
    let opts = {
      txid: '9fd75c429cbe52da9a52f2ffc5fbd107fe7fd2099c0d8de274dc8a67e0c98613'
    }
    return expect(rpcWallet.getTxProof(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify address')
  })
  it('checkTxProof without parameters should be rejected', () => {
    return expect(rpcWallet.checkTxProof())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify txid')
  })
  it('checkTxProof without address parameter should be rejected', () => {
    let opts = {
      txid: '9fd75c429cbe52da9a52f2ffc5fbd107fe7fd2099c0d8de274dc8a67e0c98613'
    }
    return expect(rpcWallet.checkTxProof(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify address')
  })
  it('checkTxProof without signature parameter should be rejected', () => {
    let opts = {
      txid: '9fd75c429cbe52da9a52f2ffc5fbd107fe7fd2099c0d8de274dc8a67e0c98613',
      address: config.stagenetWalletAddressA
    }
    return expect(rpcWallet.checkTxProof(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify signature')
  })
  it('getSpendProof without parameters should be rejected', () => {
    return expect(rpcWallet.getSpendProof())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify txid')
  })
  it('checkSpendProof without parameters should be rejected', () => {
    return expect(rpcWallet.checkSpendProof())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify txid')
  })
  it('checkSpendProof without signature parameter should be rejected', () => {
    let opts = {
      txid: '9fd75c429cbe52da9a52f2ffc5fbd107fe7fd2099c0d8de274dc8a67e0c98613'
    }
    return expect(rpcWallet.checkSpendProof(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify signature')
  })
  it('getReserveProof without parameters should be rejected', () => {
    return expect(rpcWallet.getReserveProof())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify all')
  })
  it('getReserveProof without all parameter should be rejected', () => {
    let opts = {
      all: true
    }
    return expect(rpcWallet.getReserveProof(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify account_index')
  })
  it('getReserveProof without amount parameter should be rejected', () => {
    let opts = {
      all: true,
      account_index: 0
    }
    return expect(rpcWallet.getReserveProof(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify amount')
  })
  it('checkReserveProof without parameters should be rejected', () => {
    return expect(rpcWallet.checkReserveProof())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify address')
  })
  it('checkReserveProof without signature parameter should be rejected', () => {
    let opts = {
      address: config.stagenetWalletAddressA
    }
    return expect(rpcWallet.checkReserveProof(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify signature')
  })
  it('getTransferByTxId without parameters should be rejected', () => {
    return expect(rpcWallet.getTransferByTxId())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify txid')
  })
  it('sign without parameters should be rejected', () => {
    return expect(rpcWallet.sign())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify data')
  })
  it('verify without parameters should be rejected', () => {
    return expect(rpcWallet.verify())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify data')
  })
  it('verify without address parameter should be rejected', () => {
    let opts = {
      data: 'data to be signed'
    }
    return expect(rpcWallet.verify(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify address')
  })
  it('verify without signature parameter should be rejected', () => {
    let opts = {
      data: 'data to be signed',
      address: config.stagenetWalletAddressA
    }
    return expect(rpcWallet.verify(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify signature')
  })
  it('importOutputs without parameters should be rejected', () => {
    return expect(rpcWallet.importOutputs())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify outputs_data_hex')
  })
  it('importKeyImages without parameters should be rejected', () => {
    return expect(rpcWallet.importKeyImages())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify signed_key_images')
  })
  it('importKeyImages with signed_key_images parameter as a string should be rejected', () => {
    let opts = {
      signed_key_images: '9fd75c429cbe52da9a52f2ffc5fbd107fe7fd2099c0d8de274dc8a67e0c98613'
    }
    return expect(rpcWallet.importKeyImages(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'signed_key_images should be an array of {key, signature}')
  })
  it('importKeyImages without key parameter should be rejected', () => {
    let opts = {
      signed_key_images: [
        { }
      ]
    }
    return expect(rpcWallet.importKeyImages(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify signed_key_images[0].key')
  })
  it('importKeyImages without signature parameter should be rejected', () => {
    let opts = {
      signed_key_images: [
        { key_image: '9fd75c429cbe52da9a52f2ffc5fbd107fe7fd2099c0d8de274dc8a67e0c98613' }
      ]
    }
    return expect(rpcWallet.importKeyImages(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify signed_key_images[0].signature')
  })
  it('makeUri without parameters should be rejected', () => {
    return expect(rpcWallet.makeUri())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify address')
  })
  it('parseUri without parameters should be rejected', () => {
    return expect(rpcWallet.parseUri())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify uri')
  })
  it('getAddressBook without parameters should be rejected', () => {
    return expect(rpcWallet.getAddressBook())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify entries')
  })
  it('getAddressBook with entries parameter as a number should be rejected', () => {
    let opts = {
      entries: 1
    }
    return expect(rpcWallet.getAddressBook(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'entries should be an array of unsigned int')
  })
  it('addAddressBook without parameters should be rejected', () => {
    return expect(rpcWallet.addAddressBook())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify address')
  })
  it('deleteAddressBook without parameters should be rejected', () => {
    return expect(rpcWallet.deleteAddressBook())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify index')
  })
  it('startMining without parameters should be rejected', () => {
    return expect(rpcWallet.startMining())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify threads_count')
  })
  it('startMining without do_background_mining parameter should be rejected', () => {
    let opts = {
      threads_count: 1
    }
    return expect(rpcWallet.startMining(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify do_background_mining')
  })
  it('startMining without ignore_battery parameter should be rejected', () => {
    let opts = {
      threads_count: 1,
      do_background_mining: true
    }
    return expect(rpcWallet.startMining(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify ignore_battery')
  })
  it('createWallet without parameters should be rejected', () => {
    return expect(rpcWallet.createWallet())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify filename')
  })
  it('createWallet without language parameter should be rejected', () => {
    let opts = {
      filename: 'myWallet'
    }
    return expect(rpcWallet.createWallet(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify language')
  })
  it('openWallet without parameters should be rejected', () => {
    return expect(rpcWallet.openWallet())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify filename')
  })
  it('generateFromKeys without parameters should be rejected', () => {
    return expect(rpcWallet.generateFromKeys())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify filename')
  })
  it('generateFromKeys without seed parameter should be rejected', () => {
    return expect(rpcWallet.generateFromKeys({ filename: 'test' }))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify address')
  })
  it('generateFromKeys without viewkey parameter should be rejected', () => {
    return expect(rpcWallet.generateFromKeys({ filename: 'test', address: 'an address...' }))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify viewkey')
  })
  it('restoreDeterministicWallet without parameters should be rejected', () => {
    return expect(rpcWallet.restoreDeterministicWallet())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify filename')
  })
  it('restoreDeterministicWallet without seed parameter should be rejected', () => {
    return expect(rpcWallet.restoreDeterministicWallet({ filename: 'test' }))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify seed')
  })
  it('makeMultisig without parameters should be rejected', () => {
    return expect(rpcWallet.makeMultisig())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify multisig_info')
  })
  it('makeMultisig with a multisig_info string parameter should be rejected', () => { //
    let opts = {
      multisig_info: 'Multisig...'
    }
    return expect(rpcWallet.makeMultisig(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'multisig_info should be an array of strings')
  })
  it('makeMultisig without threshold parameter should be rejected', () => {
    let opts = {
      multisig_info: ['Multisig...']
    }
    return expect(rpcWallet.makeMultisig(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify threshold')
  })
  it('makeMultisig without password parameter should be rejected', () => {
    let opts = {
      multisig_info: ['Multisig...'],
      threshold: 2
    }
    return expect(rpcWallet.makeMultisig(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify password')
  })
  it('importMultisigInfo without parameters should be rejected', () => {
    return expect(rpcWallet.importMultisigInfo())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify info')
  })
  it('importMultisigInfo with info parameter as a string should be rejected', () => {
    let opts = {
      info: 'Multisig...'
    }
    return expect(rpcWallet.importMultisigInfo(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'info should be an array of strings')
  })
  it('finalizeMultisig without parameters should be rejected', () => {
    return expect(rpcWallet.finalizeMultisig())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify multisig_info')
  })
  it('finalizeMultisigInfo with multisig_info parameter as a string should be rejected', () => {
    let opts = {
      multisig_info: 'Multisig...'
    }
    return expect(rpcWallet.finalizeMultisig(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'multisig_info should be an array of strings')
  })
  it('finalizeMultisig without password parameter should be rejected', () => {
    let opts = {
      multisig_info: ['Multisig...']
    }
    return expect(rpcWallet.finalizeMultisig(opts))
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify password')
  })
  it('signMultisig without parameters should be rejected', () => {
    return expect(rpcWallet.signMultisig())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify tx_data_hex')
  })
  it('submitMultisig without parameters should be rejected', () => {
    return expect(rpcWallet.submitMultisig())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify tx_data_hex')
  })
  it('validateAddress without parameters should be rejected', () => {
    return expect(rpcWallet.validateAddress())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify address')
  })
  it('setDaemon without parameters should be rejected', () => {
    return expect(rpcWallet.setDaemon())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify address')
  })
  it('setLogLevel without parameters should be rejected', () => {
    return expect(rpcWallet.setLogLevel())
      .to.eventually.be.rejected
      .and.be.an.instanceOf(Error)
      .with.property('message', 'must specify level')
  })
})
