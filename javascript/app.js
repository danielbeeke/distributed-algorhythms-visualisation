import {Paper} from '/javascript/Paper.js';

let paper = new Paper('#paper',
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'],
  'circle'
);

paper.connectNodes('a', ['b', 'c', 'd', 'f']);
paper.connectNodes('c', ['e', 'f']);
paper.connectNodes('d', ['e', 'g', 'h', 'i', 'j']);
paper.connectNodes('i', ['k', 'l', 'm', 'n']);
