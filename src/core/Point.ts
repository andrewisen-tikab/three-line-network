import * as THREE from "three";
import { type ArbitraryPoint } from "./types";

/**
 * Point represents a point in 3D space.
 */
export class Point implements ArbitraryPoint {
  position: THREE.Vector3;

  constructor(position: THREE.Vector3) {
    this.position = position;
  }
}
