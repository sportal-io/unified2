var definitions = require('../definitions');
var debug = require('debug')('unified2');

module.exports = Unified2IDSEventLegacyParser;

function Unified2IDSEventLegacyParser(header, parser) {
  var self = this;
  self.parser = parser;
  self.header = header;
  self.data = null;
};

Unified2IDSEventLegacyParser.prototype.done = function() {
  var self = this;
  // cotinue the parser.
  self.parser.emit('data', { header: self.header, data: self.data });
  self.parser.continue();
};

Unified2IDSEventLegacyParser.prototype.parse = function() {
  
  var self = this;

  self.parser.expect(self.header.length, function(buffer) {
    self.data = new definitions.Unified2IDSEventLegacy(buffer); 
    self.done();
  });

};


