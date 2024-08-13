import type { BaseLink, BaseNode } from "../core/types";
import type { Neighbor } from "./types";

export function getNeighbors(
  node: BaseNode,
  nodes: BaseNode[],
  links: BaseLink[]
): Neighbor[] {
  const neighbors: Neighbor[] = [];

  for (const link of links) {
    let neighborNode: BaseNode | undefined;

    if (link.startNodeId === node.id) {
      neighborNode = nodes.find((n) => n.id === link.endNodeId);
    } else if (link.endNodeId === node.id) {
      neighborNode = nodes.find((n) => n.id === link.startNodeId);
    }

    if (neighborNode) {
      neighbors.push({ node: neighborNode, link });
    }
  }

  return neighbors;
}
