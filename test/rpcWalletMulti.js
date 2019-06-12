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

// Don't use trusted with remote daemon on production!

let optsAlice = {}
optsAlice.filename = 'alice-multisig-wallet'
optsAlice.password = 'alice-multisig-wallet'
optsAlice.language = 'English'

let optsBob = {}
optsBob.filename = 'bob-multisig-wallet'
optsBob.password = 'bob-multisig-wallet'
optsBob.language = 'English'

describe('RPCWallet create a multisig wallet', function () {
  let rpcWallet = new RPCWallet({
    url: config.rpcWalletWithAuth,
    username: config.rpcWalletUsername,
    password: config.rpcWalletPassword
  })

  let aliceMultisiginfo = ''
  let bobMultisiginfo = ''
  let aliceAddress = 'aliceAddress'
  let bobAddress = 'bobAddress'
  let isMultisig = false

  before(async function () {
    try {
      await rpcWallet.socketConnect()
      console.log('Creating Alice wallet ...')
      await rpcWallet.createWallet(optsAlice)
      console.log('Preparing Alice wallet for multisig ...')
      let res = await rpcWallet.prepareMultisig()
      aliceMultisiginfo = res.multisig_info
      console.log('Closing Alice wallet ...')
      await rpcWallet.closeWallet()
      console.log('Creating Bob wallet ...')
      await rpcWallet.createWallet(optsBob)
      console.log('Preparing Bob wallet for multisig ...')
      res = await rpcWallet.prepareMultisig()
      bobMultisiginfo = res.multisig_info
      console.log('Importing Alice multisig info into Bob wallet ...')
      res = await rpcWallet.makeMultisig({ multisig_info: [aliceMultisiginfo], threshold: 2, password: 'bob-alice-multisig' })
      bobAddress = res.address
      console.log('Bob: ', bobAddress)
      res = await rpcWallet.queryKey({ key_type: 'spend_key' })
      console.log('Bob spend: ', res)
      res = await rpcWallet.queryKey({ key_type: 'view_key' })
      console.log('Bob view: ', res)
      console.log('Closing Bob wallet ...')
      await rpcWallet.closeWallet()
      console.log('Opening Alice wallet ...')
      await rpcWallet.openWallet(optsAlice)
      console.log('Importing Bob multisig info into Alice wallet ...')
      res = await rpcWallet.makeMultisig({ multisig_info: [bobMultisiginfo], threshold: 2, password: 'alice-bob-multisig' })
      aliceAddress = res.address
      console.log('Alice: ', aliceAddress)
      res = await rpcWallet.queryKey({ key_type: 'spend_key' })
      console.log('Alice spend: ', res)
      res = await rpcWallet.queryKey({ key_type: 'view_key' })
      console.log('Alice view: ', res)
      console.log('Checking if wallet is multisig ...')
      res = await rpcWallet.isMultisig()
      isMultisig = res.multisig
      console.log(isMultisig)
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
  it('Check if Alice and Bob addresses match', function () {
    expect(aliceAddress).to.equal(bobAddress)
  })
  it('isMultisig', function () {
    expect(isMultisig).to.equal(true)
  })
})
