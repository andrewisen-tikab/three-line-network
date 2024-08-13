import { type BaseLink, ID } from "./types";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import * as THREE from "three";
export class Link implements BaseLink {
  id: ID;
  startNodeId: ID;
  endNodeId: ID;

  private _length: number = 0;

  constructor(id: ID, startNodeId: ID, endNodeId: ID) {
    this.id = id;
    this.startNodeId = startNodeId;
    this.endNodeId = endNodeId;
  }

  setLength(length: number) {
    this._length = length;
  }

  getLength(): number {
    return this._length;
  }

  generateLabel(startPosition: THREE.Vector3, endPosition: THREE.Vector3) {
    console.log("Generating label for link", this.id);

    const div = document.createElement("div");
    div.className = "link-label";
    div.textContent = this.id.toString();
    // earthDiv.style.backgroundColor = "transparent";

    const css2DObject = new CSS2DObject(div);
    css2DObject.position.copy(startPosition).add(endPosition).divideScalar(2);
    css2DObject.position.y += 1.5;
    return css2DObject;
  }
}
