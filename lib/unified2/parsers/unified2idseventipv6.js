var definitions = require('../definitions');

module.exports = Unified2IDSEventIPv6Parser;

/** Parse a unified2 ipv6 event (legacy)
 *  Will emit a Unified2IDSEventIPv6 object in parser.on('data', ...) 
 *
 *  @param {Unified2RecordHeader} header record header
 *  @param {Parser} parser parent parser.
 *
 */
function Unified2IDSEventIPv6Parser(header, parser) {
  var self = this;
  self.parser = parser;
  self.header = header;
  self.data = null;
};


/**
 * Tell the parser to expect a Unified2IDSEventIPv6 event.
 */
Unified2IDSEventIPv6Parser.prototype.parse = function() {
  var self = this;

  self.parser.expect(self.header.length, function(buffer) {

    self.data = new definitions.Unified2IDSEventIPv6(buffer); 
    self.parser.emit('data', { header: self.header, data: self.data });
    self.parser.continue();

  });
};

