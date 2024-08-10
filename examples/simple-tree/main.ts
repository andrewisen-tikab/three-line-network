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
  // B - D
  new Node(4, new THREE.Vector3(20, 0, -5)),
];

const links: Link[] = [
  // A - B
  new Link(1, 2),
  // B - C
  new Link(2, 3),
  // B - D
  new Link(2, 4),
];

network.init(nodes, links, example.group);
example.group.position.set(0, 0.1, 0);
