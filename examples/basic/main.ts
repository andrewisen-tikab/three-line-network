import { Example } from "../Example";
import "../styles.css";
import * as TLN from "../../src";
import { type Node, Link } from "../../src/types";
import * as THREE from "three";

const example = new Example();

const nodes: Node[] = [
  { id: 1, position: new THREE.Vector3(0, 0, 0) },
  { id: 2, position: new THREE.Vector3(10, 0, 0) },
  { id: 3, position: new THREE.Vector3(5, 10, 0) },
];

const links: Link[] = [
  { startNodeId: 1, endNodeId: 2 },
  { startNodeId: 2, endNodeId: 3 },
  { startNodeId: 3, endNodeId: 1 },
];

const network = new TLN.LineNetwork();
network.init(nodes, links, example.group);
