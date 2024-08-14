import * as THREE from "three";
import { type BaseNode, ID } from "./types";

export class Node implements BaseNode {
  id: ID;
  position: THREE.Vector3;

  constructor(id: ID, position: THREE.Vector3) {
    this.id = id;
    this.position = position;
  }
}
