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

describe('RPCWallet wallet relay transaction', function () {
  const walletClient = rpcWallet.createWalletClient({
    url: config.walletAddress,
    username: config.walletUsername,
    password: config.walletPassword
  })
  walletClient.sslRejectUnauthorized(false)

  let txMetadata = ''
  let txHash = ''

  before(async function () {
    try {
      await walletClient.restoreDeterministicWallet({ restore_height: config.restore_height, filename: 'relay', seed: config.stagenetSeedA })
      console.log('Refreshing wallet ...')
      await walletClient.refresh()
      const trn = {
        destinations: [{ amount: 2000000000, address: config.stagenetWalletAddressB }],
        priority: 2,
        mixin: 21,
        ring_size: 22,
        unlock_time: 0,
        payment_id: config.payment_id,
        do_not_relay: true,
        get_tx_metadata: true
      }
      console.log('Preparing transfer ...')
      const res = await walletClient.transfer(trn)
      txMetadata = res.tx_metadata
      txHash = res.tx_hash
    } catch (e) {
      console.log('Error in before', e)
    }
  })
  after(async function () {
    try {
      console.log('Closing wallet ...')
      await walletClient.closeWallet()
    } catch (e) {
      console.log('Error in after', e)
    }
  })
  it('relayTx', () => {
    return expect(walletClient.relayTx({ hex: txMetadata }))
      .to.eventually.have.property('tx_hash', txHash)
  })
})
