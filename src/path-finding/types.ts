import type { BaseLink, BaseNode } from "../core/types";

// Custom type for nodes with additional pathfinding properties
export type NodeRecord = {
  node: BaseNode;
  gCost: number; // Cost from start node
  hCost: number; // Heuristic cost to end node
  fCost: number; // Total cost (gCost + hCost)
  parent?: NodeRecord; // Parent node in the path
};

export type Neighbor = {
  node: BaseNode;
  link: BaseLink;
};

export type HeuristicFunction = (nodeA: BaseNode, nodeB: BaseNode) => number;

export type GetNeighborsFunction = (
  node: BaseNode,
  nodes: BaseNode[],
  links: BaseLink[]
) => Neighbor[];

export type ReconstructPathFunction = (currentRecord: NodeRecord) => BaseNode[];
