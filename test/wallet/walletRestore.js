'use strict'

const describe = require('mocha').describe
const it = require('mocha').it
const afterEach = require('mocha').afterEach
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const rpcWallet = require('../../lib/rpcWallet.js')

const config = require('./config')

describe('RPCWallet wallet file restore functions test', function () {
  const walletClient = rpcWallet.createWalletClient({
    url: config.walletAddress,
    username: config.walletUsername,
    password: config.walletPassword
  })
  walletClient.sslRejectUnauthorized(false)

  afterEach(async function () {
    try {
      await walletClient.closeWallet()
    } catch (e) {
      console.log('Error in afterEach', e)
    }
  })
  it('restoreDeterministicWallet with seed', () => {
    return expect(walletClient.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'deterministic', seed: config.stagenetSeedA }))
      .to.eventually.have.property('address', config.stagenetWalletAddressA)
  })
  it('generateFromKeys with spend_key', () => {
    const keys = {
      restore_height: config.restore_height,
      filename: 'recovery_spend_key',
      address: config.stagenetWalletIntegratedAddressA,
      viewkey: config.stagenetWalletViewKeyA,
      spendkey: config.stagenetWalletSpendKeyA
    }
    return expect(walletClient.generateFromKeys(keys))
      .to.eventually.have.property('address', config.stagenetWalletAddressA)
  })
  it('generateFromKeys without spend_key - view only wallet', () => {
    const keys = {
      restore_height: config.restore_height,
      filename: 'recovery_view_key',
      address: config.stagenetWalletAddressA,
      viewkey: config.stagenetWalletViewKeyA
    }
    return expect(walletClient.generateFromKeys(keys))
      .to.eventually.have.property('info', 'Watch-only wallet has been generated successfully.')
  })
})
