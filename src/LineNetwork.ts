import * as THREE from "three";
import { Link } from "./core/Link";
import { Node } from "./core/Node";
import { Point } from "./core/Point";
import { AbstractLineNetwork } from "./types";

// Create a material for the lines
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

/**
 * Class representing a network of nodes and links.
 */
export class LineNetwork
  extends THREE.EventDispatcher
  implements AbstractLineNetwork
{
  private _nodes: Node[] = [];

  private _links: Link[] = [];

  init(nodes: Node[], links: Link[], parent: THREE.Object3D) {
    this._nodes = nodes;
    this._links = links;

    // Function to create a line between two points
    const createLine = (start: THREE.Vector3, end: THREE.Vector3) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      return new THREE.Line(geometry, lineMaterial);
    };

    // Create and add lines based on links
    links.forEach((link) => {
      const startNode = nodes.find((node) => node.id === link.startNodeId);
      const endNode = nodes.find((node) => node.id === link.endNodeId);

      if (startNode && endNode) {
        const line = createLine(startNode.position, endNode.position);
        parent.add(line);
      }
    });
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
