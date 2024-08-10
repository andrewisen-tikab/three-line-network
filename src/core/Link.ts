import { type BaseLink, ID } from "./types";

export class Link implements BaseLink {
  id: ID;
  startNodeId: ID;
  endNodeId: ID;

  private _length: number = 0;

  constructor(id: ID, startNodeId: ID, endNodeId: ID) {
    this.id = id;
    this.startNodeId = startNodeId;
    this.endNodeId = endNodeId;
  }

  setLength(length: number) {
    this._length = length;
  }

  getLength(): number {
    return this._length;
  }
}
