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

  getNextLink(currentLink: Link): Link {
    const nextLink = this.links.find((link) => link !== currentLink);

    if (nextLink) {
      let nextLinkIndex = this.links.indexOf(nextLink!) + 1;
      if (nextLinkIndex >= this.links.length) {
        nextLinkIndex = 0;
      }
      return this.links[nextLinkIndex];
    }

    return this.defaultExitLink;
  }

  generateLabel() {
    const div = document.createElement("div");
    div.className = "label";
    div.textContent = this.currentNode.id.toString();
    // earthDiv.style.backgroundColor = "transparent";

    const css2DObject = new CSS2DObject(div);
    css2DObject.position.copy(this.currentNode.position);
    css2DObject.position.y += 1;
    return css2DObject;
  }
}
