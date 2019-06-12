'use strict'

const HTTPDigest = require('../lib/httpDigest.js')

const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect

// https://tools.ietf.org/html/rfc7616
// https://www.rfc-editor.org/errata/rfc7616

describe('HTTPDigest', function () {
  describe('generateResponseHash', function () {
    it('should match 8ca523f5e9506fed4657c9700eebdbec', function () {
      let options = {
        path: '/dir/index.html',
        method: 'GET'
      }
      let wwwAuth = 'Digest qop="auth",realm="http-auth@example.org",algorithm=MD5,nonce="7ypf/xlj9XXwfDPEoM4URrv/xwf94BcCAzFZH4GiTo0v",opaque="FQhe/qaU925kfnzjCev0ciny7QMkPqMAFRtzCUYo5tdS"'

      let digest = new HTTPDigest({
        username: 'Mufasa',
        password: 'Circle of Life',
        nc: '00000001',
        cnonce: 'f2/wE4q74E6zIJEtWaHKaf5wv/H5QzzpXusqGemxURZJ'
      })

      let header = digest.handleResponse(options, wwwAuth)
      let pos = header.search('response="') + 10

      expect(header.substring(pos, pos + 32)).to.be.equal('8ca523f5e9506fed4657c9700eebdbec')
    })
  })
  describe('incNonce', function () {
    it('should increment nonce by 1', function () {
      let digest = new HTTPDigest({
        username: 'Mufasa',
        password: 'Circle of Life',
        nc: '00000001',
        cnonce: 'f2/wE4q74E6zIJEtWaHKaf5wv/H5QzzpXusqGemxURZJ'
      })
      digest.incNonce()
      expect(digest.nc).to.be.equal('00000002')
    })
  })
  describe('Test incNonce as hexadecimal?', function () {
    it('should increment nonce to 0000000a', function () {
      let digest = new HTTPDigest({
        username: 'Mufasa',
        password: 'Circle of Life',
        nc: '00000009',
        cnonce: 'f2/wE4q74E6zIJEtWaHKaf5wv/H5QzzpXusqGemxURZJ'
      })
      digest.incNonce()
      expect(digest.nc).to.be.equal('0000000a')
    })
  })
  describe('Limit incNonce', function () {
    it('should increment nonce to 00000001', function () {
      let digest = new HTTPDigest({
        username: 'Mufasa',
        password: 'Circle of Life',
        nc: 'ffffffff',
        cnonce: 'f2/wE4q74E6zIJEtWaHKaf5wv/H5QzzpXusqGemxURZJ'
      })
      digest.incNonce()
      expect(digest.nc).to.be.equal('00000001')
    })
  })
})
