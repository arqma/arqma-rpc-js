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

describe('RPCWallet wallet sweep all', function () {
  const walletClient = rpcWallet.createWalletClient({
    url: config.walletAddress,
    username: config.walletUsername,
    password: config.walletPassword
  })
  walletClient.sslRejectUnauthorized(false)

  let resA = ''
  let resB = ''

  const trn = {
    address: config.stagenetWalletAddressA,
    account_index: 0,
    subaddr_indices: [0],
    priority: 1,
    mixin: 11,
    ring_size: 12,
    unlock_time: 0,
    payment_id: config.payment_id,
    get_tx_keys: true,
    do_not_relay: false,
    get_tx_hex: false,
    get_tx_metadata: false
  }
  before(async function () {
    try {
      console.log('Restoring wallet A ...')
      await walletClient.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'sweep_all_A', seed: config.stagenetSeedA })
      console.log('Refreshing wallet A ...')
      await walletClient.refresh()
      console.log('Sweeping All in wallet A ...')
      resA = await walletClient.sweepAll(trn)
      console.log('Closing wallet A')
      await walletClient.closeWallet()
      console.log('Restoring wallet B ...')
      await walletClient.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'sweep_all_B', seed: config.stagenetSeedB })
      console.log('Refreshing wallet B ...')
      await walletClient.refresh()
      console.log('Sweeping All in wallet B ...')
      trn.address = config.stagenetWalletAddressB
      resB = await walletClient.sweepAll(trn)
      console.log('Closing wallet B')
      await walletClient.closeWallet()
    } catch (e) {
      console.log('Error in before', e)
    }
  })
  it('sweepAll wallet A', () => {
    return expect(resA)
      .to.have.property('amount_list')
  })
  it('sweepAll wallet B', () => {
    return expect(resB)
      .to.have.property('amount_list')
  })
})
