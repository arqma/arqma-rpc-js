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

let infoAlice = ''
let infoBob = ''
let multisigUnsignedTxSet = ''
let multisigSignedTxSet = ''
// Don't use trusted with remote daemon on production!
// The wallets files should already be present in the wallet-dir folder
describe('RPCWallet transfer multisig wallet', function () {
  let rpcWallet = new RPCWallet({
    url: config.rpcWalletWithAuth,
    username: config.rpcWalletUsername,
    password: config.rpcWalletPassword
  })
  before(async function () {
    try {
      await rpcWallet.socketConnect()
      console.log('Opening Alice wallet ...')
      await rpcWallet.openWallet({ filename: 'alice-multisig-wallet', password: 'alice-bob-multisig' })
      console.log('Setting daemon as trusted ...')
      await rpcWallet.setDaemon({ address: config.daemonWithoutAuth, trusted: true }) // Don't use trusted with remote daemon on production!
      console.log('Refreshing Alice wallet ...')
      await rpcWallet.refresh()
      console.log('Exporting Multisig Info ...')
      let res = await rpcWallet.exportMultisigInfo()
      infoAlice = res.info
      await rpcWallet.closeWallet()
      console.log('Opening Bob wallet ...')
      await rpcWallet.openWallet({ filename: 'bob-multisig-wallet', password: 'bob-alice-multisig' })
      console.log('Refreshing Bob wallet ...')
      await rpcWallet.refresh()
      console.log('Exporting Multisig Info ...')
      res = await rpcWallet.exportMultisigInfo()
      infoBob = res.info
      await rpcWallet.closeWallet()
      console.log('Opening Alice wallet ...')
      await rpcWallet.openWallet({ filename: 'alice-multisig-wallet', password: 'alice-bob-multisig' })
      console.log('Refreshing Alice wallet ...')
      await rpcWallet.refresh()
      console.log('Importing Bob multisig info ...')
      res = await rpcWallet.importMultisigInfo({ info: [infoBob] })
      console.log('Storing wallet ...')
      await rpcWallet.store()
      console.log('Closing wallet ...')
      await rpcWallet.closeWallet()
      console.log('Opening Bob wallet ...')
      await rpcWallet.openWallet({ filename: 'bob-multisig-wallet', password: 'bob-alice-multisig' })
      console.log('Refreshing Bob wallet ...')
      await rpcWallet.refresh()
      console.log('Importing Alice multisig info ...')
      res = await rpcWallet.importMultisigInfo({ info: [infoAlice] })
      console.log('Storing wallet ...')
      await rpcWallet.store()
      await rpcWallet.closeWallet()
      await rpcWallet.openWallet({ filename: 'alice-multisig-wallet', password: 'alice-bob-multisig' })
      console.log('Refreshing Alice wallet ...')
      await rpcWallet.refresh()
      let trn = {
        destinations: [{ amount: 100000000, address: config.stagenetWalletAddressA }],
        priority: 2,
        mixin: 10,
        ring_size: 11,
        unlock_time: 0,
        payment_id: config.payment_id
      }
      console.log('Creating transfer ...')
      res = await rpcWallet.transfer(trn)
      multisigUnsignedTxSet = res.multisig_txset
      console.log('Storing wallet ...')
      await rpcWallet.store()
      console.log('Closing wallet ...')
      await rpcWallet.closeWallet()
      console.log('Opening Bob wallet ...')
      await rpcWallet.openWallet({ filename: 'bob-multisig-wallet', password: 'bob-alice-multisig' })
      console.log('Refreshing Bob wallet ...')
      await rpcWallet.refresh()
      console.log('Signing multisig transfer ...')
      res = await rpcWallet.signMultisig({ tx_data_hex: multisigUnsignedTxSet })
      multisigSignedTxSet = res.tx_data_hex
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
  it('submitMultisig', function () {
    return expect(rpcWallet.submitMultisig({ tx_data_hex: multisigSignedTxSet })).to.eventually.have.property('tx_hash_list')
  })
})
