export class Node {
  constructor (id, paper) {
    this.id = id;
    this.paper = paper;
    this.neighbours = new Map();
  }

  connectTo (node) {
    if (!this.neighbours.has(node.id)) {
      this.neighbours.set(node.id, node);
      node.connectTo(this);
      this.paper.draw();
    }
  }
}