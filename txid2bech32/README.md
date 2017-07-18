# TXID to Bech32 Converter

> This program has not been fully tested — no guarantees it's bug-free!
>
> In particular it needs to be tested against known transactions to make sure the bech32 that comes out is correct, but we don't have a mainnet full node with —txindex up on Debian yet. All the test vectors are for mainnet, and we are using testnet.

This C program is run as `txid2bech32 [txid]` and given a valid bitcoin transaction id (aka `txid`) will output a txref which we will be using in our DID:BTCR proposal. The program will call bitcoind via RPC, confirm that the `txid` is valid & confirmed, and retreive information about that transaction as to encode it as a `txref`.

A `txref` is Bech32 value encoded as per this BIP proposal [BIP XXXX: Bech32 Encoded Transaction Postion References](https://github.com/veleslavs/bips/blob/Bech32_Encoded_TxRef/bip-XXXX-Bech32_Encoded_Transaction_Postion_References.mediawiki) by @velesavs. The txref proposal uses this code from https://github.com/jonasschnelli/bitcoin_txref_code by @jonasschnelli, which in turn uses [Bech32](https://github.com/sipa/bech32) code from @sipa — all of the required files are included here.

To run it you must have `bitcoind` installed as a full node with `—txindex` turned on — on the bitcoin mainnet this will take up about 167GB as of today, or on the testnet 13GB. The remaining text here is in regard to using this code with a testnet node. To install testnet on a cheap linode debian linux instance (first month free, $5 a month thereafter), see [Setting Up a Bitcoin-Core VPS with StackScript](https://github.com/ChristopherA/Learning-Bitcoin-from-the-Command-Line/blob/master/02_2_Setting_Up_a_Bitcoin-Core_VPS_with_StackScript.md).

This doc also assumes that you have installed bitcoind on a Debian or Ubuntu-based linux. It requires  `libbitcoinrpc` to be setup. The instructions below on installing `libbitcoinrpc` taken from an early draft tutorial [Learning-Bitcoin-from-the-Command-Line](https://github.com/ChristopherA/Learning-Bitcoin-from-the-Command-Line/) sponsored by Blockstream, from section [12.2_Accessing Bitcoind with C](https://github.com/ChristopherA/Learning-Bitcoin-from-the-Command-Line/blob/master/12_2_Accessing_Bitcoind_with_C.md).

## Set Up libbitcoinrpc

To use `libbitcoinrpc`, you need to install a basic C setup and the dependent packages `libcurl`, `libjansson`, and `libuuid`. The following will do so on a Ubuntu system:
```
$ sudo apt-get install make gcc libcurl4-openssl-dev libjansson-dev uuid-dev
```
You can then download [libbitcoinrpc from Github](https://github.com/gitmarek/libbitcoinrpc/blob/master/README.md). Clone it or grab a zip file, as you prefer.
```
$ sudo apt-get unzip
$ unzip libbitcoinrpc-master.zip 
$ cd libbitcoinrpc-master/
```

### Compile libbitcoinrpc

Before you can compile and install the package, you'll probably need to adjust your `$PATH`, so that you can access `/sbin/ldconfig`:
```
$ PATH="/sbin:$PATH"
```
For a Ubunto system, you'll also want to adjust the `INSTALL_LIBPATH` in the `libbitcoinrpc` `Makefile` to install to `/usr/lib` instead of `/usr/local/lib`:
```
INSTALL_LIBPATH    := $(INSTALL_PREFIX)/usr/lib
```
(If you prefer not to sully your `/usr/lib`, the alternative is to change your `etc/ld.so.conf` or its dependent files appropriately ... but for a test setup on a test machine, this is probably fine.)

Then you can compile:
```
$ make
```
If that works, you can install the package:
```
$ sudo make install
```

## Compile txid2bech32

You'll first need to change the RPC user and password in the `txid2bech32.c` file to what is defined in your `bitcoin.conf`. Then…

```
$ cc -O2 txid2bech32.c txref_code.c segwit_addr.c -lbitcoinrpc -ljansson -o txid2bech32
```
Note the `-O2` argument. It is _crucially_ important. At last check, an inconsistency in `txref_code.c` caused it to produce different, incorrect results if it was not compiled optimized.

### Run txid2bech32

```
$ ./txid2bech32 f8cdaff3ebd9e862ed5885f8975489090595abe1470397f79780ead1c7528107
{
  "Txid": "f8cdaff3ebd9e862ed5885f8975489090595abe1470397f79780ead1c7528107",
  "Network": "testnet3",
  "Height": 1152194,
  "Position": 1,
  "Txref": "txtest1-xyv2-xzyq-qqm5-tyke"
}
```
