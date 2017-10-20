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
    let node = new Node(id, this);
    this.nodes.set(id, node);
    return node;
  }

  /**
   * This function always draws in the next tick.
   */
  draw () {
    let output = '';
    let radius = 200;
    let width = (radius * 2) + 50;
    let height = (radius * 2) + 50;

    if (this.timeout) { clearTimeout(this.timeout) }

    this.timeout = setTimeout(() => {

      let delta = 0;
      this.nodes.forEach((key, node) => {
        let angle = (delta / (this.nodes.size / 2)) * Math.PI;
        let x = (radius * Math.cos(angle)) + (width / 2);
        let y = (radius * Math.sin(angle)) + (width / 2);

        output += `<circle cx="${x}" cy="${y}" r="20"/>`;

        delta++;
      });
    });

    this.element.innerHTML = output;
  }
}