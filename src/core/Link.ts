import { type BaseLink, ID } from "./types";

export class Link implements BaseLink {
  startNodeId: ID;
  endNodeId: ID;

  private _length: number = 0;

  constructor(startNodeId: ID, endNodeId: ID) {
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
