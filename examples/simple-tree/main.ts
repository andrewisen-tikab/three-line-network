import { Example } from "../Example";
import "../styles.css";
import * as TLN from "../../src";
import { Node } from "../../src/core/Node";
import { Link } from "../../src/core/Link";
import * as THREE from "three";

const example = new Example();
const { network } = example;

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
example.group.position.set(0, 0.1, 0);
