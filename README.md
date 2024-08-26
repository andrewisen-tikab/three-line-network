# three-line-network

`three-line-network` (TLN) is a library to create line networks in three.js.
A line network is a set of lines that are connected to each other.

The network can be a road network, a river network, a network of power lines, etc.

The library is designed to be simple and easy to use. It is not meant to be a full-featured library.

## Installation

```bash
yarn add three-line-network
```

## Usage

```typescript
import { LineNetwork, type Node, Link } from "three-line-network";

const network = new LineNetwork();

const nodes: Node[] = [
  // A - B
  new Node(1, new THREE.Vector3(0, 0, 0)),
  new Node(2, new THREE.Vector3(10, 0, 0)),
  // B - C
  new Node(3, new THREE.Vector3(20, 0, 5)),
  // C - E
  new Node(4, new THREE.Vector3(30, 0, 5)),
  // B - D
  new Node(5, new THREE.Vector3(20, 0, -5)),
  // D - F
  new Node(6, new THREE.Vector3(30, 0, -5)),
];

const links: Link[] = [
  // A - B
  new Link(1, 1, 2),
  // B - C
  new Link(2, 2, 3),
  // B - D
  new Link(3, 2, 5),
  // C - E
  new Link(4, 5, 6),
  // D - F
  new Link(5, 3, 4),
  // Connect
  new Link(6, 4, 6),
];

network.init(nodes, links, example.group);
```

## Example

Examples can be found in the `examples` folder.

## Demo

Deployed demo can be found at:

[https://andrewisen-tikab.github.io/three-line-network/examples/](https://andrewisen-tikab.github.io/three-line-network/examples/)

## Docs

Auto-generated docs can be found at:

[https://andrewisen-tikab.github.io/three-line-network/docs/](https://andrewisen-tikab.github.io/three-line-network/docs/)
