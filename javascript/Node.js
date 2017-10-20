export class Node {
  constructor (id, paper, delta) {
    this.id = id;
    this.paper = paper;
    this.delta = delta;
    this.neighbours = new Map();
    this.x = 0;
    this.y = 0;
  }

  connectTo (node) {
    if (!this.neighbours.has(node.id)) {
      this.neighbours.set(node.id, node);
      node.connectTo(this);
      this.paper.draw();
    }
  }
}