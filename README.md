# btcr-hackathon

## Copyright & License

All content in this repository is copyright by the contributors.

All text is licensed CC-BY, and all code is licensed under the MIT License.

Contributors: Christopher Allen \<@ChristopherA\>, Kim (Hamilton) Duffy \<@kimdhamilton\>, Shannon Appelcline \<@shannona\>

## The Virtual Hackathon July 10th - July 16th 2017

We are having a virtual hackathon starting the week of July 10th to complete a draft specification for BTCR and some initial reference implementations.

We will be using  [Issues](https://github.com/WebOfTrustInfo/btcr-hackathon/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) in this repository and the [WebOfTrustInfo slack](http://weboftrustinfo.slack.com). Copntact Christopher Allen \<@ChristopherA\> \<mailto:ChristopherA@LifeWithAlacrity.com\> for more information.

## \#RebootingWebOfTrust Design Shop in Boston October 3rd-5th

This virtual hackathon is to help prepare us for our face-to-face #RebootingWebOfTrust  Design Shop in Boston on October 3rd - 5th. Don't forget  to [register]() before the early-bird pricing expires! Discounts are available for those who actively participate in this hackathon, or who submit topic papers to our repo before the event. Diversity scholarships are also available (though we would like sponsors so we can offer more!)

## User Story

Why are we #RebootingWebOfTrust? Here is a user story about a female programmer that is a daughter of immigrants who has a family members that are refugees. Can we give her the tools she needs? 

- [\#RebootingWebOfTrust User Story](./RWOT-User-Story.md) 

## Initial Concept

(*Note that the concept below is very preliminary. There are many legitimate [Issues](https://github.com/WebOfTrustInfo/btcr-hackathon/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc) being discussed. This concept is shared only to help start the conversion!*)

Think of Decentralized Identifiers (DIDs) as personal trust anchors. Anyone can propose a DID method — ideally they leverage the power of blockchains, but a blockchain is not required. There are DID methods being proposed for public blockchains (Bitcoin, Blockstack, Ethereum), private blockchains (Sovrin/Indy), non-blockchain (IPFS), and even legacy web-of-trust identity systems (PGP).

The Bitcoin Reference method of DIDs (the DID:BTCR) supports DIDs largely using the public bitcoin blockchain, all we want to see placed on the blockchain is the DID trust anchor & any updates to it, and some rooted merkle trees for proof of existence. No other Personal Identifiable Information (PII) would be placed on the immutable blockchain.

Version one of the BTCR method looks like DID:BTCR:TX1-RJK0-U5NG-4JSF-MC. The number at the end is a bech32 encoded number that supports both error detection & correction, and works efficiently with QR codes. This number basically refers to the 2205th confirmed transaction of block 466793 on the main bitcoin blockchain. A different TX prefix could refer to a testnet DID or even a Lightcoin-based DID.

The published public key in that confirmed "Pay to Public Key Hash" transaction (aka P2PKH, or post-segwit a P2WKH). This public key is the initial "owner" key for that DID, i.e. it allows the private key holder to prove that they "own" the public key, and is used to sign verifiable claims and other data objects "owned" by the private key holder.

This owner key is only valid as long as the address in the first txout is unspent (aka the DID "tip"). This address is not a public key — in the case of P2PKH it is the hash of a new public key that is not yet revealed. This unrevealed public key is known as the "control" key. Spending funds on the "tip" requires the controller of the DID reveal their control key, which revokes the old owner key, and if they choose, can publish a new control and/or owner keys.

A BTCR transaction does not require a DID Descriptor Object (DDO) -- by default it is constructed from information that can be determined by the transaction data itself and block that it was confirmed on. However, optionally the DID holder can also publish a txout in the form of a 40 or 80 character op_return, which can point to the DDO that is signed by the same key as the public key used to sign the transaction. This DDO can describe additional keys or services that the DID holder wishes to authorize to act on the DID holder's behalf. This pointer can be to a URL, a content addressable hash (for instance a persistent IPFS object), or point to a layer 2 service that provides this information (for instance Blockstack).

A secondary intent of the BTCR method is to serve as a very conservative, very secure example and some best practices for creating a DID method. The use cases for BTCR are focused on anonymous and pseudo-anonymous identities, web-of-trust style webs of identity, and absolute mimimal personal information disclosure. Other DID methods will likely need to loosen these standards.

Some aspects of the BTCR method will not be practical if inappropriately scaled — for instance, there is a transaction cost to update keys and DDO object, potential UTXO inflation (i.e. one additional unspent output for every BTCR-based identity), and even if segwit isn't used it could cause blockchain bloat. However, identities using the BTCR method can be a strong as Bitcoin itself -- currently securing billions of dollars of digital value.

## Results

### Insights on DID spec

[Original version of this section by @christophera](https://lists.w3.org/Archives/Public/public-credentials/2017Jul/0018.html). Minor updates/revisions by @kimdhamilton

At last fall's #RebootingWebOfTrust after working on it for about a year, wecame up with an initial first implementors spec for DIDs. It was published last winter at https://github.com/WebOfTrustInfo/rebooting-the-web-of-trust-fall2016/blob/master/final-documents/did-implementer-draft-10.pdf. Two weeks ago, Manu team refactored that document for us to consider in the W3C Credentials WG as a work item: https://opencreds.github.io/did-spec/  

This week we attempted to implement the DID spec for use in the bitcoin based BTCR method as part of the BTCR Hackathon: https://github.com/WebOfTrustInfo/btcr-hackathon

The good news is that we have a number of functioning verifiable and confirmable self-sovereign DID identifiers, a number of real examples of verifiable DDOs, as well as some sample Verified Claims properly signed by bitcoin keys that can be proven to be issued by the DDO which can prove that it has exclusive update rights to the DID identifer. All good news.

However, we ran into a number of issues with the first implementors draft of the DID spec.

I’ve written up some initial insights and thoughts [https://github.com/opencreds/did-spec/issues/4#issuecomment-315449659](https://github.com/opencreds/did-spec/issues/4#issuecomment-315449659) of what we learned about the DID spec. The hackathon team created individual issues (listed in "What's next" below), and here is the summary:


Personally I think owner and control need to be completely refactored and renamed. Both terms are repeatedly not working and are being confused. (In addition, a number of parts of the spec maybe should be moved the the Sovrin Method instead of being in the DID spec.)

Insights:

- We should rarely talk about keys, but instead proofs, of which a signature using a key is only one kind of proof (but very common). See: [WebOfTrustInfo/btcr-hackathon#39](https://github.com/WebOfTrustInfo/btcr-hackathon/issues/39)
- The DDO object may in fact be composed of multiple parts, with different parts having different proofs. See: [WebOfTrustInfo/btcr-hackathon#37](https://github.com/WebOfTrustInfo/btcr-hackathon/issues/37)
- The first part of the DDO may be deterministic based on the root of trust transaction (and in BTCR is in effect "signed" or "proven" by the "SatoshiBlockchainSignature" or "SatoshiBlockchainProof". See example at [WebOfTrustInfo/btcr-hackathon#37(comment)](https://github.com/WebOfTrustInfo/btcr-hackathon/issues/37#issuecomment-315289776)
- We may even want to go back to all the JSON-LD signature schemas and replace the semantics consistent as proofs rather than signatures.
- If there is a link from the deterministic DDO to the extended DDO (in BTCR the OP_RETURN pointer), we maybe should allow that to continue to be extended (especially useful the IPFS case). We need a better name for these links. See [WebOfTrustInfo/btcr-hackathon#40](https://github.com/WebOfTrustInfo/btcr-hackathon/issues/40)
- Additional parts must be proven by the owner proof (typically a key) and likely in effect are self-signed verifiable claims that extend the deterministic DDO: see [WebOfTrustInfo/btcr-hackathon#8](https://github.com/WebOfTrustInfo/btcr-hackathon/issues/8)
   — This is particular important in some cases like IPFS and some future multisig possibilities where you can't put the DID identifier or proof into the DDO as you have to confirm the transaction in order to get that value — a catch 22. Instead, the IPFS record extends the deterministic DDO with additional values, and doesn't have to have the DID identifier or DID proof as they come from the deterministically created root part of the DDO.
- The owner list is overloaded. It should only be for associating any additional DDO parts or updates with the the DID root of trust transaction. See: [WebOfTrustInfo/btcr-hackathon#38](https://github.com/WebOfTrustInfo/btcr-hackathon/issues/38)
- We need a separate list of proofs (which are typically keys) that are allowed to issue claims under this DID, which may include (or not) an owner proof. In the BTCR case, the owner proof is always a key, and it always is also an issuer key. See: [WebOfTrustInfo/btcr-hackathon#38](https://github.com/WebOfTrustInfo/btcr-hackathon/issues/38)
- We have some better understanding of the roles of [WebOfTrustInfo/btcr-hackathon#33](https://github.com/WebOfTrustInfo/btcr-hackathon/issues/33) and in particular the short summary at [WebOfTrustInfo/btcr-hackathon#33 (comment)](https://github.com/WebOfTrustInfo/btcr-hackathon/issues/33#issuecomment-314608959)
- Rather than using control proofs for revocation, this may need to be a separate list of proofs also. This is our same problem with overloading owner. See more thoughts on revocation starting at [WebOfTrustInfo/btcr-hackathon#33 (comment)](https://github.com/WebOfTrustInfo/btcr-hackathon/issues/33#issuecomment-314618077)


### Prototypes

We implemented Tx Ref conversion to txids (and back) in the following repos:
- [https://github.com/WebOfTrustInfo/txref-conversion-js](https://github.com/WebOfTrustInfo/txref-conversion-js)
- [https://github.com/WebOfTrustInfo/txref-conversion-java](https://github.com/WebOfTrustInfo/txref-conversion-java)
- [https://github.com/WebOfTrustInfo/txref-conversion-python](https://github.com/WebOfTrustInfo/txref-conversion-python)

BTCR Playground for experimenting with and visualizing BTCRs:
- [https://github.com/WebOfTrustInfo/btcr-tx-playground.github.io](https://github.com/WebOfTrustInfo/btcr-tx-playground.github.io)
- [https://github.com/WebOfTrustInfo/btcr-did-tools-js](https://github.com/WebOfTrustInfo/btcr-did-tools-js)


## What's next
We've moved all open issues to the following repos:
- [DID spec](https://github.com/w3c-ccg/did-spec/issues) - DID spec-related issues
- [RWoT fall 2017](https://github.com/WebOfTrustInfo/rebooting-the-web-of-trust-fall2017) - Follow-up prototyping
- [VC Data Model](https://github.com/w3c/vc-data-model/issues) - Issues specific to Verifiable Claims data model
- [BTCR Playground Issues](https://github.com/WebOfTrustInfo/btcr-tx-playground.github.io) - Enhancements to BTCR playground tool

## References
- [DID (Decentralized Identifier) Data Model and Generic Syntax 1.0 Implementer’s Draft 01](https://github.com/WebOfTrustInfo/rebooting-the-web-of-trust-fall2016/blob/master/draft-documents/DID-Spec-Implementers-Draft-01.pdf)
- [DID Method Specifications / BTCR and PGPR](https://github.com/WebOfTrustInfo/rebooting-the-web-of-trust-spring2017/blob/master/event-documents/group-abstracts/btcr-did-method-spec.md) (only outline so far)
- txref — Bech32 encoding of bitcoin transactions
    - Original proposal: https://lists.linuxfoundation.org/pipermail/bitcoin-dev/2017-May/014396.html
    - BIP draft: https://github.com/veleslavs/bips/blob/Bech32_Encoded_TxRef/bip-XXXX-Bech32_Encoded_Transaction_Postion_References.mediawiki
    - Reference code: [https://github.com/jonasschnelli/bitcoin_txref_code](https://github.com/jonasschnelli/bitcoin_txref_code)
- Bech32
    - BIP 173: https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki
    - Reference code: https://github.com/sipa/bech32
