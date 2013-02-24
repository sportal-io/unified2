var definitions = require('../lib/unified2/definitions');
var Parser = require('../lib/unified2/parser');
var fs = require('fs');
var ref = require('ref');
var typedefs = definitions.typedefs;
var ip = require('ip');
//var fd = fs.openSync('unified2.file', 'r');

//testReadHeader(0);
//
var parser = new Parser('unified2.file');

parser.on('data', function(data) {
  // if (data.header.type == 110) {

    // var buf = data.data.source_ip.u6_addr32.buffer;
    // console.log("XXX", buf, buf.length, ip.toString(buf, 0, buf.length));
  
  // }
});
parser.run();
