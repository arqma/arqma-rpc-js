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

describe('RPCWallet wallet sweep dust', function () {
  const walletClient = rpcWallet.createWalletClient({
    url: config.walletAddress,
    username: config.walletUsername,
    password: config.walletPassword
  })
  walletClient.sslRejectUnauthorized(false)

  let resA = ''

  before(async function () {
    try {
      console.log('Restoring wallet A ...')
      await walletClient.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'sweep_dust', seed: config.stagenetSeedA })
      console.log('Refreshing wallet A ...')
      await walletClient.refresh()
      console.log('Sweeping Dust from wallet A ...')
      const opts = {
        get_tx_keys: true,
        do_not_relay: false,
        get_tx_hex: false,
        get_tx_metadata: false
      }
      resA = await walletClient.sweepDust(opts)
      console.log('Closing wallet A')
      await walletClient.closeWallet()
    } catch (e) {
      console.log('Error in before', e)
    }
  })
  it('sweepDust', () => {
    return expect(resA).to.have.property('multisig_txset', '')
  })
})
