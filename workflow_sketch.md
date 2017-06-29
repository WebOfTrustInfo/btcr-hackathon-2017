## About this doc

This is my understanding of how BTCR works (with P2PKH) based on brief discussions, but I am not sure this is correct. 

I've not yet looked into the impact of bech32. Would this impact the hackathon?

Questions/issues are listed at the end.

## Creating a BTCR DID (P2PKH)

- Create Bitcoin address and private key pair (`B0`/`P0`)
    - This is just for bootstrapping the first tx
- Create Bitcoin address and private key pair (`B1`/`P1`)
- Create `DDO_1` containing supported public keys
- Sign `DDO_1` with `P1`
- Make `DDO_1` available at some URI
- Create Bitcoin transaction as follows:
	- `OP_RETURN` points to `DDO_1`
	- Output is `B1`
	- Signing key is `P0`
- Issue TX, yielsing `TXID1`

At this point we have a DID of the format: 
```
did:btcr:<txid1>
```

![](btcr.png)


## Verify/lookup keys

- Given a DID, we know txid (`did:btcr:<txid>`)
- Look up transaction. Is output spent?
    - if so, keep following transactions until an unspent output is found
- DDO address is given the `OP_RETURN` field of the transaction corresponding to unspent output


## Rotating keys

- Update `DDO_i`, sign with `Pi`
- Create new tx like above, but send dust amount to `Bi`
- Sign tx with `P(i-1)`

## Questions
- Does the sequence of operations imply that the DDO cannot be stored in a content-addressable store?
    - I thought it's the case that the DDO must contain the DID, but the DID isn't known until the transaction is created. And the transaction must contain the address of the DDO.
    - This can be worked around if the DDO isn't signed, or if the DID is not in the part of the DDO that is signed
- The DID Spec recommends that there "should" (not must) be a means for quorum recovery of a DID. We should sketch out this scenario (possible with P2SH?) or make explicit that this is not an option.
- In the hackathon should we focus on the P2PKH approach, or also a P2SH approach?
