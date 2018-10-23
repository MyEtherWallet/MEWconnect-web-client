const open = require('opn');

// /usr/bin/env node

var separator = process.platform=="win32" ? "\\" : "/";
open(require('path').dirname(require.main.filename)+separator+".."+separator+"index.html");
