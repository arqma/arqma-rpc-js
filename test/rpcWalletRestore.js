'use strict'

const describe = require('mocha').describe
const it = require('mocha').it
const before = require('mocha').before
const after = require('mocha').after
const afterEach = require('mocha').afterEach
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

describe('RPCWallet wallet file restore functions test', function () {
  before(async function () {
    try {
      await rpcWallet.socketConnect()
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
  afterEach(async function () {
    try {
      await rpcWallet.closeWallet()
    } catch (e) {
      console.log('Error in afterEach', e)
    }
  })
  it('restoreDeterministicWallet with seed', () => {
    return expect(rpcWallet.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'deterministic', seed: config.stagenetSeedA }))
      .to.eventually.have.property('address', config.stagenetWalletAddressA)
  })
  it('generateFromKeys with spend_key', () => {
    let keys = {
      restore_height: config.restore_height,
      filename: 'recovery_spend_key',
      address: config.stagenetWalletIntegratedAddressA,
      viewkey: config.stagenetWalletViewKeyA,
      spendkey: config.stagenetWalletSpendKeyA
    }
    return expect(rpcWallet.generateFromKeys(keys))
      .to.eventually.have.property('address', config.stagenetWalletAddressA)
  })
  it('generateFromKeys without spend_key - view only wallet', () => {
    let keys = {
      restore_height: config.restore_height,
      filename: 'recovery_view_key',
      address: config.stagenetWalletAddressA,
      viewkey: config.stagenetWalletViewKeyA
    }
    return expect(rpcWallet.generateFromKeys(keys))
      .to.eventually.have.property('info', 'Watch-only wallet has been generated successfully.')
  })
})
