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
    this.broadcast({
      color: 'red'
    });
  }

  receive (message) {
    if (message.color && this.element.style.fill !== message.color) {
      this.element.style.fill = message.color;
      this.broadcast(message);
    }
  }

  broadcast (message) {
    this.receive(message);

    this.neighbours.forEach((neighbour) => {
      this.sendMessage(neighbour, message);
    });
  }

  sendMessage (node, message) {
    let line = this.paper.getLineByNodeIds(this.id, node.id);

    line.element.style.stroke = 'red';

    setTimeout(() => {
      node.receive(message);
      line.element.style.stroke = 'black';
    }, 1000);
  }
}