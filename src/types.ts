import * as THREE from "three";

/**
 * ID is a unique identifier for a a node or link.
 */
export type ID = string;

/**
 * Node represents a node in the graph.
 */
export type Node = {
  id: ID;
  position: THREE.Vector3;
};

/**
 * Link represents a link between two nodes in the graph.
 */
export type Link = {
  startNodeId: ID;
  endNodeId: ID;
};
