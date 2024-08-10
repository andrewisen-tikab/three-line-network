import { Example } from "../Example";
import "../styles.css";
import * as TLN from "../../src";
import { Point } from "../../src/core/Point";

import * as THREE from "three";

const example = new Example();
const { network } = example;

const points: Point[] = [
  new Point(new THREE.Vector3(0, 0, 0)),
  new Point(new THREE.Vector3(10, 0, 0)),
  new Point(new THREE.Vector3(10, 0, 10)),
  new Point(new THREE.Vector3(30, 0, 30)),
];

network.generate(points, example.group);
example.group.position.set(0, 0.1, 0);
