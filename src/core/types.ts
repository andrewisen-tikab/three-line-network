import * as THREE from "three";

/**
 * ID is a unique identifier for a a node or link.
 */
export type ID = number;

/**
 * Node represents a node in the graph.
 */
export type BaseNode = {
  /**
   * Unique identifier for the node.
   */
  id: ID;
  /**
   * Position of the node in 3D space.
   */
  position: THREE.Vector3;
};

/**
 * Link represents a link between two nodes in the graph.
 */
export type BaseLink = {
  /**
   * Unique identifier for the start node.
   */
  startNodeId: ID;
  /**
   * Unique identifier for the end node.
   */
  endNodeId: ID;
};
