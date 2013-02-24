var definitions = require('../definitions');

module.exports = Unified2IDSEventIPv6LegacyParser;

function Unified2IDSEventIPv6LegacyParser(header, parser) {
  var self = this;
  self.parser = parser;
  self.header = header;
  self.data = null;
};

Unified2IDSEventIPv6LegacyParser.prototype.done = function() {
  var self = this;
  // cotinue the parser.
  self.parser.emit('data', { header: self.header, data: self.data });
  self.parser.continue();
};

Unified2IDSEventIPv6LegacyParser.prototype.parse = function() {
  var self = this;

  self.parser.expect(self.header.length, function(buffer) {
    self.data = new definitions.Unified2IDSEventIPv6Legacy(buffer); 
    self.done();
  });
};

