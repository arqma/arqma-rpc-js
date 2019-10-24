'use strict'

const describe = require('mocha').describe
const it = require('mocha').it
const before = require('mocha').before
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const rpcWallet = require('../../lib/rpcWallet.js')

const config = require('./config')

describe('RPCWallet uses hot and cold wallet', function () {
  const walletClient = rpcWallet.createWalletClient({
    url: config.walletAddress,
    username: config.walletUsername,
    password: config.walletPassword
  })
  walletClient.sslRejectUnauthorized(false)

  let spendBalance = -1
  let viewBalance = -1
  let unsignedTx = ''
  let signedTxSet = ''
  let txHashList = ''

  before(async function () {
    try {
      console.log('Restoring view wallet from keys ...')
      await walletClient.generateFromKeys({ address: config.stagenetWalletAddressA, filename: 'view_wallet', viewkey: config.stagenetWalletViewKeyA })
      console.log('Refreshing view wallet ...')
      await walletClient.refresh()
      console.log('Exporting outputs ...')
      let res = await walletClient.exportOutputs()
      this.outputsDataHex = res.outputs_data_hex
      res = await walletClient.getBalance({ account_index: 0 })
      console.log('Unsigned view wallet balance is: ', (Number(res.unlocked_balance) * 0.000000001))
      console.log('Closing view wallet ...')
      await walletClient.closeWallet()
      console.log('Restoring spend wallet from keys ...')
      await walletClient.generateFromKeys({ address: config.stagenetWalletAddressA, filename: 'spend_wallet', viewkey: config.stagenetWalletViewKeyA, spendkey: config.stagenetWalletSpendKeyA })
      console.log('Refreshing spend wallet ...')
      await walletClient.refresh()
      res = await walletClient.getBalance({ account_index: 0 })
      spendBalance = res.unlocked_balance
      console.log('Spend wallet balance is: ', (Number(res.unlocked_balance) * 0.000000001))
      console.log('Importing outputs ...')
      await walletClient.importOutputs({ outputs_data_hex: this.outputsDataHex })
      console.log('Exporting signed key images ...')
      res = await walletClient.exportKeyImages()
      this.signed_key_images = res.signed_key_images
      console.log('Closing spend wallet ...')
      await walletClient.closeWallet()
      console.log('Opening view wallet ...')
      await walletClient.openWallet({ filename: 'view_wallet' })
      console.log('Setting daemon as trusted ...')
      await walletClient.setDaemon({ address: config.daemonAddress, trusted: true }) // Don't use trusted with remote daemon on production!
      console.log('Importing signed key images ...')
      await walletClient.importKeyImages({ signed_key_images: this.signed_key_images })
      await walletClient.refresh()
      res = await walletClient.getBalance({ account_index: 0 })
      viewBalance = res.unlocked_balance
      console.log('Signed view wallet balance is: ', (Number(res.unlocked_balance) * 0.000000001))
      const trn = {
        destinations: [{ amount: 1000000000, address: config.stagenetWalletAddressB }],
        priority: 2,
        mixin: 20,
        ring_size: 21,
        unlock_time: 0,
        payment_id: config.payment_id
      }
      console.log('Preparing transfer  ...')
      res = await walletClient.transfer(trn)
      unsignedTx = res.unsigned_txset
      console.log('Closing view wallet ...')
      await walletClient.closeWallet()
      console.log('Opening spend wallet ...')
      await walletClient.openWallet({ filename: 'spend_wallet' })
      res = await walletClient.signTransfer({ unsigned_txset: unsignedTx, export_raw: true })
      signedTxSet = res.signed_txset
      console.log('Closing spend wallet ...')
      await walletClient.closeWallet()
      console.log('Opening view wallet ...')
      await walletClient.openWallet({ filename: 'view_wallet' })
      console.log('Submitting transfer ...')
      res = await walletClient.submitTransfer({ tx_data_hex: signedTxSet })
      txHashList = res
      console.log('Closing view wallet ...')
      await walletClient.closeWallet()
    } catch (e) {
      console.log('Error in before', e)
    }
  })
  it('Check if balances between view and spend match', function () {
    expect(viewBalance).to.equal(spendBalance)
  })
  it('Check if tx_hash_list is present', function () {
    expect(txHashList).to.have.nested.property('tx_hash_list[0]')
  })
})
