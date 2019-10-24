'use strict'

const describe = require('mocha').describe
const it = require('mocha').it
const before = require('mocha').before
const after = require('mocha').after
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const rpcWallet = require('../../lib/rpcWallet.js')

const config = require('./config')

describe('RPCWallet transfer from multisig wallet', function () {
  const walletClient = rpcWallet.createWalletClient({
    url: config.walletAddress,
    username: config.walletUsername,
    password: config.walletPassword
  })
  walletClient.sslRejectUnauthorized(false)

  const optsAlice = {}
  optsAlice.filename = 'alice-multisig-wallet'
  optsAlice.password = 'alice-multisig-wallet'
  optsAlice.language = 'English'

  const optsBob = {}
  optsBob.filename = 'bob-multisig-wallet'
  optsBob.password = 'bob-multisig-wallet'
  optsBob.language = 'English'

  let infoAlice = ''
  let infoBob = ''
  let multisigUnsignedTxSet = ''
  let multisigSignedTxSet = ''

  before(async function () {
    try {
      console.log('Opening Alice wallet ...')
      await walletClient.openWallet({ filename: 'alice-multisig-wallet', password: 'alice-bob-multisig' })
      console.log('Setting daemon as trusted ...')
      await walletClient.setDaemon({ address: config.daemonAddress, trusted: true }) // Don't use trusted with remote daemon on production!
      console.log('Refreshing Alice wallet ...')
      await walletClient.refresh()
      console.log('Exporting Multisig Info ...')
      let res = await walletClient.exportMultisigInfo()
      infoAlice = res.info
      await walletClient.closeWallet()
      console.log('Opening Bob wallet ...')
      await walletClient.openWallet({ filename: 'bob-multisig-wallet', password: 'bob-alice-multisig' })
      console.log('Refreshing Bob wallet ...')
      await walletClient.refresh()
      console.log('Exporting Multisig Info ...')
      res = await walletClient.exportMultisigInfo()
      infoBob = res.info
      await walletClient.closeWallet()
      console.log('Opening Alice wallet ...')
      await walletClient.openWallet({ filename: 'alice-multisig-wallet', password: 'alice-bob-multisig' })
      console.log('Refreshing Alice wallet ...')
      await walletClient.refresh()
      console.log('Importing Bob multisig info ...')
      res = await walletClient.importMultisigInfo({ info: [infoBob] })
      console.log('Storing wallet ...')
      await walletClient.store()
      console.log('Closing wallet ...')
      await walletClient.closeWallet()
      console.log('Opening Bob wallet ...')
      await walletClient.openWallet({ filename: 'bob-multisig-wallet', password: 'bob-alice-multisig' })
      console.log('Refreshing Bob wallet ...')
      await walletClient.refresh()
      console.log('Importing Alice multisig info ...')
      res = await walletClient.importMultisigInfo({ info: [infoAlice] })
      console.log('Storing wallet ...')
      await walletClient.store()
      await walletClient.closeWallet()
      await walletClient.openWallet({ filename: 'alice-multisig-wallet', password: 'alice-bob-multisig' })
      console.log('Refreshing Alice wallet ...')
      await walletClient.refresh()
      const trn = {
        destinations: [{ amount: 100000000, address: config.stagenetWalletAddressA }],
        priority: 2,
        mixin: 10,
        ring_size: 11,
        unlock_time: 0,
        payment_id: config.payment_id
      }
      console.log('Creating transfer ...')
      res = await walletClient.transfer(trn)
      multisigUnsignedTxSet = res.multisig_txset
      console.log('Storing wallet ...')
      await walletClient.store()
      console.log('Closing wallet ...')
      await walletClient.closeWallet()
      console.log('Opening Bob wallet ...')
      await walletClient.openWallet({ filename: 'bob-multisig-wallet', password: 'bob-alice-multisig' })
      console.log('Refreshing Bob wallet ...')
      await walletClient.refresh()
      console.log('Signing multisig transfer ...')
      res = await walletClient.signMultisig({ tx_data_hex: multisigUnsignedTxSet })
      multisigSignedTxSet = res.tx_data_hex
    } catch (e) {
      console.log('Error in before', e)
    }
  })
  after(async function () {
    try {
      await walletClient.closeWallet()
    } catch (e) {
      console.log('Error in after', e)
    }
  })
  it('submitMultisig', function () {
    return expect(walletClient.submitMultisig({ tx_data_hex: multisigSignedTxSet })).to.eventually.have.property('tx_hash_list')
  })
})
