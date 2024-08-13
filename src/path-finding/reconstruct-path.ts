import type { BaseNode, NodeRecord } from "../types";

export function reconstructPath(currentRecord: NodeRecord): BaseNode[] {
  const path: BaseNode[] = [];
  let current = currentRecord;

  while (current) {
    path.unshift(current.node);
    current = current.parent!;
  }

  return path;
}
