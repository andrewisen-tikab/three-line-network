import type { BaseLink, BaseNode, ID } from "../core/types";
import { heuristic } from "./heuristic";
import { getNeighbors } from "./neighbor";
import { reconstructPath } from "./reconstruct-path";
import type {
  GetNeighborsFunction,
  HeuristicFunction,
  NodeRecord,
  ReconstructPathFunction,
} from "./types";

export type AStarPathfinderParams = {
  heuristic: HeuristicFunction;
  getNeighbors: GetNeighborsFunction;
  reconstructPath: ReconstructPathFunction;
};

export class AStarPathfinder {
  /**
   * The heuristic function used in the A* algorithm.
   * This function estimates the cost from a given node to the goal node.
   */
  private heuristic: HeuristicFunction;
  /**
   * Retrieves the neighbors of a given node.
   *
   * @returns An array of neighboring nodes.
   */
  private getNeighbors: GetNeighborsFunction;

  /**
   * Reconstructs the path from the start node to the end node.
   *
   * @returns An array of nodes representing the path.
   */
  private reconstructPath: ReconstructPathFunction;

  constructor(
    {}: Partial<AStarPathfinderParams> = {
      heuristic,
      getNeighbors,
      reconstructPath,
    }
  ) {
    this.heuristic = heuristic;
    this.getNeighbors = getNeighbors;
    this.reconstructPath = reconstructPath;
  }

  /**
   * Finds the shortest path between a start node and an end node using the A* algorithm.
   * @param startNode - The starting node.
   * @param endNode - The target node.
   * @param nodes - An array of all available nodes.
   * @param links - An array of all available links.
   * @returns An array of nodes representing the shortest path from the start node to the end node.
   */
  public findPath(
    startNode: BaseNode,
    endNode: BaseNode,
    nodes: BaseNode[],
    links: BaseLink[]
  ): BaseNode[] {
    const openList: NodeRecord[] = [];
    const closedList: Set<ID> = new Set();

    const startRecord: NodeRecord = {
      node: startNode,
      gCost: 0,
      hCost: this.heuristic(startNode, endNode),
      fCost: this.heuristic(startNode, endNode),
    };

    openList.push(startRecord);

    while (openList.length > 0) {
      openList.sort((a, b) => a.fCost - b.fCost);
      const currentRecord = openList.shift()!;

      if (currentRecord.node.id === endNode.id) {
        return this.reconstructPath(currentRecord);
      }

      closedList.add(currentRecord.node.id);

      const neighbors = this.getNeighbors(currentRecord.node, nodes, links);

      for (const neighbor of neighbors) {
        if (closedList.has(neighbor.node.id)) continue;

        const tentativeGCost = currentRecord.gCost + neighbor.link.getLength();

        const existingRecord = openList.find(
          (record) => record.node.id === neighbor.node.id
        );
        if (!existingRecord || tentativeGCost < existingRecord.gCost) {
          const hCost = this.heuristic(neighbor.node, endNode);
          const newRecord: NodeRecord = {
            node: neighbor.node,
            gCost: tentativeGCost,
            hCost: hCost,
            fCost: tentativeGCost + hCost,
            parent: currentRecord,
          };

          if (!existingRecord) {
            openList.push(newRecord);
          } else {
            existingRecord.gCost = tentativeGCost;
            existingRecord.fCost = tentativeGCost + hCost;
            existingRecord.parent = currentRecord;
          }
        }
      }
    }

    return [];
  }
}
