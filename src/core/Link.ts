import { type BaseLink, ID } from "./types";

export class Link implements BaseLink {
  startNodeId: ID;
  endNodeId: ID;

  constructor(startNodeId: ID, endNodeId: ID) {
    this.startNodeId = startNodeId;
    this.endNodeId = endNodeId;
  }
}
