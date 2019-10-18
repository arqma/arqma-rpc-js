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

let spendBalance = -1
let viewBalance = -1
let unsignedTx = ''
let signedTxSet = ''
let txHashList = ''

describe('RPCWallet uses hot and cold wallet', function () {
  before(async function () {
    try {
      await rpcWallet.socketConnect()
      console.log('Restoring view wallet from keys ...')
      await rpcWallet.generateFromKeys({ address: config.stagenetWalletAddressA, filename: 'view_wallet', viewkey: config.stagenetWalletViewKeyA })
      console.log('Refreshing view wallet ...')
      await rpcWallet.refresh()
      console.log('Exporting outputs ...')
      let res = await rpcWallet.exportOutputs()
      this.outputsDataHex = res.outputs_data_hex
      res = await rpcWallet.getBalance({ account_index: 0 })
      console.log('Unsigned view wallet balance is: ', (Number(res.unlocked_balance) * 0.000000001))
      console.log('Closing view wallet ...')
      await rpcWallet.closeWallet()
      console.log('Restoring spend wallet from keys ...')
      await rpcWallet.generateFromKeys({ address: config.stagenetWalletAddressA, filename: 'spend_wallet', viewkey: config.stagenetWalletViewKeyA, spendkey: config.stagenetWalletSpendKeyA })
      console.log('Refreshing spend wallet ...')
      await rpcWallet.refresh()
      res = await rpcWallet.getBalance({ account_index: 0 })
      spendBalance = res.unlocked_balance
      console.log('Spend wallet balance is: ', (Number(res.unlocked_balance) * 0.000000001))
      console.log('Importing outputs ...')
      await rpcWallet.importOutputs({ outputs_data_hex: this.outputsDataHex })
      console.log('Exporting signed key images ...')
      res = await rpcWallet.exportKeyImages()
      this.signed_key_images = res.signed_key_images
      console.log('Closing spend wallet ...')
      await rpcWallet.closeWallet()
      console.log('Opening view wallet ...')
      await rpcWallet.openWallet({ filename: 'view_wallet' })
      console.log('Setting daemon as trusted ...')
      await rpcWallet.setDaemon({ address: config.daemonWithoutAuth, trusted: true }) // Don't use trusted with remote daemon on production!
      console.log('Importing signed key images ...')
      await rpcWallet.importKeyImages({ signed_key_images: this.signed_key_images })
      await rpcWallet.refresh()
      res = await rpcWallet.getBalance({ account_index: 0 })
      viewBalance = res.unlocked_balance
      console.log('Signed view wallet balance is: ', (Number(res.unlocked_balance) * 0.000000001))
      let trn = {
        destinations: [{ amount: 1000000000, address: config.stagenetWalletAddressB }],
        priority: 2,
        mixin: 20,
        ring_size: 21,
        unlock_time: 0,
        payment_id: config.payment_id
      }
      console.log('Preparing transfer  ...')
      res = await rpcWallet.transfer(trn)
      unsignedTx = res.unsigned_txset
      console.log('Closing view wallet ...')
      await rpcWallet.closeWallet()
      console.log('Opening spend wallet ...')
      await rpcWallet.openWallet({ filename: 'spend_wallet' })
      res = await rpcWallet.signTransfer({ unsigned_txset: unsignedTx })
      signedTxSet = res.signed_txset
      console.log('Closing spend wallet ...')
      await rpcWallet.closeWallet()
      console.log('Opening view wallet ...')
      await rpcWallet.openWallet({ filename: 'view_wallet' })
      console.log('Submitting transfer ...')
      res = await rpcWallet.submitTransfer({ tx_data_hex: signedTxSet })
      txHashList = res
      console.log('Closing view wallet ...')
      await rpcWallet.closeWallet()
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
  it('Check if balances between view and spend match', function () {
    expect(viewBalance).to.equal(spendBalance)
  })
  it('Check if tx_hash_list is present', function () {
    expect(txHashList).to.have.nested.property('tx_hash_list[0]')
  })
})
