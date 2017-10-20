import {Paper} from '/javascript/Paper.js';

let paper = new Paper('#paper');

let node1 = paper.newNode('a');
let node2 = paper.newNode('b');
let node3 = paper.newNode('c');
let node4 = paper.newNode('d');
let node5 = paper.newNode('e');
let node6 = paper.newNode('f');

node1.connectTo(node2);
node1.connectTo(node3);
node3.connectTo(node4);
node3.connectTo(node5);
node4.connectTo(node6);
