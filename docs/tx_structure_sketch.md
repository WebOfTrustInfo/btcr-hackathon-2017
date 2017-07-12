## About this doc

Note: Draft, in progress. Not reviewed, so it may be incorrect.

## Abbreviations

- Bi = bitcoin address i
- Pi = public key i
- Si = signing key i


## Creating a BTCR DID (P2PKH, no DDO)


- Create key set (`B0`/`P0`/`S0`)
- Create key set (`B1`/`P1`/`S1`)
- Create Bitcoin transaction as follows:
	- Output is `B1`
	- Signing key is `S0`
- Issue TX0 and wait for confirmation. Get bech32 encoding of the transaction `BECH32(TX0)`

At this point we have a DID of the format: 
```
did:btcr:<BECH32(TX0)>
```

![](btcr.png)


## Verify/lookup keys

- Given a DID, we know txid (`did:btcr:<BECH32(TX0)>`)
- Look up transaction. Is output spent?
    - if so, keep following transaction chain until an unspent output is found

## Rotating keys

- Create new tx like above, but send to `B2`
- Sign tx with `S1` (P1 is revealed)


