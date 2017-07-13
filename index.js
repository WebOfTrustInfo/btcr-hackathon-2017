var bitcoin = require('bitcoinjs-lib');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var bech32 = require('./bech32');

let MAGIC_BTC_MAINNET = 0x03;
let MAGIC_BTC_TESTNET = 0x06;

let theChain = bitcoin.networks.testnet;


let request = obj => {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();

    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) {
        resolve(request.responseText);
      } else {
        reject(request.statusText);
      }
    });
    request.addEventListener('error', () => {
      console.log(request.status);
      reject(request.status);
    });

    request.open('GET', obj.url);
    request.send();
  });
};


var txRefEncode = function (magic, blockHeight, txPos) {
  var shortId = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
  shortId[0] = magic;

  shortId[1] &= ~(1 << 0);

  shortId[1] |= ((blockHeight & 0xF) << 1);
  shortId[2] |= ((blockHeight & 0x1F0) >> 4);
  shortId[3] |= ((blockHeight & 0x3E00) >> 9);
  shortId[4] |= ((blockHeight & 0x7C000) >> 14);
  shortId[5] |= ((blockHeight & 0x180000) >> 19);

  shortId[5] |= ((txPos & 0x7) << 2);
  shortId[6] |= ((txPos & 0xF8) >> 3);
  shortId[7] |= ((txPos & 0x1F00) >> 8);


  let result = bech32.encode("tx", shortId);
  let finalResult = result.substring(0,3) + "-" +
    result.substring(3,7) + "-" +
    result.substring(7,11) + "-" +
    result.substring(11,15) + "-" +
    result.substring(15,17);
  return finalResult;
};


var txidToBech32 = function (chain, txId) {
  var theUrl;
  if (chain === bitcoin.networks.bitcoin) {
    theUrl = `https://api.blockcypher.com/v1/btc/main/txs/${txId}?limit=500`;
  } else {
    theUrl = `https://api.blockcypher.com/v1/btc/test3/txs/${txId}?limit=500`;
  }

  return request({url: theUrl})
    .then(data => {
      let txData = JSON.parse(data);
      let blockHeight = txData.block_height.toString(16);
      let txPos = parseInt(txData.block_index.toString(16));

      let magic = theChain === bitcoin.networks.bitcoin ? MAGIC_BTC_MAINNET : MAGIC_BTC_TESTNET;
      var result = txRefEncode(magic, blockHeight, txPos);
      return result
    },error => {
      console.error(error);
    });
}

function scrollBlock (theUrl, pos, txStart, currentMaxHeight, resolve) {
  request({url: theUrl + "?txstart=" + txStart +  "&limit=500"})
    .then(data => {
        let blockData = JSON.parse(data);
        let txids = blockData.txids;
        if (currentMaxHeight + txids.length < pos) {
          txStart = txids[txids.length - 1];
          currentMaxHeight += txids.length;
          scrollBlock(theUrl, pos, txStart, currentMaxHeight, resolve);
        } else {
          let posTemp = pos - currentMaxHeight;
          console.log(txids[posTemp - 1]);
          console.log(txids[posTemp]);
          result = txids[pos - currentMaxHeight];
          resolve(result);
        }
      });
}


var bech32ToTxid = function (bech32Tx) {

  let stripped = bech32Tx.replace(/-/g, '');

  let result = bech32.decode(stripped);
  let buf = result.data;

  let chainMarker = buf[0];
  let chain = chainMarker === MAGIC_BTC_MAINNET ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;

  var bStart = (buf[1] >> 1) |
    (buf[2] << 4) |
    (buf[3] << 9) |
    (buf[4] << 14);
  let b5 = ((buf[5] & 0x03) << 19);

  let height = bStart | b5;
  let pos = (buf[5] & 0x1C) >> 2;
  pos |= (buf[6] << 3);
  pos |= (buf[7] << 8);

  let block = height;
  var theUrl;
  if (chain === bitcoin.networks.bitcoin) {
    theUrl = `https://api.blockcypher.com/v1/btc/main/blocks/${block}?txstart=${pos}&limit=1`;
  } else {
    theUrl = `https://api.blockcypher.com/v1/btc/test3/blocks/${block}?txstart=${pos}&limit=1`;
  }

  return new Promise((resolve, reject) => {
    request({url: theUrl})
      .then(data => {
        let txData = JSON.parse(data);
        resolve(txData.txids[0]);
      },error => {
        console.error(error);
        reject(error);
      });
  });
}


module.exports = {
  txRefEncode: txRefEncode,
  txidToBech32: txidToBech32,
  bech32ToTxid: bech32ToTxid,
  MAGIC_BTC_MAINNET: MAGIC_BTC_MAINNET,
  MAGIC_BTC_TESTNET: MAGIC_BTC_TESTNET
};
