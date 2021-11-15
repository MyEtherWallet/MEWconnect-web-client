import 'regenerator-runtime/runtime';
const path = require('path');
function noOp() {}
if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: noOp });
}
window.Worker = noOp;
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.test') });
