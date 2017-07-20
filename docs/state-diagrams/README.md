# btcr-hackathon / did:btcr state diagrams

### purpose of the state diagrams

The purpose is generally the same as documenting any state machine:
help visualize transitions and make sure all of them are covered.

### how to read the diagrams

![alt text](images/btcr-state-diagram-key.png)

### the diagrams

![alt text](images/btcr-state-diagram-simple.png)

![alt text](images/btcr-state-diagram-recovery.png)

![alt text](images/btcr-state-diagram-all.png)

### open questions

* There's a valid user revocation possible by spending the BTC on the
  current tip.  This style of revocation does not have its own edges,
  yet.  The closest things are the "BTC theft" edges.

* Is the user's "explicit immediate revocation" a static transaction
  that can be outsourced to an external monitor?

* Is it actually helpful to show the red key compromises separately
  from the similar blue updates?

### differences from UML protocol state machines

[example of UML](http://www.uml-diagrams.org/protocol-state-machine-diagrams.html)

* Like a UML protocol state machine, all of the states and all of the
  transition messages are represented.

* Unlike the more typical diagrams, this one uses different shapes for
  different states.

* Unlike the more typical diagrams, this one focuses on the
  transactions that may occur in the blockchain, giving each its own
  rectangular node, at the expense of drawing the protocol's
  "transition edge" in two pieces.  When a transition edge is split in
  this way, the first half ends in a characteristic hollow dot instead
  of an arrow.

* Some transition edges are provoked by a timeout, and these do not
  require extra pieces to draw.

* Color is used to separate various concerns.

* This diagram focuses on threats to users of the protocol, giving
  attack scenarios their own transition edges (always colored red),
  even when they duplicate the form of state changes that users would
  intentionally initiate.

* It is possible to view multiple variants of compliant DIDs on the
  same diagram.

### advantages of using graphviz with this CPP mechanism

* graphviz lays this out automatically

* it avoids a source of errors in copying node information between
  files, at the cost of maintaining CPP ifdefs

* the clusters and nodes offer writing space, where necessary

* for slideshow effects, the CPP mechanism offers control over turning
  off any of the layers separately, while leaving nodes in their same
  position in the image.  this requires setting existing nodes to
  invisible, using a CPP variable that is not yet implemented.

### dependencies

* gnu make
* a C compiler's cpp
* graphviz

### graphviz packages

https://packages.debian.org/stable/graphviz

https://packages.ubuntu.com/search?keywords=graphviz

https://github.com/macports/macports-ports/blob/master/graphics/graphviz/Portfile

http://www.graphviz.org/Download.php

### building the diagram images

`make all`


