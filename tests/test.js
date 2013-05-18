var definitions = require('../lib/unified2/definitions');
var Parser = require('../lib/unified2/parser');
var fs = require('fs');
var ref = require('ref');
var typedefs = definitions.typedefs;
var ip = require('ip');
var path = require('path');

function testUnified2(file) {
  var parser = new Parser(file, { tail: false });
  
  parser.on('data', function(data) {
    console.log(data);
    // TODO: other things?
  });

  parser.on('error', function(err) {
    throw err;
  })

  parser.on('end', function(data) {
    console.log("Ended:", data);
  });


  parser.run();

}

testUnified2(path.join(__dirname, 'unified2.file'));
testUnified2(path.join(__dirname, 'unified2-legacy.log'));
testUnified2(path.join(__dirname, 'unified2-current.log'));
