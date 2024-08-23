import { Example } from "../Example";
import "../styles.css";
import { Node } from "../../src/core/Node";
import { Link } from "../../src/core/Link";
import { generateProfiledContourGeometry } from "../../src/shape/generate-profiled-contour-geometry";

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
];

network.init(nodes, links, example.group);
example.group.position.set(0, 0.1, 0);

const generateShape = (x: number, isPositive: boolean = true) => {
  x = isPositive ? x : -x;
  const shape = new THREE.Shape();
  shape.moveTo(x, 0);
  shape.lineTo(x, 1);
  shape.lineTo(x, 0);

  return shape;
};

const profileMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
});

const generateProfile = (shape: THREE.Shape, contour: THREE.Vector2[]) => {
  const profileGeometry = generateProfiledContourGeometry(
    shape,
    contour,
    false,
    true
  );

  const profile = new THREE.Mesh(profileGeometry, profileMaterial);
  profile.rotateX(Math.PI * 0.5);
  profile.position.y = 0.1;
  example.group.add(profile);
};

const shape1 = generateShape(1);
const shape2 = generateShape(1, false);

const points = nodes.map((node) => node.position);
points.pop();
points.pop();

const contour1 = points.map((point) => new THREE.Vector2(point.x, point.z));
const contour2 = points.map((point) => new THREE.Vector2(point.x, point.z));

generateProfile(shape1, contour1);
generateProfile(shape2, contour2);
