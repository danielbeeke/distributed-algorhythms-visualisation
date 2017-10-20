import '/node_modules/svg-innerhtml/svg-innerhtml.js';
import {Node} from '/javascript/Node.js';

export class Paper {
  constructor (svgSelector, nodeIds = []) {
    this.element = document.querySelector(svgSelector);
    this.nodes = new Map();
    this.timeout = false;
    this.lines = new Map();

    nodeIds.forEach((nodeId) => {
      this.newNode(nodeId);
    })
  }

  getNode (id) {
    return this.nodes.get(id);
  }

  connectNodes (firstId, nodeIds) {
    let firstNode = this.getNode(firstId);

    nodeIds.forEach((nodeId) => {
      let currentNode = this.getNode(nodeId);
      firstNode.connectTo(currentNode);
    });
  }

  /**
   * Node factory and manager.
   * @param id
   * @returns {Node}
   */
  newNode (id) {
    let node = new Node(id, this, this.nodes.size + 1);
    this.nodes.set(id, node);
    this.draw();
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
          this.lines.set(node.id + '-' + neighbour.id, {
            x1: node.x,
            y1: node.y,
            x2: neighbour.x,
            y2: neighbour.y
          });
        }
      });
    });

    this.lines.forEach((line) => {
      output += `<line x1="${line.x1}" y1="${line.y1}" x2="${line.x2}" y2="${line.y2}"/>`;
    });

    this.nodes.forEach((node) => {
      output += `<circle data-id="${node.id}" cx="${node.x}" cy="${node.y}" r="20"/>`;
      output += ` <text x="${node.x}" y="${node.y}" text-anchor="middle" dominant-baseline="central">${node.id}</text>`;
    });

    this.element.innerHTML = output;

    Array.from(this.element.querySelectorAll('circle')).forEach((circle) => {
      let matchedNode = this.getNode(circle.dataset.id);
      matchedNode.element = circle;
      circle.paperNode = matchedNode;

      circle.addEventListener('click', () => {
        circle.paperNode.click();
      })
    })

  }


}