/* eslint-disable */
const platform = require('platform');
import * as types from './types/index';
import * as nodes from './nodes/index';

let nodeList = {};
Object.keys(types).forEach(key => {
  nodeList[types[key].name] = [];
});

Object.keys(nodes).forEach(key => {
  if (nodes[key].service === nodes['ethmewws'].service) {
    nodeList[nodes[key].type.name].splice(0, 0, nodes[key]);
  } else if (
    nodes[key].service === 'infura.io' &&
    platform.name &&
    platform.name === 'firefox'
  )
    return;
  // temp until infura fix https://github.com/INFURA/infura/issues/174
  else {
    nodeList[nodes[key].type.name].push(nodes[key]);
  }
});

export default nodeList;
