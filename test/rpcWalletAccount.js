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

describe('RPCWallet wallet account functions', function () {
  before(async function () {
    try {
      await rpcWallet.socketConnect()
      console.log('Restoring wallet ...')
      await rpcWallet.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'account', seed: config.stagenetSeedA })
      console.log('Refreshing wallet ...')
      await rpcWallet.refresh()
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
  it('getAddressIndex', () => {
    return expect(rpcWallet.getAddressIndex({ address: config.stagenetWalletAddressA }))
      .to.eventually.have.property('index')
      .to.eventually.have.property('major', 0)
  })
  it('addAddressBook', () => {
    return expect(rpcWallet.addAddressBook({ address: config.stagenetWalletAddressB, description: 'AddressB' }))
      .to.eventually.have.property('index', 0)
  })
  it('getAddressBook', () => {
    return expect(rpcWallet.getAddressBook({ entries: [0] }))
      .to.eventually.have.nested.property('entries[0].address', config.stagenetWalletAddressB)
  })
  it('deleteAddressBook', () => {
    return expect(rpcWallet.deleteAddressBook({ index: 0 }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('makeIntegratedAddress', () => {
    return expect(rpcWallet.makeIntegratedAddress({ address: config.check_address, payment_id: config.payment_id }))
      .to.eventually.have.property('integrated_address', config.stagenetWalletIntegratedAddressA)
  })
  it('splitIntegratedAddress', () => {
    return expect(rpcWallet.splitIntegratedAddress({ integrated_address: config.stagenetWalletIntegratedAddressA }))
      .to.eventually.have.property('payment_id', config.payment_id)
  })
  it('createAccount with label "account one"', () => {
    return expect(rpcWallet.createAccount({ label: 'account one' }))
      .to.eventually.have.property('account_index', 1)
  })
  it('createAccount with label "account two"', () => {
    return expect(rpcWallet.createAccount({ label: 'account two' }))
      .to.eventually.have.property('account_index', 2)
  })
  it('getAccounts and check label of "account two"', () => {
    return expect(rpcWallet.getAccounts())
      .to.eventually.have.nested.property('subaddress_accounts[2].label', 'account two')
  })
  it('labelAccount "account two" with "second account"', () => {
    return expect(rpcWallet.labelAccount({ account_index: 2, label: 'second account' }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('getAccounts and check label of "second account"', () => {
    return expect(rpcWallet.getAccounts())
      .to.eventually.have.nested.property('subaddress_accounts[2].label', 'second account')
  })
  it('createAddress on "second account"', () => {
    return expect(rpcWallet.createAddress({ account_index: 2, label: 'sub two' }))
      .to.eventually.have.property('address_index', 1)
  })
  it('getAddress and check label of "sub two"', () => {
    return expect(rpcWallet.getAddress({ account_index: 2 }))
      .to.eventually.have.nested.property('addresses[1].label', 'sub two')
  })
  it('labelAddress "sub two" with "second sub"', () => {
    return expect(rpcWallet.labelAddress({ index: { major: 2, minor: 1 }, label: 'second sub' }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('getAddress and check label of "second sub"', () => {
    return expect(rpcWallet.getAddress({ account_index: 2 }))
      .to.eventually.have.nested.property('addresses[1].label', 'second sub')
  })
  it('tagAccount with "created account"', () => {
    return expect(rpcWallet.tagAccounts({ tag: 'created accounts', accounts: [1, 2] }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('tagAccount with "created account"', () => {
    return expect(rpcWallet.setAccountTagDescription({ tag: 'created accounts', description: 'blablabla' }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('getAccountTags and check label of "created accounts"', () => {
    return expect(rpcWallet.getAccountTags())
      .to.eventually.have.nested.property('account_tags[0].label', 'blablabla')
  })
  it('untagAccounts "created account"', () => {
    return expect(rpcWallet.untagAccounts({ accounts: [1, 2] }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('setAttribute', () => {
    return expect(rpcWallet.setAttribute({ key: 'test', value: 'lalala' }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('getAttribute', () => {
    return expect(rpcWallet.getAttribute({ key: 'test' }))
      .to.eventually.have.property('value', 'lalala')
  })
  it('makeUri', () => {
    return expect(rpcWallet.makeUri({ address: config.stagenetWalletAddressB, amount: 1000000000, payment_id: config.payment_id, recipient_name: 'stagenet B', tx_description: 'test' }))
      .to.eventually.have.property('uri', config.uri)
  })
  it('parseUri', () => {
    return expect(rpcWallet.parseUri({ uri: config.uri }))
      .to.eventually.have.nested.property('uri.address', config.stagenetWalletAddressB)
  })
  it('setTxNotes', () => {
    return expect(rpcWallet.setTxNotes({ txids: config.txids, notes: ['coffee', 'bread'] }))
      .to.eventually.be.an('object').that.is.empty
  })
  it('getTxNotes', () => {
    return expect(rpcWallet.getTxNotes({ txids: config.txids }))
      .to.eventually.have.nested.property('notes[1]', 'bread')
  })
  it('sign string', () => {
    return expect(rpcWallet.sign({ data: config.dataToSign }))
      .to.eventually.have.property('signature')
  })
  it('verify string', () => {
    return expect(rpcWallet.verify({ data: config.dataToSign, address: config.stagenetWalletAddressA, signature: config.signedData }))
      .to.eventually.have.property('good', true)
  })
  it('queryKey', () => {
    return expect(rpcWallet.queryKey({ key_type: 'mnemonic' }))
      .to.eventually.have.property('key', config.stagenetSeedA)
  })
  it('incomingTransfers', () => {
    return expect(rpcWallet.incomingTransfers({ transfer_type: 'all' }))
      .to.eventually.have.nested.property('transfers[0].amount')
  })
  it('getTransfers', () => {
    return expect(rpcWallet.getTransfers({ in: true }))
      .to.eventually.have.nested.property('in[0].address')
  })
  it('getTransferByTxId', () => {
    return expect(rpcWallet.getTransferByTxId({ txid: config.txids[0] }))
      .to.eventually.have.nested.property('transfer.txid', config.txids[0])
  })
  it('getPayments', () => {
    return expect(rpcWallet.getPayments({ payment_id: config.payment_id }))
      .to.eventually.have.nested.property('payments[0].address')
  })
  it('getBulkPayments', () => {
    return expect(rpcWallet.getBulkPayments({ payment_ids: [config.payment_id], min_block_height: 1 }))
      .to.eventually.have.nested.property('payments[0].address')
  })
  it('getVersion', () => {
    return expect(rpcWallet.getVersion())
      .to.eventually.have.property('version')
  })
})
