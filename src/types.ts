import * as THREE from "three";
import { type BaseLink, BaseNode, AbstractPoint } from "./core/types";

export * from "./core/types";

export type AbstractLineNetwork = {
  /**
   * Initialize the network with nodes and links.
   * @param nodes - List of nodes in the network.
   * @param links - List of links between nodes in the network.
   * @param parent - Parent object to add the lines to.
   */
  init(nodes: BaseNode[], links: BaseLink[], parent: THREE.Group): void;

  /**
   * Generate nodes from a list of points.
   * @param points - List of points to generate nodes from.
   * @param parent - Parent object to add the lines to.
   */
  generate(points: AbstractPoint[], parent: THREE.Object3D): void;

  /**
   * @returns List of nodes in the network.
   */
  getNodes(): Readonly<BaseNode[]>;

  /**
   * @returns List of links in the network.
   */

  getLinks(): Readonly<BaseLink[]>;

  /**
   * Update the network on each frame.
   */
  update(): void;

  /**
   * Dispose of the network.
   */
  dispose(): void;

  /**
   * Set the speed of the network.
   * @param speed - Speed to set the network to. From -100 to 100.
   */
  setSpeed(speed: number): void;
};
