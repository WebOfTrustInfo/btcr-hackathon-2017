## About this doc

Draft, in progress

- Bi = bitcoin address i
- Pi = public key i
- Si = signing key i


## Creating a BTCR DID (P2PKH, no DDO)


- Create key set (`B0`/`P0`/`S0`)
- Create key set (`B1`/`P1`/`S1`)
- Create Bitcoin transaction as follows:
	- Output is `B1`
	- Signing key is `S0`
- Issue TX, yielding bech32 encoded txid `BECH32_TXID_0`

At this point we have a DID of the format: 
```
did:btcr:<BECH32_TXID_0>
```

![](btcr_tx.png)


## Verify/lookup keys

- Given a DID, we know txid (`did:btcr:<BECH32_TXID_0>`)
- Look up transaction. Is output spent?
    - if so, keep following transactions until an unspent output is found

## Rotating keys

- Create new tx like above, but send to `B2`
- Sign tx with `S1` (P1 is revealed)

## Questions
- If a DDO is used, how can it be stored in a content-addressable store?
    - I thought it's the case that the DDO must contain the DID, but the DID isn't known until the transaction is created. And the transaction must contain the address of the DDO.
    - This can be worked around if the DDO isn't signed, or if the DID is not in the part of the DDO that is signed
- The DID Spec recommends that there "should" (not must) be a means for quorum recovery of a DID. We should sketch out this scenario or make explicit that this is not an option.
