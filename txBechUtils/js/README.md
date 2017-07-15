# Bitcoin Bech32 TX Ref javascript library

## About

Javascript library for Bech32 Encoded TX References, ported from Jonas Schnelli's [reference implementation](https://github.com/jonasschnelli/bitcoin_txref_code) for the BTCR Hackathon. It uses Peter Wuille's [Bech32 library](https://github.com/sipa/bech32) for Bech32 encoding and decoding.

See the current draft of the [Bech32 Encoded Transaction Position References](https://github.com/veleslavs/bips/blob/c83837536d6629f754ce5a88bbe245e0a615e76e/bip-XXXX-Bech32_Encoded_Transaction_Position_References.mediawiki) BIP. 

This implementation works as follows:

- Encoding: 
  - Given a txid and chain (testnet/mainnet), fetch the block height and position from a blockchain explorer
  - Convert to a short id as shown in [btc_txref_encode](https://github.com/jonasschnelli/bitcoin_txref_code/blob/master/ref/c/txref_code.c)
  - Encodes with the [javascript Bech32 library](https://github.com/sipa/bech32)

- Decoding: 
  - Decodes the bech32-encoded tx ref [javascript Bech32 library](https://github.com/sipa/bech32)
  - Extracts the block height and position as shown in [btc_txref_decode](https://github.com/jonasschnelli/bitcoin_txref_code/blob/master/ref/c/txref_code.c)
  - Find the txid corresponding to the blockheight and position from a blockchain explorer

This library is for prototype use only. Some future improvements would include:
- Checking confirmation count from the API results; warn if less than 6 (or some other threshold).
- Compare results from multiple blockchain explorer APIs
- Flexible accessor if a local bitcoin node is available.
- Robust error checking

You can use this as a node package or in a browser. The browserified script is available as `btcr_converter.js`.

## Examples

In these examples, note the following:
- Prefixes: mainnet tx refs start with the `tx1` prefix, whereas testnet tx refs start with "txtest1"
- Length: ignoring the prefixes, testnet refs are 2 characters longer than mainnet

### Encoding a TXID as Bech32-encoded TX ref

```
let txrefConverter = require('./txrefConverter');

txrefConverter.txidToBech32("016b71d9ec62709656504f1282bb81f7acf998df025e54bd68ea33129d8a425b", 
    txrefConverter.CHAIN_MAINNET)
  .then(result => {
    console.log(result); // expect "tx1-rk63-uvxf-9pqc-sy"
  });
  
```

### From a Bech32-encoded TX ref, locate the TXID

```
let txrefConverter = require('./txrefConverter');

txrefConverter.bech32ToTxid("txtest1-xyv2-xzyq-qqm5-tyke")
  .then(result => {
    console.log(result); // expect "f8cdaff3ebd9e862ed5885f8975489090595abe1470397f79780ead1c7528107"
  });

```

### Finer grained functions 

#### Given the chain, block height and position, encode as a Bech32 TX ref

Mainnet:

```
let txrefConverter = require('./txrefConverter');

let result = txrefConverter.txRefDecode('tx1-rzqq-qqqq-uvlj-ez');
console.log(result.blockHeight); // expect 1
console.log(result.blockIndex);  // expect 0
console.log(result.chain);       // expect "mainnet"

```

Testnet:

```
let txrefConverter = require('./txrefConverter');

let result = txrefConverter.txRefEncode("testnet", 1152194, 1);
console.log(result); // expect "txtest1-xyv2-xzyq-qqm5-tyke"
```

#### Given Bech32 TX ref, extract the chain, block height and position

```
let txrefConverter = require('./txrefConverter');

let result = txrefConverter.txRefEncode("mainnet", 0, 0);
console.log(result); // expect "tx1-rqqq-qqqq-qmhu-qk"
```

#### Get transaction details

Given a txid and chain, lookup the transaction details:

```
let txrefConverter = require('./txrefConverter');

getTxDetails("f8cdaff3ebd9e862ed5885f8975489090595abe1470397f79780ead1c7528107", "testnet")
    .then(data => {
      console.log(data.numConfirmations); // and other transaction data obtained from the explorer
      var result = txRefEncode(chain, data.blockHeight, data.blockIndex);
      return result
    }, error => {
      console.error(error);
    });

```

## Install

```
npm install

```
## Using in a browser

`npm run build` generates the browserified script `btcr_converter.js`, which you can include in your web project.

The following shows how you can use it: 

```
<script src="./btcr_converter.js"></script>

BtcrUtils.txidToBech32(txid, chain)
  .then(function (result, err) {
      // populate widget with result
});
```

See the BTCR playground code repository [btcr-tx-playground](https://github.com/WebOfTrustInfo/btcr-tx-playground.github.io) for working code samples. 

You can also experiment with this library in the [BTCR TX Playground](https://weboftrustinfo.github.io/btcr-tx-playground.github.io/)

## Running tests

```
npm run test
```