'use strict';

var expect = require('chai').expect;
var index = require('./index');


describe('Bech32 TX', function() {
  describe('encoding', function() {
    it('encodes a simple tx with block height 0 and pos 0', function (done) {
      let blockHeight = 0x00;
      let txPos = 0x00;
      let magic = index.MAGIC_BTC_MAINNET;
      var result = index.txRefEncode(magic, blockHeight, txPos);
      expect(result).to.equal('tx1-rqqq-qqqq-qmhu-qk');
      done();
    });

    it('encodes a simple tx with block height 0x1FFFFF and pos 0', function (done) {
      let blockHeight = 0x1FFFFF;
      let txPos = 0x00;
      let magic = index.MAGIC_BTC_MAINNET;
      var result = index.txRefEncode(magic, blockHeight, txPos);
      expect(result).to.equal("tx1-r7ll-lrqq-vq5e-gg");
      done();
    });

    it('encodes a simple tx with block height 0x71F69 and pos 0x89D', function (done) {
      let blockHeight = 0x71F69;
      let txPos = 0x89D;
      let magic = index.MAGIC_BTC_MAINNET;
      var result = index.txRefEncode(magic, blockHeight, txPos);
      expect(result).to.equal("tx1-rjk0-u5ng-4jsf-mc");
      done();
    });
  }); //https://live.blockcypher.com/btc/block/466793/2205

  describe('end-to-end', function () {
    /*
    it('fetches tx ref and encodes testnet', function (done) {
      setTimeout(function () {
        index.txidToBech32("f8cdaff3ebd9e862ed5885f8975489090595abe1470397f79780ead1c7528107", "testnet")
          .then(result => {
            expect(result).to.equal("tx1-xxyv-xxxx-fpmf-u0");
            done();
          }, error => {
            console.error(error);
            done(err);
          });
      });
    }, 5000);*/

    it('fetches tx ref and encodes mainnet', function (done) {
      setTimeout(function () {
        //467,883 / 2,355
        index.txidToBech32("016b71d9ec62709656504f1282bb81f7acf998df025e54bd68ea33129d8a425b", "mainnet")
          .then(result => {
            expect(result).to.equal("tx1-rk63-uvxf-9pqc-sy");
            done();
          }, error => {
            console.error(error);
            done(err);
          });
      });
    }, 5000);

    it('decode bech32 and retrieve txid', function (done) {
      setTimeout(function () {
        index.bech32ToTxid("tx1-rk63-uvxf-9pqc-sy")
          .then(result => {
            expect(result).to.equal("016b71d9ec62709656504f1282bb81f7acf998df025e54bd68ea33129d8a425b");
            done();
          }, error => {
            console.error(error);
            done(err);
          });
      });
    }, 5000);
  });

});
