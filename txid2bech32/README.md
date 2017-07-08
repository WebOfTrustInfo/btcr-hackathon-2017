# TXID to Bech32 Converter

This program is run as `txid2bech32 [txid]` and will output the Bech32. It uses this [Bech 32 code](https://github.com/jonasschnelli/bitcoin_txref_code), which is already included here.

To run it you must have `libbitcoinrpc` setup. These instructions are taken from the [Blockstream Bitcoin doc](https://github.com/ChristopherA/Learning-Bitcoin-from-the-Command-Line/blob/master/12_2_Accessing_Bitcoind_with_C.md).

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
```
$ cc txid2bech32.c txref_code.c segwit_addr.c -lbitcoinrpc -ljansson -o txid2bech32
```

### Run txid2bech32

```
$ ./txid2bech32 145035db5b738b492198835bb813aeab58eb00891988f9bf73edde8fa1a2f05f
tx1-xx2j-xzxz-ygry-j9
```
