var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var bech32 = require('./bech32');

let MAGIC_BTC_MAINNET = 0x03;
let MAGIC_BTC_TESTNET = 0x06;

let TXREF_BECH32_HRP_MAINNET = "tx";
let TXREF_BECH32_HRP_TESTNET = "txtest";

let CHAIN_MAINNET = "mainnet";
let CHAIN_TESTNET = "testnet";


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
    request.responseType = "json";
    request.send();
  });
};


var txRefEncode = function (chain, blockHeight, txPos) {
  let magic = chain === CHAIN_MAINNET ? MAGIC_BTC_MAINNET : MAGIC_BTC_TESTNET;
  let prefix = chain === CHAIN_MAINNET ? TXREF_BECH32_HRP_MAINNET : TXREF_BECH32_HRP_TESTNET;
  let nonStandard = chain != CHAIN_MAINNET;

  var shortId;
  shortId = nonStandard ? [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00] :
    [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];

  shortId[0] = magic;

  if (
    (nonStandard && (blockHeight > 0x1FFFFF || txPos > 0x1FFF || magic > 0x1F))
    ||
    (nonStandard && (blockHeight > 0x3FFFFFF || txPos > 0x3FFFF || magic > 0x1F))
  ) {
    return null;
  }

  /* set the magic */
  shortId[0] = magic;

  /* make sure the version bit is 0 */
  shortId[1] &= ~(1 << 0);

  shortId[1] |= ((blockHeight & 0xF) << 1);
  shortId[2] |= ((blockHeight & 0x1F0) >> 4);
  shortId[3] |= ((blockHeight & 0x3E00) >> 9);
  shortId[4] |= ((blockHeight & 0x7C000) >> 14);

  if (nonStandard) {
    // use extended blockheight (up to 0x3FFFFFF)
    // use extended txpos (up to 0x3FFFF)
    shortId[5] |= ((blockHeight & 0xF80000) >> 19);
    shortId[6] |= ((blockHeight & 0x3000000) >> 24);

    shortId[6] |= ((txPos & 0x7) << 2);
    shortId[7] |= ((txPos & 0xF8) >> 3);
    shortId[8] |= ((txPos & 0x1F00) >> 8);
    shortId[9] |= ((txPos & 0x3E000) >> 13);
  } else {
    shortId[5] |= ((blockHeight & 0x180000) >> 19);
    shortId[5] |= ((txPos & 0x7) << 2);
    shortId[6] |= ((txPos & 0xF8) >> 3);
    shortId[7] |= ((txPos & 0x1F00) >> 8);
  }

  let result = bech32.encode(prefix, shortId);

  let breakIndex = prefix.length + 1;
  let finalResult = result.substring(0, breakIndex) + "-" +
    result.substring(breakIndex, breakIndex + 4) + "-" +
    result.substring(breakIndex + 4, breakIndex + 8) + "-" +
    result.substring(breakIndex + 8, breakIndex + 12) + "-" +
    result.substring(breakIndex + 12, result.length);
  return finalResult;
};


var txRefDecode = function (bech32Tx) {
  let stripped = bech32Tx.replace(/-/g, '');

  let result = bech32.decode(stripped);
  let buf = result.data;


  let chainMarker = buf[0];
  let nonStandard = chainMarker != MAGIC_BTC_MAINNET;

  var bStart = (buf[1] >> 1) |
    (buf[2] << 4) |
    (buf[3] << 9) |
    (buf[4] << 14);

  var blockHeight = 0;
  var blockIndex = 0;

  if (nonStandard) {
    blockHeight = bStart | (buf[5] << 19);
    blockHeight |= ((buf[6] & 0x03) << 24);

    blockIndex = (buf[6] & 0x1C) >> 2;
    blockIndex |= (buf[7] << 3);
    blockIndex |= (buf[8] << 8);
    blockIndex |= (buf[9] << 13);
  } else {
    blockHeight = bStart | ((buf[5] & 0x03) << 19);
    blockIndex = (buf[5] & 0x1C) >> 2;
    blockIndex |= (buf[6] << 3);
    blockIndex |= (buf[7] << 8);
  }

  let chain = chainMarker === MAGIC_BTC_MAINNET ? CHAIN_MAINNET : CHAIN_TESTNET;

  return {
    "blockHeight": blockHeight,
    "blockIndex": blockIndex,
    "chain": chain
  };
}

function getTxDetails(txId, chain) {

  var theUrl;
  if (chain === CHAIN_MAINNET) {
    theUrl = `https://api.blockcypher.com/v1/btc/main/txs/${txId}?limit=500`;
  } else {
    theUrl = `https://api.blockcypher.com/v1/btc/test3/txs/${txId}?limit=500`;
  }

  return request({url: theUrl})
    .then(data => {
      let txData = JSON.parse(data);
      let blockHeight = txData.block_height;
      let blockIndex = txData.block_index;
      let inputs = txData.inputs.map((x) => {
        return {"script": x.script, "addresses": x.addresses, "outputValue": x.output_value};
      });
      let outputs = txData.outputs.map((x) => {
        if (x.value === 0) {
          return {"script": x.script, "data": x.data_string};
        }
        return {"script": x.script, "addresses": x.addresses, "outputValue": x.value};
      });
      return {
        "blockHeight": blockHeight,
        "blockIndex": blockIndex,
        "txReceived": txData.received,
        "txConfirmed": txData.confirmed,
        "numConfirmations": txData.confirmations,
        "inputs": inputs,
        "outputs": outputs,
        "chain": chain
      };
    }, error => {
      console.error(error);
    });
}


var txidToBech32 = function (txId, chain) {
  return getTxDetails(txId, chain)
    .then(data => {
      var result = txRefEncode(chain, data.blockHeight, data.blockIndex);
      return result
    }, error => {
      console.error(error);
    });
}


var bech32ToTxid = function (bech32Tx) {

  blockLocation = txRefDecode(bech32Tx);

  let blockHeight = blockLocation.blockHeight;
  let blockIndex = blockLocation.blockIndex;
  let chain = blockLocation.chain;
  var theUrl;
  if (chain === CHAIN_MAINNET) {
    theUrl = `https://api.blockcypher.com/v1/btc/main/blocks/${blockHeight}?txstart=${blockIndex}&limit=1`;
  } else {
    theUrl = `https://api.blockcypher.com/v1/btc/test3/blocks/${blockHeight}?txstart=${blockIndex}&limit=1`;
  }

  return new Promise((resolve, reject) => {
    request({url: theUrl})
      .then(data => {
        let txData = JSON.parse(data);
        resolve(txData.txids[0]);
      }, error => {
        console.error(error);
        reject(error);
      });
  });
}


module.exports = {
  txRefDecode: txRefDecode,
  txRefEncode: txRefEncode,
  txidToBech32: txidToBech32,
  bech32ToTxid: bech32ToTxid,
  getTxDetails: getTxDetails,
  MAGIC_BTC_MAINNET: MAGIC_BTC_MAINNET,
  MAGIC_BTC_TESTNET: MAGIC_BTC_TESTNET,
  TXREF_BECH32_HRP_MAINNET: TXREF_BECH32_HRP_MAINNET,
  TXREF_BECH32_HRP_TESTNET: TXREF_BECH32_HRP_TESTNET,
  CHAIN_MAINNET: CHAIN_MAINNET,
  CHAIN_TESTNET: CHAIN_TESTNET
};
/*
 getTxDetails("f8cdaff3ebd9e862ed5885f8975489090595abe1470397f79780ead1c7528107", "testnet").then( result => {
 console.log(result);
 }
 )*/