import * as THREE from "three";
import { Link } from "./core/Link";
import { Node } from "./core/Node";
import { Point } from "./core/Point";
import { AbstractLineNetwork } from "./types";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { COLORS } from "./config";
import { Switch } from "./Switch";

const linesVizGeometry = new LineGeometry();
linesVizGeometry.setPositions([0, 0, 0, 0, 0, 0]);

const linesVizMaterial = new LineMaterial({
  color: 0xff0000,
  linewidth: 5, // Adjust based on your requirements
  dashSize: 1, // Length of each dash
  gapSize: 0.5, // Length of the gap between dashes
  dashed: true,
});

const linesViz = new Line2(linesVizGeometry, linesVizMaterial);

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

  private _switches: Map<number, Switch> = new Map(); // Store switches by node ID

  private _player?: THREE.Mesh;

  private _speed = 0;

  private _distanceTraveled: number = 0;

  private _currentStartNode?: Node;

  private _currentEndNode?: Node;

  private _currentNextStartNode?: Node;

  private _currentLink?: Link;

  debugScene: THREE.Scene = new THREE.Scene();

  init(nodes: Node[], links: Link[], parent: THREE.Object3D) {
    this.debugScene.clear();
    this.debugScene.add(linesViz);
    linesViz.computeLineDistances();
    linesViz.position.y = 0.5;

    this._nodes = nodes;
    this._links = links;

    // Create and add lines based on links
    links.forEach((link) => {
      const startNode = nodes.find((node) => node.id === link.startNodeId);
      const endNode = nodes.find((node) => node.id === link.endNodeId);

      if (startNode && endNode) {
        link.setLength(startNode.position.distanceTo(endNode.position));

        const line = createLinkVisualization(
          startNode.position,
          endNode.position
        );

        const node1 = createNodeVisualization(startNode.position);
        const node2 = createNodeVisualization(endNode.position);

        parent.add(line);
        parent.add(node1);
        parent.add(node2);

        // Add the link to both nodes' switches (if they exist)
        this.addLinkToSwitch(startNode, link);
        this.addLinkToSwitch(endNode, link);
      }
    });

    this._player = createPlayerVisualization(nodes[0].position);
    parent.add(this._player);

    this.setCurrentLink(links[0], nodes[0]);
  }

  private addLinkToSwitch(node: Node, link: Link) {
    if (!this._switches.has(node.id)) {
      const defaultExitLink = link; // Assign the first link as the default exit link for simplicity
      const networkSwitch = new Switch(node, [link], defaultExitLink);
      this.debugScene?.add(networkSwitch.generateLabel());
      this._switches.set(node.id, networkSwitch);
    } else {
      const switchInstance = this._switches.get(node.id)!;
      switchInstance.links.push(link);
    }
  }

  getSwitchForNode(nodeId: number): Switch | undefined {
    return this._switches.get(nodeId);
  }

  generate(points: Point[], parent: THREE.Object3D) {
    const nodes = points.map((point, index) => new Node(index, point.position));
    const links = nodes
      .slice(0, -1)
      .map((_node, index) => new Link(index, index, index + 1));

    this.init(nodes, links, parent);
  }

  setSpeed(speed: number): void {
    this._speed = speed;
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
    this._speed = 0;
  }

  // update(delta: number) {
  //   if (this._player == null) return;
  //   if (this._speed === 0) return;

  //   distanceTraveled += this._speed * delta;

  //   let accumulatedDistance = 0;
  //   let totalPathLength = this._links.reduce(
  //     (sum, link) => sum + link.getLength(),
  //     0
  //   );

  //   for (let i = 0; i < this._links.length; i++) {
  //     const link = this._links[i];
  //     accumulatedDistance += link.getLength();

  //     if (distanceTraveled <= accumulatedDistance) {
  //       // Determine position along the current link
  //       const startNode = this._nodes.find(
  //         (node) => node.id === link.startNodeId
  //       )!;
  //       const endNode = this._nodes.find((node) => node.id === link.endNodeId)!;

  //       this._currentStartNode = this._speed > 0 ? startNode : endNode;
  //       this._currentEndNode = this._speed > 0 ? endNode : startNode;
  //       this._currentLink = link;

  //       const segmentDistance =
  //         link.getLength() - (accumulatedDistance - distanceTraveled);
  //       const t = segmentDistance / link.getLength();

  //       this._player.position.lerpVectors(
  //         startNode.position,
  //         endNode.position,
  //         t
  //       );

  //       if (t > 1) {
  //         this._player.position.copy(endNode.position);
  //         distanceTraveled = 0;
  //       } else if (t < 0) {
  //         this._player.position.copy(startNode.position);
  //         distanceTraveled = 0;
  //       }

  //       break;
  //     }
  //   }

  //   // Handle edge cases: Loop back or reverse direction at the ends
  //   if (distanceTraveled >= totalPathLength) {
  //   } else if (distanceTraveled <= 0) {
  //   }
  // }

  getCurrentStartNode(): Node | undefined {
    return this._currentStartNode;
  }

  getCurrentEndNode(): Node | undefined {
    return this._currentEndNode;
  }

  getCurrentLink(): Link | undefined {
    return this._currentLink;
  }

  getCurrentNextStartNode(): Node | undefined {
    return this._currentNextStartNode;
  }

  update(delta: number) {
    linesVizMaterial.dashOffset -= 0.05; // Change this value to control the speed

    if (this._player == null || this._currentLink == null || this._speed === 0)
      return;

    this._distanceTraveled += this._speed * delta;

    if (
      this._distanceTraveled > this._currentLink.getLength() ||
      this._distanceTraveled < 0
    ) {
      // Player reached the end or beginning of the current link
      this.switchLink();
    }

    // Determine position along the current link
    const startNode = this._currentStartNode!;
    const endNode = this._currentEndNode!;
    const t = this._distanceTraveled / this._currentLink.getLength();

    this._player.position.lerpVectors(startNode.position, endNode.position, t);
  }

  private switchLink() {
    if (
      this._speed > 0 &&
      this._distanceTraveled >= this._currentLink!.getLength()
    ) {
      // Moving forward and reached the end of the current link
      this._distanceTraveled -= this._currentLink!.getLength();
      const switchInstance = this._switches.get(this._currentEndNode!.id);

      if (switchInstance) {
        const nextLink = switchInstance.getNextLink(this._currentLink!);
        if (nextLink == null) return;
        this.setCurrentLink(nextLink, this._currentEndNode!);
      }
    } else if (this._speed < 0 && this._distanceTraveled <= 0) {
      // Moving backward and reached the start of the current link
      this._distanceTraveled += this._currentLink!.getLength();
      const switchInstance = this._switches.get(this._currentStartNode!.id);

      if (switchInstance) {
        const nextLink = switchInstance.getNextLink(this._currentLink!);
        if (nextLink == null) return;

        this.setCurrentLink(nextLink, this._currentStartNode!);
      }
    }
  }

  private updateLinksVisualization() {
    let visitedNodes = new Set<number>();
    const linesVizGeometry = new LineGeometry();

    const points: THREE.Vector3[] = [];
    // points.push(new THREE.Vector3(0, 0, 0));
    // points.push(new THREE.Vector3(-10, 0, 0));

    let startNode = this._currentStartNode!;
    let endNode = this._currentEndNode!;

    points.push(startNode.position);

    let link = this._currentLink!;

    while (true) {
      points.push(endNode.position);

      const switchInstance = this._switches.get(endNode.id);

      if (switchInstance) {
        // console.log("link", link.id);

        const nextLink = switchInstance.getNextLink(link);
        if (nextLink == null) break;

        const newStartNode = this._nodes.find(
          (node) => node.id === nextLink.startNodeId
        )!;
        const newEndNode = this._nodes.find(
          (node) => node.id === nextLink.endNodeId
        )!;

        // console.log("newStartNode", newStartNode.id);

        console.log("newEndNode", newEndNode.id);
        // console.log("end",endNode.id);

        // // Going in reverse
        // if (newEndNode.id === endNode.id) {
        //   break;
        // }

        visitedNodes.add(startNode.id);
        visitedNodes.add(endNode.id);

        if (newEndNode.id === endNode.id) {
          startNode = newEndNode;
          endNode = newStartNode;
        } else {
          startNode = newStartNode;
          endNode = newEndNode;
        }

        link = nextLink;

        // console.log("Going to", endNode.id);

        if (visitedNodes.has(startNode.id) && visitedNodes.has(endNode.id)) {
          break;
        }
      } else {
        break;
      }
    }

    linesVizGeometry.setPositions(
      points.map((point) => [point.x, point.y, point.z]).flat()
    );
    const oldGeometry = linesViz.geometry as LineGeometry;
    linesViz.geometry = linesVizGeometry;
    oldGeometry.dispose();

    linesViz.computeLineDistances();
  }

  private setCurrentLink(link: Link, fromNode: Node) {
    this._currentLink = link;
    this._currentStartNode = fromNode;
    this._currentEndNode = this._nodes.find(
      (node) =>
        node.id ===
        (fromNode.id === link.startNodeId ? link.endNodeId : link.startNodeId)
    )!;

    const nextSwitch = this._switches.get(this._currentEndNode.id);
    if (nextSwitch) {
      const nextLink = nextSwitch.getNextLink(link);
      if (nextLink == null) {
        throw new Error("Next link is null");
      }

      const currentNextStartNode =
        nextLink.startNodeId === this._currentEndNode.id
          ? nextLink.endNodeId
          : nextLink.startNodeId;

      this._currentNextStartNode = this._nodes.find(
        (node) => node.id === currentNextStartNode
      );
    }

    this.updateLinksVisualization();
  }
}
