export class Node {
  constructor (id, paper, delta) {
    this.id = id;
    this.paper = paper;
    this.delta = delta;
    this.neighbours = new Map();
    this.x = 0;
    this.y = 0;
    this.element = false;
  }

  connectTo (node) {
    if (node && !this.neighbours.has(node.id)) {
      this.neighbours.set(node.id, node);
      node.connectTo(this);
      this.paper.draw();
    }
  }

  click () {
    this.receive('red');
    this.broadcast('red');
  }

  receive (color) {
    if (this.element.style.fill !== color) {
      this.element.style.fill = color;
      this.broadcast(color);
    }
    else {
      console.warn('Double receive');
    }
  }

  broadcast (color) {
    this.neighbours.forEach((neighbour) => {
      setTimeout(() => {
        neighbour.receive(color);
      }, 900);
    });
  }
}