import '/node_modules/svg-innerhtml/svg-innerhtml.js';
import {Node} from '/javascript/Node.js';

export class Paper {
  constructor (svgSelector, nodeIds = [], layout = 'circle') {
    this.element = document.querySelector(svgSelector);
    this.nodes = new Map();
    this.timeout = false;
    this.lines = new Map();
    this.layout = layout;

    nodeIds.forEach((nodeId) => {
      this.newNode(nodeId);
    })
  }

  getNode (id) {
    return this.nodes.get(id);
  }

  getLineById (lineId) {
    return this.lines.get(lineId);
  }

  getLineByNodeIds (nodeId1, nodeId2) {
    let node1 = this.getNode(nodeId1);
    let node2 = this.getNode(nodeId2);
    let lineId = node1.delta > node2.delta ? node1.id + '-' + node2.id : node2.id + '-' + node1.id;
    return this.getLineById(lineId);
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

    if (typeof this[this.layout + 'Layout'] === 'function') {
      this[this.layout + 'Layout']();
    }

    this.nodes.forEach((node) => {
      node.neighbours.forEach((neighbour) => {
        if (node.delta > neighbour.delta) {
          this.lines.set(node.id + '-' + neighbour.id, {
            id: node.id + '-' + neighbour.id,
            x1: node.x,
            y1: node.y,
            x2: neighbour.x,
            y2: neighbour.y
          });
        }
      });
    });

    this.lines.forEach((line) => {
      output += `<line x1="${line.x1}" y1="${line.y1}" x2="${line.x2}" y2="${line.y2}" data-id="${line.id}"/>`;
    });

    this.nodes.forEach((node) => {
      output += `<circle data-id="${node.id}" cx="${node.x}" cy="${node.y}" r="20"/>`;
      output += ` <text x="${node.x}" y="${node.y}" text-anchor="middle" dominant-baseline="central">${node.id}</text>`;
    });

    this.element.innerHTML = output;

    // Attaching elements to the classes.
    Array.from(this.element.querySelectorAll('circle')).forEach((circle) => {
      let matchedNode = this.getNode(circle.dataset.id);
      matchedNode.element = circle;
      circle.paperNode = matchedNode;

      circle.addEventListener('click', () => {
        circle.paperNode.click();
      })
    });

    Array.from(this.element.querySelectorAll('line')).forEach((line) => {
      let matchedLine = this.getLineById(line.dataset.id);
      matchedLine.element = line;
      line.paperLine = matchedLine;
    });
  }

  circleLayout () {
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
  }

  squareLayout () {
    let padding = 30;
    let size = 540;
    let nodeArray = Array.from(this.nodes);
    let spaceBetween = size * 4 /  nodeArray.length;

    let spaceTravelled = 0;

    nodeArray.forEach((item, delta) => {
      if (spaceTravelled <= size) {
        item[1].x = delta * spaceBetween + padding;
        item[1].y = padding;
      }

      if (spaceTravelled > size && spaceTravelled < size * 2) {
        item[1].x = size + padding;
        item[1].y = spaceTravelled - size + padding;
      }

      if (spaceTravelled >= size * 2 && spaceTravelled < size * 3) {
        item[1].x = size - (spaceTravelled - size * 2) + padding;
        item[1].y = size + padding;
      }

      if (spaceTravelled >= size * 3 && spaceTravelled <= size * 4) {
        item[1].x = padding;
        item[1].y = size - (spaceTravelled - size * 3) + padding;
      }

      spaceTravelled += spaceBetween;
    });

  }
}