import * as THREE from "three";
import { Link } from "./core/Link";
import { Node } from "./core/Node";
import { Point } from "./core/Point";
import { AbstractLineNetwork } from "./types";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { COLORS } from "./config";

// Create a material for the lines
const lineMaterial = new LineMaterial({ color: COLORS.tertiary, linewidth: 5 });

const createLinkVisualization = (
  start: THREE.Vector3,
  end: THREE.Vector3
): Line2 => {
  const geometry = new LineGeometry();
  geometry.setPositions([start.x, start.y, start.z, end.x, end.y, end.z]);
  const line = new Line2(geometry, lineMaterial);
  line.computeLineDistances();
  return line;
};

const nodeGeometry = new THREE.SphereGeometry(1 / 4, 32, 16);
const nodeMaterial = new THREE.MeshBasicMaterial({ color: COLORS.secondary });

const createNodeVisualization = (position: THREE.Vector3): THREE.Mesh => {
  const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
  mesh.position.copy(position);
  return mesh;
};

const playerGeometry = new THREE.CapsuleGeometry(1, 1, 4, 8);
const playerMaterial = new THREE.MeshBasicMaterial({ color: COLORS.primary });

const createPlayerVisualization = (position: THREE.Vector3): THREE.Mesh => {
  const capsule = new THREE.Mesh(playerGeometry, playerMaterial);
  capsule.position.copy(position);
  return capsule;
};

/**
 * Class representing a network of nodes and links.
 */
export class LineNetwork
  extends THREE.EventDispatcher
  implements AbstractLineNetwork
{
  private _nodes: Node[] = [];

  private _links: Link[] = [];

  private _player?: THREE.Mesh;

  init(nodes: Node[], links: Link[], parent: THREE.Object3D) {
    this._nodes = nodes;
    this._links = links;

    // Create and add lines based on links
    links.forEach((link) => {
      const startNode = nodes.find((node) => node.id === link.startNodeId);
      const endNode = nodes.find((node) => node.id === link.endNodeId);

      if (startNode && endNode) {
        const line = createLinkVisualization(
          startNode.position,
          endNode.position
        );

        const node1 = createNodeVisualization(startNode.position);
        const node2 = createNodeVisualization(endNode.position);

        parent.add(line);
        parent.add(node1);
        parent.add(node2);
      }
    });

    this._player = createPlayerVisualization(nodes[0].position);
    parent.add(this._player);
  }

  generate(points: Point[], parent: THREE.Object3D) {
    const nodes = points.map((point, index) => new Node(index, point.position));
    const links = nodes
      .slice(0, -1)
      .map((_node, index) => new Link(index, index + 1));

    this.init(nodes, links, parent);
  }

  getNodes(): Readonly<Node[]> {
    return this._nodes;
  }

  getLinks(): Readonly<Link[]> {
    return this._links;
  }

  dispose() {
    this._nodes = [];
    this._links = [];
  }

  update() {
    // Do nothing for now
  }
}
