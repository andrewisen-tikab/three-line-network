import * as THREE from "three";

/**
 * ID is a unique identifier for a a node or link.
 */
export type ID = number;

/**
 * AbstractPoint represents a point in 3D space.
 * It can be either a {@link BaseNode} or a {@link BaseLink}.
 */
export type AbstractPoint = {
  position: THREE.Vector3;
};

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
  id: number;
  /**
   * Unique identifier for the start node.
   */
  startNodeId: ID;
  /**
   * Unique identifier for the end node.
   */
  endNodeId: ID;

  /**
   * Set the length of the link.
   * @param length The length of the link.
   */
  setLength(length: number): void;

  /**
   * Get the length of the link.
   * @returns The length of the link.
   */
  getLength(): number;
};
