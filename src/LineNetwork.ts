import * as THREE from "three";
import { type BaseLink, BaseNode } from "./core/types";

// Create a material for the lines
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

export class LineNetwork extends THREE.EventDispatcher {
  init(nodes: BaseNode[], links: BaseLink[], parent: THREE.Object3D) {
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
}
