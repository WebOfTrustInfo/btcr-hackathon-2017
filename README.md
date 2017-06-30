# btcr-hackathon

## Copyright & License

All content in this repository is copyright by the contributors.

All text is licensed CC-BY, and all code is licensed under the MIT License.

Contributors: Christopher Allen \<@ChristopherA\>, Kim (Hamilton) Duffy \<@kimdhamilton\>

## The Virtual Hackathon July 10th - July 16th 2017

We are having a virtual hackathon starting the week of July 10th to complete a draft specification for BTCR and some initial reference implementations.

We will be using issues in this repository, and the WebOfTrustInfo slack. Christopher Allen \<@ChristopherA\> \<mailto:ChristopherA@LifeWithAlacrity.com\> for more information.

## Concept

Think of Decentralized Identifiers (DIDs) as personal trust anchors. Anyone can propose a DID method — ideally they leverage the power of blockchains, but a blockchain is not required. There are DID methods being proposed for public blockchains (Bitcoin, Blockstack, Ethereum), private blockchains (Sovrin/Indy), non-blockchain (IPFS), and even legacy web-of-trust identity systems (PGP).

The Bitcoin Reference method of DIDs (the DID:BTCR) supports DIDs largely using the public bitcoin blockchain, all we want to see placed on the blockchain is the DID trust anchor & any updates to it, and some rooted merkle trees for proof of existence. No other Personal Identifiable Information (PII) would be placed on the immutable blockchain.

Version one of the BTCR method looks like DID:BTCR:TX1-RJK0-U5NG-4JSF-MC. The number at the end is a bech32 encoded number that supports both error detection & correction, and works efficiently with QR codes. This number basically refers to the 2205th confirmed transaction of block 466793 on the main bitcoin blockchain. A different TX prefix could refer to a testnet DID or even a Lightcoin-based DID.

The published public key in that confirmed "Pay to Public Key Hash" transaction (aka P2PKH, or post-segwit a P2WKH). This public key is the initial "control" key for that DID, i.e. it allows the private key holder to prove that they "control" the public key, and is used to sign verifiable claims and other data objects "controlled" by the private key holder.

This control key is only valid as long as the address in the first txout is unspent (aka the DID "tip"). This address is not a public key — in the case of P2PKH it is the hash of a new public key that is not yet revealed. This unrevealed public key is known as the "owner" key. Spending funds on the "tip" requires the owner of the DID reveal their owner key, which revokes the old control key, and if they choose, can publish a new control and/or owner keys.

A BTCR transaction does not require a DID Descriptor Object (DDO) -- by default it is constructed from information that can be determined by the transaction data itself and block that it was confirmed on. However, optionally the DID holder can also publish a txout in the form of a 40 or 80 character op_return, which can point to the DDO that is signed by the same key as the public key used to sign the transaction. This DDO can describe additional keys or services that the DID holder wishes to authorize to act on the DID holder's behalf. This pointer can be to a URL, a content addressable hash (for instance a persistent IPFS object), or point to a layer 2 service that provides this information (for instance Blockstack).

A secondary intent of the BTCR method is to serve as a very conservative, very secure example and some best practices for creating a DID method. The use cases for BTCR are focused on anonymous and pseudo-anonymous identities, web-of-trust style webs of identity, and absolute mimimal personal information disclosure. Other DID methods will likely need to loosen these standards.

Some aspects of the BTCR method will not be practical if inappropriately scaled — for instance, there is a transaction cost to update keys and DDO object, potential UTXO inflation (i.e. one additional unspent output for every BTCR-based identity), and even if segwit isn't used it could cause blockchain bloat. However, identities using the BTCR method can be a strong as Bitcoin itself -- currently securing billions of dollars of digital value.

## References
- [DID Method Specifications / BTCR and PGPR](https://github.com/WebOfTrustInfo/rebooting-the-web-of-trust-spring2017/blob/master/event-documents/group-abstracts/btcr-did-method-spec.md)
- [DID Spec](https://github.com/WebOfTrustInfo/rebooting-the-web-of-trust-fall2016/blob/master/draft-documents/DID-Spec-Implementers-Draft-01.pdf)
- Bech32
    - https://lists.linuxfoundation.org/pipermail/bitcoin-dev/2017-May/014396.html
    - https://github.com/veleslavs/bips/blob/Bech32_Encoded_TxRef/bip-XXXX-Bech32_Encoded_Transaction_Postion_References.mediawiki
