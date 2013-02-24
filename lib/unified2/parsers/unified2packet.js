var definitions = require('../definitions');
var debug = require('debug')('unified2');
var pcap = require('pcap');

module.exports = Unified2PacketParser;

function Unified2PacketParser(header, parser) {
  var self = this;
  self.parser = parser;
  self.header = header;
  self.data = null;
  self.bytes = null;
};

Unified2PacketParser.prototype.done = function() {
  var self = this;
  // cotinue the parser.
  self.parser.emit('data', { header: self.header, data: self.data, packet_bytes: self.bytes, packet: self.packet });
  self.parser.continue();
};


Unified2PacketParser.prototype._parse_packet = function(packet, raw_packet) {
  var self = this;

  var linktype = packet.linktype;

  raw_packet.pcap_header = {
    caplen: raw_packet.length,
    len: raw_packet.length
  };

  switch (linktype) {
    case definitions.linktypes.LINKTYPE_ETHERNET:
      return pcap.decode.ethernet(raw_packet, 0);
    break;
    case definitions.linktypes.LINKTYPE_NULL:
      return  pcap.decode.nulltype(raw_packet, 0);
    break;
    case definitions.linktypes.LINKTYPE_RAW:
      return pcap.decode.rawtype(raw_packet, 0);
    break;
    case definitions.linktypes.LINKTYPE_IEEE802_11_RADIO:
      return pcap.decode.ieee802_11_radio(raw_packet, 0);
    break;
    case definitions.linktypes.LINKTYPE_LINUX_SLL:
      return pcap.decode.linux_sll(raw_packet, 0);
    break;
    default:
      console.log("pcap.js: decode.packet() - Don't yet know how to decode link type " + linktype);
  };
};

Unified2PacketParser.prototype.read_packet_bytes = function(size, buffer) {
  var self = this;
  var start = definitions.Unified2Packet.size - 4;
  // start at the last field
  
  if (start + size != buffer.length) {
    self.parser.error("Packet data size is too large. Expected " + (size + start) + " but length is: " + buffer.length);
  } else {
    self.bytes = buffer.slice(start, start + size);
    // decode packet.
    try {
      self.packet = self._parse_packet(self.data, self.bytes);
    } catch (err) {
      // TODO: what on error?
     console.log("Error parsing packet: ", err.stack); 
     debug(self.data);
    }
  }

  self.done();
};

Unified2PacketParser.prototype.parse = function() {
  var self = this;
 
  self.parser.expect(self.header.length, function(buffer) {
    self.data = new definitions.Unified2Packet(buffer);
    if (self.data.packet_length > 0) {
      self.read_packet_bytes(self.data.packet_length, buffer);
    } else {
      self.done();
    }
  });

};


