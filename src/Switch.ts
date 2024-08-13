import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

import { Link } from "./core/Link";
import { Node } from "./core/Node";
import { type AbstractSwitch } from "./types";

export class Switch implements AbstractSwitch {
  currentNode: Node;
  links: Link[];
  defaultExitLink: Link;

  constructor(node: Node, links: Link[], defaultExitLink: Link) {
    this.currentNode = node;
    this.links = links;
    this.defaultExitLink = defaultExitLink;
  }

  /**
   * Get the next link in the switch, if it exists.
   * If it's null then the switch is a dead end.
   * @param currentLink
   */
  getNextLink(currentLink: Link): Link | null {
    const nextLinks = this.links.filter((link) => link !== currentLink);
    let nextLink = nextLinks[0];

    if (nextLink) {
      let nextLinkIndex = this.links.indexOf(nextLink!);

      if (nextLinks.length > 1) nextLinkIndex++;
      if (nextLinkIndex >= this.links.length) {
        nextLinkIndex = 0;
      }
      return this.links[nextLinkIndex];
    }

    return null;
  }

  generateLabel() {
    const div = document.createElement("div");
    div.className = "node-label";
    div.textContent = this.currentNode.id.toString();
    // earthDiv.style.backgroundColor = "transparent";

    const css2DObject = new CSS2DObject(div);
    css2DObject.position.copy(this.currentNode.position);
    css2DObject.position.y += 1;
    return css2DObject;
  }
}
