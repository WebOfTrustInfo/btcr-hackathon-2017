'use strict';

let expect = require('chai').expect;
let txrefConverter = require('./txrefConverter');


describe('Bech32 TX', function () {
  describe('encoding', function () {
    it('encodes a tx with block height 0 and pos 0', function (done) {
      let blockHeight = 0;
      let txPos = 0;
      let result = txrefConverter.txRefEncode(txrefConverter.CHAIN_MAINNET, blockHeight, txPos);
      expect(result).to.equal('tx1-rqqq-qqqq-qmhu-qk');
      done();
    });

    it('encodes a tx with block height 1 and pos 0', function (done) {
      let blockHeight = 1;
      let txPos = 0;
      let result = txrefConverter.txRefEncode(txrefConverter.CHAIN_MAINNET, blockHeight, txPos);
      expect(result).to.equal('tx1-rzqq-qqqq-uvlj-ez');
      done();
    });

    it('encodes a tx with block height 2097151 and pos 1000', function (done) {
      let blockHeight = 2097151;
      let txPos = 1000;
      let result = txrefConverter.txRefEncode(txrefConverter.CHAIN_MAINNET, blockHeight, txPos);
      expect(result).to.equal('tx1-r7ll-lrar-a27h-kt');
      done();
    });

    it('encodes a tx with block height 2097151 and pos 8191', function (done) {
      let blockHeight = 2097151;
      let txPos = 8191;
      let result = txrefConverter.txRefEncode(txrefConverter.CHAIN_MAINNET, blockHeight, txPos);
      expect(result).to.equal('tx1-r7ll-llll-khym-tq');
      done();
    });

    it('encodes a tx with block height 2097151 and pos 0', function (done) {
      let blockHeight = 2097151;
      let txPos = 0;
      let result = txrefConverter.txRefEncode(txrefConverter.CHAIN_MAINNET, blockHeight, txPos);
      expect(result).to.equal('tx1-r7ll-lrqq-vq5e-gg');
      done();
    });

    it('encodes a tx with block height 0 and pos 8191', function (done) {
      let blockHeight = 0;
      let txPos = 8191;
      let result = txrefConverter.txRefEncode(txrefConverter.CHAIN_MAINNET, blockHeight, txPos);
      expect(result).to.equal('tx1-rqqq-qull-6v87-r7');
      done();
    });

    it('encodes a tx with block height 467883 and pos 2355', function (done) {
      let blockHeight = 467883;
      let txPos = 2355;
      let result = txrefConverter.txRefEncode(txrefConverter.CHAIN_MAINNET, blockHeight, txPos);
      expect(result).to.equal('tx1-rk63-uvxf-9pqc-sy');
      done();
    });

    it('encodes a tx with block height 0x1FFFFF and pos 0', function (done) {
      let blockHeight = 0x1FFFFF;
      let txPos = 0x00;
      let result = txrefConverter.txRefEncode(txrefConverter.CHAIN_MAINNET, blockHeight, txPos);
      expect(result).to.equal("tx1-r7ll-lrqq-vq5e-gg");
      done();
    });

    it('encodes a tx with block height 0x71F69 and pos 0x89D', function (done) {
      let blockHeight = 0x71F69;
      let txPos = 0x89D;
      let result = txrefConverter.txRefEncode(txrefConverter.CHAIN_MAINNET, blockHeight, txPos);
      expect(result).to.equal("tx1-rjk0-u5ng-4jsf-mc");
      done();
    });

    it('encodes a tx with block height 466793 and pos 2205', function (done) {
      let blockHeight = 466793;
      let txPos = 2205;
      let result = txrefConverter.txRefEncode(txrefConverter.CHAIN_MAINNET, blockHeight, txPos);
      expect(result).to.equal("tx1-rjk0-u5ng-4jsf-mc");
      done();
    });

    it('encodes a testnet tx with block height 467883 and pos 2355', function (done) {
      let blockHeight = 467883;
      let txPos = 2355;
      let result = txrefConverter.txRefEncode(txrefConverter.CHAIN_TESTNET, blockHeight, txPos);
      expect(result).to.equal("txtest1-xk63-uqvx-fqx8-xqr8");
      done();
    });

    it('encodes a testnet tx with block height 0 and pos 0', function (done) {
      let blockHeight = 0;
      let txPos = 0;
      let result = txrefConverter.txRefEncode(txrefConverter.CHAIN_TESTNET, blockHeight, txPos);
      expect(result).to.equal("txtest1-xqqq-qqqq-qqkn-3gh9");
      done();
    });

    it('encodes a testnet tx with block height 1152194 and pos 1', function (done) {
      let blockHeight = 1152194;
      let txPos = 1;
      let result = txrefConverter.txRefEncode(txrefConverter.CHAIN_TESTNET, blockHeight, txPos);
      expect(result).to.equal("txtest1-xyv2-xzyq-qqm5-tyke");
      done();
    });
    //  txid: f8cdaff3ebd9e862ed5885f8975489090595abe1470397f79780ead1c7528107
  });

  describe('decode', function () {
    it('decodes a tx with block height 0 and pos 0', function (done) {
      let blockHeight = 0;
      let txPos = 0;
      let result = txrefConverter.txRefEncode(txrefConverter.CHAIN_MAINNET, blockHeight, txPos);
      expect(result).to.equal('tx1-rqqq-qqqq-qmhu-qk');
      done();
    });

    it('decodes tx ref tx1-rzqq-qqqq-uvlj-ez', function (done) {
      let blockHeight = 1;
      let txPos = 0;

      let result = txrefConverter.txRefDecode('tx1-rzqq-qqqq-uvlj-ez');
      expect(result.blockHeight).to.equal(blockHeight);
      expect(result.blockIndex).to.equal(txPos);
      expect(result.chain).to.equal(txrefConverter.CHAIN_MAINNET);
      done();
    });

    it('decodes tx ref tx1-r7ll-lrar-a27h-kt', function (done) {
      let blockHeight = 2097151;
      let txPos = 1000;

      let result = txrefConverter.txRefDecode('tx1-r7ll-lrar-a27h-kt');
      expect(result.blockHeight).to.equal(blockHeight);
      expect(result.blockIndex).to.equal(txPos);
      expect(result.chain).to.equal(txrefConverter.CHAIN_MAINNET);
      done();
    });

    it('decodes tx ref tx1-r7ll-llll-khym-tq', function (done) {
      let blockHeight = 2097151;
      let txPos = 8191;

      let result = txrefConverter.txRefDecode('tx1-r7ll-llll-khym-tq');
      expect(result.blockHeight).to.equal(blockHeight);
      expect(result.blockIndex).to.equal(txPos);
      expect(result.chain).to.equal(txrefConverter.CHAIN_MAINNET);
      done();
    });

    it('decodes txref tx1-r7ll-lrqq-vq5e-gg', function (done) {
      let blockHeight = 2097151;
      let txPos = 0;

      let result = txrefConverter.txRefDecode('tx1-r7ll-lrqq-vq5e-gg');
      expect(result.blockHeight).to.equal(blockHeight);
      expect(result.blockIndex).to.equal(txPos);
      expect(result.chain).to.equal(txrefConverter.CHAIN_MAINNET);

      done();
    });

    it('decodes tx ref tx1-rqqq-qull-6v87-r7', function (done) {
      let blockHeight = 0;
      let txPos = 8191;

      let result = txrefConverter.txRefDecode('tx1-rqqq-qull-6v87-r7');
      expect(result.blockHeight).to.equal(blockHeight);
      expect(result.blockIndex).to.equal(txPos);
      expect(result.chain).to.equal(txrefConverter.CHAIN_MAINNET);
      done();
    });

    it('decodes tx ref tx1-rk63-uvxf-9pqc-sy', function (done) {
      let blockHeight = 467883;
      let txPos = 2355;
      let result = txrefConverter.txRefDecode('tx1-rk63-uvxf-9pqc-sy');
      expect(result.blockHeight).to.equal(blockHeight);
      expect(result.blockIndex).to.equal(txPos);
      expect(result.chain).to.equal(txrefConverter.CHAIN_MAINNET);
      done();
    });

    it('decodes tx ref tx1-r7ll-lrqq-vq5e-gg', function (done) {
      let blockHeight = 0x1FFFFF;
      let txPos = 0x00;

      let result = txrefConverter.txRefDecode('tx1-r7ll-lrqq-vq5e-gg');
      expect(result.blockHeight).to.equal(blockHeight);
      expect(result.blockIndex).to.equal(txPos);
      expect(result.chain).to.equal(txrefConverter.CHAIN_MAINNET);
      done();
    });

    it('decodes tx ref tx1-rjk0-u5ng-4jsf-mc', function (done) {
      let blockHeight = 0x71F69;
      let txPos = 0x89D;

      let result = txrefConverter.txRefDecode('tx1-rjk0-u5ng-4jsf-mc');
      expect(result.blockHeight).to.equal(blockHeight);
      expect(result.blockIndex).to.equal(txPos);
      expect(result.chain).to.equal(txrefConverter.CHAIN_MAINNET);
      done();
    });

    it('decodes tx ref', function (done) {
      let blockHeight = 466793;
      let txPos = 2205;

      let result = txrefConverter.txRefDecode('tx1-rjk0-u5ng-4jsf-mc');
      expect(result.blockHeight).to.equal(blockHeight);
      expect(result.blockIndex).to.equal(txPos);
      expect(result.chain).to.equal(txrefConverter.CHAIN_MAINNET);
      done();
    });

    it('decodes tx ref txtest1-xk63-uqvx-fqx8-xqr8', function (done) {
      let blockHeight = 467883;
      let txPos = 2355;

      let result = txrefConverter.txRefDecode('txtest1-xk63-uqvx-fqx8-xqr8');
      expect(result.blockHeight).to.equal(blockHeight);
      expect(result.blockIndex).to.equal(txPos);
      expect(result.chain).to.equal(txrefConverter.CHAIN_TESTNET);
      done();
    });

    it('decodes tx ref txtest1-xqqq-qqqq-qqkn-3gh9', function (done) {
      let blockHeight = 0;
      let txPos = 0;

      let result = txrefConverter.txRefDecode('txtest1-xqqq-qqqq-qqkn-3gh9');
      expect(result.blockHeight).to.equal(blockHeight);
      expect(result.blockIndex).to.equal(txPos);
      expect(result.chain).to.equal(txrefConverter.CHAIN_TESTNET);
      done();
    });

    it('decodes tx ref txtest1-xyv2-xzyq-qqm5-tyke', function (done) {
      let blockHeight = 1152194;
      let txPos = 1;

      let result = txrefConverter.txRefDecode('txtest1-xyv2-xzyq-qqm5-tyke');
      expect(result.blockHeight).to.equal(blockHeight);
      expect(result.blockIndex).to.equal(txPos);
      expect(result.chain).to.equal(txrefConverter.CHAIN_TESTNET);
      done();
    });
    //  txid: f8cdaff3ebd9e862ed5885f8975489090595abe1470397f79780ead1c7528107
  });

  describe('end-to-end', function () {

    it('bech32 encode txid (testnet)', function (done) {
      setTimeout(function () {
        txrefConverter.txidToBech32("f8cdaff3ebd9e862ed5885f8975489090595abe1470397f79780ead1c7528107", "testnet")
          .then(result => {
            expect(result).to.equal("txtest1-xyv2-xzyq-qqm5-tyke");
            done();
          }, error => {
            console.error(error);
            done(err);
          });
      });
    }, 5000);

    it('bech32 encode txid (mainnet)', function (done) {
      setTimeout(function () {
        txrefConverter.txidToBech32("016b71d9ec62709656504f1282bb81f7acf998df025e54bd68ea33129d8a425b", "mainnet")
          .then(result => {
            expect(result).to.equal("tx1-rk63-uvxf-9pqc-sy");
            done();
          }, error => {
            console.error(error);
            done(err);
          });
      });
    }, 5000);

    it('bech32 decode txid (testnet)', function (done) {
      setTimeout(function () {
        txrefConverter.bech32ToTxid("txtest1-xyv2-xzyq-qqm5-tyke")
          .then(result => {
            expect(result).to.equal("f8cdaff3ebd9e862ed5885f8975489090595abe1470397f79780ead1c7528107");
            done();
          }, error => {
            console.error(error);
            done(err);
          });
      });
    }, 5000);

    it('bech32 decode txid (mainnet)', function (done) {
      setTimeout(function () {
        txrefConverter.bech32ToTxid("tx1-rk63-uvxf-9pqc-sy")
          .then(result => {
            expect(result).to.equal("016b71d9ec62709656504f1282bb81f7acf998df025e54bd68ea33129d8a425b");
            done();
          }, error => {
            console.error(error);
            done(err);
          });
      });
    }, 5000);

  })

});
