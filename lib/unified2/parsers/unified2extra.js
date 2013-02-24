var definitions = require('../definitions');
var debug = require('debug')('unified2');
var pcap = require('pcap');

module.exports = Unified2ExtraParser;

function Unified2ExtraParser(header, parser) {
  var self = this;
  self.parser = parser;
  self.header = header;
  self.data = null;
  self.bytes = null;
  self.extra_type = null;
};

Unified2ExtraParser.prototype.done = function() {
  var self = this;
  // cotinue the parser.
  self.parser.emit('data', { header: self.header, data: self.data, extra_bytes: self.bytes, extra_type: self.extra_type, extra_string: function() { self.bytes.toString() } });
  self.parser.continue();
};


/* 
 *    Value           Description 
    ----------      -----------
    1               Original Client IPv4 
    2               Original Client IPv6
    3               UNUSED
    4               GZIP Decompressed Data
    5               SMTP Filename
    6               SMTP Mail From
    7               SMTP RCPT To
    8               SMTP Email Headers
    9               HTTP URI
    10              HTTP Hostname
    11              IPv6 Source Address
    12              IPv6 Destination Address
    13              Normalized Javascript Data
 */

Unified2ExtraParser.prototype.detect_type = function() {
  var self = this;

  switch (self.data.type) {
    case 1: 
      return 'Original Client IPv4';
    case 2:
      return 'Original Client IPv6';
    case 3:
      return 'UNUSED';
    case 4:
      return 'GZIP Decompressed Data';
    case 5:
      return 'SMTP Filename';
    case 6:
      return 'SMTP Mail From';
    case 7:
      return 'SMTP RCPT To';
    case 8:
      return 'SMTP Email Headers';
    case 9:
      return 'HTTP URI';
    case 10:
      return 'HTTP Hostname';
    case 11:
      return 'IPv6 Source Address';
    case 12: 
      return 'IPv6 Destination Address';
    case 13:
      return 'Normalized Javascript Data';
  }

  return 'Unknown';
};

Unified2ExtraParser.prototype.read_data = function(size, buffer) {
  var self = this;
  var start = definitions.Unified2ExtraData.size;
  // start at the last field

  if ((start + size) > buffer.length) {
    self.parser.error("Extra data size is too large. Expected " + (size + start) + " but length is: " + buffer.length);
  } else {
    // decode packet.
    self.bytes = new Buffer(size);
    buffer.copy(self.bytes, 0, start, start + size);
    self.extra_type = self.detect_type(); 
  }

  self.done();
};

Unified2ExtraParser.prototype.parse = function() {
  var self = this;
 
  self.parser.expect(self.header.length, function(buffer) {
  
    self.data = new definitions.Unified2ExtraData(buffer);

    if (self.data.blob_length > 0) {
      // XXX: I don't know why, but you have to subtract 8 bytes here.  Probably to account for the header?
      self.read_data(self.data.blob_length - 8, buffer);
    } else {
      self.done();
    }
  });
};


