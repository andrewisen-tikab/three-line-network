import { Example } from "../Example";
import "../styles.css";
import * as TLN from "../../src";
import { Node } from "../../src/core/Node";
import { Link } from "../../src/core/Link";
import * as THREE from "three";

const example = new Example();
const { network } = example;

const nodes: Node[] = [
  new Node(1, new THREE.Vector3(0, 0, 0)),
  new Node(2, new THREE.Vector3(10, 0, 0)),
  new Node(3, new THREE.Vector3(10, 0, 10)),
  new Node(4, new THREE.Vector3(30, 0, 30)),
];

const links: Link[] = [new Link(1, 1, 2), new Link(2, 2, 3), new Link(3, 3, 4)];

network.init(nodes, links, example.group);
example.group.position.set(0, 0.1, 0);
