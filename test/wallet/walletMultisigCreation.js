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

describe('RPCWallet create a multisig wallet', function () {
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

  let aliceMultisiginfo = ''
  let bobMultisiginfo = ''
  let aliceAddress = 'aliceAddress'
  let bobAddress = 'bobAddress'
  let isMultisig = false

  before(async function () {
    try {
      await walletClient.createWallet(optsAlice)
      console.log('Preparing Alice wallet for multisig ...')
      let res = await walletClient.prepareMultisig()
      aliceMultisiginfo = res.multisig_info
      console.log('Closing Alice wallet ...')
      await walletClient.closeWallet()
      console.log('Creating Bob wallet ...')
      await walletClient.createWallet(optsBob)
      console.log('Preparing Bob wallet for multisig ...')
      res = await walletClient.prepareMultisig()
      bobMultisiginfo = res.multisig_info
      console.log('Importing Alice multisig info into Bob wallet ...')
      res = await walletClient.makeMultisig({ multisig_info: [aliceMultisiginfo], threshold: 2, password: 'bob-alice-multisig' })
      bobAddress = res.address
      console.log('Bob: ', bobAddress)
      res = await walletClient.queryKey({ key_type: 'spend_key' })
      console.log('Bob spend: ', res)
      res = await walletClient.queryKey({ key_type: 'view_key' })
      console.log('Bob view: ', res)
      console.log('Closing Bob wallet ...')
      await walletClient.closeWallet()
      console.log('Opening Alice wallet ...')
      await walletClient.openWallet(optsAlice)
      console.log('Importing Bob multisig info into Alice wallet ...')
      res = await walletClient.makeMultisig({ multisig_info: [bobMultisiginfo], threshold: 2, password: 'alice-bob-multisig' })
      aliceAddress = res.address
      console.log('Alice: ', aliceAddress)
      res = await walletClient.queryKey({ key_type: 'spend_key' })
      console.log('Alice spend: ', res)
      res = await walletClient.queryKey({ key_type: 'view_key' })
      console.log('Alice view: ', res)
      console.log('Checking if wallet is multisig ...')
      res = await walletClient.isMultisig()
      isMultisig = res.multisig
      console.log(isMultisig)
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
  it('Check if Alice and Bob addresses match', function () {
    expect(aliceAddress).to.equal(bobAddress)
  })
  it('isMultisig', function () {
    expect(isMultisig).to.equal(true)
  })
})
