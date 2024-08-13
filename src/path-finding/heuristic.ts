import type { BaseNode } from "../core/types";

/**
 * Get the euclidean distance between two nodes.
 * @param nodeA {@link BaseNode}
 * @param nodeB {@link BaseNode}
 * @returns Euclidean distance between two nodes.
 */
export function heuristic(nodeA: BaseNode, nodeB: BaseNode): number {
  return nodeA.position.distanceTo(nodeB.position);
}
