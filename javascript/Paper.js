import '/node_modules/svg-innerhtml/svg-innerhtml.js';
import {Node} from '/javascript/Node.js';

export class Paper {
  constructor (svgSelector) {
    this.element = document.querySelector(svgSelector);
    this.nodes = new Map();
    this.timeout = false;
  }

  /**
   * Node factory and manager.
   * @param id
   * @returns {Node}
   */
  newNode (id) {
    let node = new Node(id, this, this.nodes.size + 1);
    this.nodes.set(id, node);
    return node;
  }

  /**
   * This function always draws in the next tick.
   */

  draw () {
    if (this.timeout) { clearTimeout(this.timeout) }

    this.timeout = setTimeout(() => {
      this._draw();
    });
  }

  _draw () {
    let output = '';
    let radius = 200;
    let width = (radius * 2) + 50;
    let height = (radius * 2) + 50;


    let delta = 0;
    this.nodes.forEach((node) => {
      let angle = (delta / (this.nodes.size / 2)) * Math.PI;
      node.x = (radius * Math.cos(angle)) + (width / 2);
      node.y = (radius * Math.sin(angle)) + (height / 2);
      delta++;
    });

    this.nodes.forEach((node) => {
      node.neighbours.forEach((neighbour) => {
        if (node.delta > neighbour.delta) {
          output += `<line x1="${node.x}" y1="${node.y}" x2="${neighbour.x}" y2="${neighbour.y}"/>`;
        }
      });
    });

    this.nodes.forEach((node) => {
      output += `<circle cx="${node.x}" cy="${node.y}" r="20"/>`;
    });

    this.element.innerHTML = output;
  }


}