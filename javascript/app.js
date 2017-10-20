import {Paper} from '/javascript/Paper.js';

let paper = new Paper('#paper', ['a', 'b', 'c', 'd', 'e', 'f', 'g']);

paper.connectNodes('a', ['b', 'c', 'd', 'f']);
paper.connectNodes('c', ['e', 'f']);
