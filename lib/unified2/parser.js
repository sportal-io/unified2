var definitions = require('./definitions');
var fs = require('fs');
var ref = require('ref');
var typedefs = definitions.typedefs;
var ip = require('ip');
var parsers = require('./parsers');
var debug = require('debug')('unified2');

module.exports = Parser;

function Parser(filename, options) {
  var self = this;
  
  options = options || {}; 

  self.options = options;
  self.filename = filename;
  self.events = {};
  self.fd = fs.openSync(filename, 'r'); 
  self.offset = options.offset || 0;
  
  self.bytes_to_read = 0;
  self.buffer = null; 
  self.last_read_position = self.offset;

  self.stopped = false;
};

Parser.prototype.stop = function() {
  self.stopped = true;
};

Parser.prototype.expect = function(size, callback) {
  var self = this;  
  self.bytes_to_read = size;
  self.on_data = callback;
  self._read();
}

Parser.prototype.continue = function() {
  var self = this;
  self.run();
}; 

Parser.prototype.on = function(event, callback) {
  var self = this;
  self.events[event] = callback;
};

Parser.prototype.emit = function(event, data) {
  var self = this;
  data = data || null;
  if (self.events[event] && typeof self.events[event] === 'function') {
    self.events[event](data); 
  }
};

Parser.prototype.run = function() {
  var self = this;
 
  if (!self.stopped) {
    self._read_header();
  } else {
    self._end(); 
  }
};

Parser.prototype._end = function() {
  var self = this;

  if (self.fd) {
    self.emit('end', { position: self.last_read_position });
    fs.close(self.fd);
    self.fd = null;
  };

};

Parser.prototype._wait_for_data = function() {

  var self = this;

  if (typeof self.options.tail !== 'undefined') {
    if (!self.options.tail) {
      debug("Received EOF");
      self._end();
      return;
    }
  }

  fs.watchFile(self.filename, function(curr_stat, prev_stat) {
 

    fs.unwatchFile(self.filename);

    if (self.stopped) {
      self._end();
    }

    if (curr_stat.size < prev_stat.size) {
      debug("File was rolled over. exiting.");
      self.emit('rollover', { position: self.last_read_position });
    } else {
      self._read();
    }
  });
};

Parser.prototype._clear = function() {
  var self = this;
  self.buffer = null; 
  self.bytes_to_read = 0;
};

Parser.prototype.error = function(msg) {
  var self = this;
  debug("[X]" + msg);
  self.emit('error', { msg: msg })
};

Parser.prototype._read_header = function() {
  var self = this;
  self.last_read_position = this.offset;
  self.expect(definitions.Unified2RecordHeader.size, function(buffer) {
  
    var header = new definitions.Unified2RecordHeader(buffer);
    //console.log("!!! READ HEADER: header is: ", header, buffer);

    switch (header.type) {

      case typedefs.UNIFIED2_IDS_EVENT:
        new parsers.Unified2IDSEventParser(header, self).parse();  
      break;

      case typedefs.UNIFIED2_IDS_EVENT_LEGACY:
        new parsers.Unified2IDSEventLegacyParser(header, self).parse();  
      break;

      case typedefs.UNIFIED2_PACKET:
        new parsers.Unified2PacketParser(header, self).parse();  
      break;

      case typedefs.UNIFIED2_EXTRA_DATA:
        new parsers.Unified2ExtraParser(header, self).parse();  
      break;

      case typedefs.UNIFIED2_IDS_EVENT_IPV6_LEGACY:
        new parsers.Unified2IDSEventIPv6LegacyParser(header, self).parse();  
      break;
      
      default:
        debug("Header is not supported: ", header, header.type);
        self.error('unsupported header type: ' + header.type);

        if (self.options.skip_errors) {
          self.expect(header.length, function(buffer) {
            // NOOP
            self.continue();
          }); 
        } 
      break;
    }
  });
};

Parser.prototype._read = function() {

  var self = this;
  var length = self.bytes_to_read;

  fs.read(self.fd, new Buffer(length), 0, length, self.offset, function(err, count, buffer) {

    self.offset += count;
    
    if (count > 0) {
      if (!self.buffer) {
        self.buffer = buffer;  
      } else {
        self.buffer = Buffer.concat([self.buffer, buffer], self.buffer.length + count) 
      }
    };

    if (!err && count == length) {

      self.on_data(self.buffer);
      self._clear();

    } else {

      if (err) {
        console.log("[X] Parser error:", err);
      } 

      if (count != length) {
        console.log("[X] Expected " + length + " bytes, read " + count);
        self.bytes_to_read = length - count;
        self._wait_for_data(); 
      }
    }
  });
};
