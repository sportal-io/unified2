var definitions = require('./definitions');
var fs = require('fs');
var ref = require('ref');
var typedefs = definitions.typedefs;
var ip = require('ip');
var parsers = require('./parsers');
var debug = require('debug')('unified2');

module.exports = Parser;

/**
 * Initialize a unified2 parser for filename `filename` with `options`.
 * Will parse until end is reached 
 * Set `options.tail` if you want the parser to continue to look for new events after parser is complete.
 *
 * Example:  
 *..
 *    parser = new unified2unified2.Parser('unified2.alert.14560142132', { offset: 0 });
 *
 *    parser.on('data', function(data) {
 *      // event data...
 *    });
 *
 *    parser.on('error', function(error) {
 *      // error
 *    });
 *
 *    parser.on('rollover', function() {
 *
 *    });
 *
 *    parser.on('end', function(data) {
 *      // end
 *    });
 *
 *    parser.run()
 *
 *
 * @param {String} filename unified2 file to begin parsing
 * @param {Integer} options.offset starting offset in file. default == 0
 * @param {Boolean} options.skip_errors skip errors.  default == false 
 * @param {Boolean} options.tail true if parser should continue to search for events after eof is reached. default == false
 */
function Parser(filename, options) {
  var self = this;
  
  options = options || {}; 

  self.options = options;
  self.filename = filename;
  self.events = {};

  self.offset = options.offset || 0;
  var size = fs.statSync(filename).size;

  if (self.offset > size) {
    throw new Error('File size too small: requested offset ' + offset + ' but filesize is really: ' + size); 
  }

  self.fd = fs.openSync(filename, 'r'); 
  
  self.bytes_to_read = 0;
  self.buffer = null; 
  self.last_read_position = self.offset;

  self.stopped = false;
};

/** 
 * Stop the parser.
 *
 * A 'end' event is emitted when the parser is complete.
 *
 * @public
 */
Parser.prototype.stop = function() {
  var self = this;

  if (!self.stopped) {
    self.stopped = true;
    debug('stopping parser: ', self.filename);
    self._end();
  }
};

/** 
 * Tell the parser to expect data of a certain size, and when read, call the callback. Used only by parsers.
 *
 * @private
 */
Parser.prototype.expect = function(size, callback) {
  var self = this;  
  self.bytes_to_read = size;
  self.on_data = callback;
  self._read();
}

/** 
 * Tell the parser to save the last read position, and look for a new unified2 record..
 *
 * @private
 */
Parser.prototype.continue = function() {
  var self = this;
  self.last_read_position = self.offset;
  debug("Last read position: ", self.last_read_position);
  self.run();
}; 

/** 
 * Setup handlers for events.
 * e.g., parser.on('end', function() {
 *   ... end handler
 * })
 *
 * @public
 * @param {String} event event name (e.g., error, data, end)
 * @param {Function} callback callback handler
 *
 */
Parser.prototype.on = function(event, callback) {
  var self = this;
  self.events[event] = callback;
};

/** 
 * Emit an event
 *
 * @private
 * @param {String} event event name (e.g., error, data, end)
 * @param {Object} data data to emit
 *
 */
Parser.prototype.emit = function(event, data) {
  var self = this;
  data = data || null;
  if (self.events[event] && typeof self.events[event] === 'function') {
    self.events[event](data); 
  }
};

/**
 * Run the parser
 *
 */
Parser.prototype.run = function() {
  
  var self = this;
  self.last_read_position = self.offset;
  if (!self.stopped) {
    self._read_header();
  } else {
    self._end(); 
  }
};

/**
 * Parser end handler.  To be called when parser is complete.
 * @private
 */
Parser.prototype._end = function() {
  var self = this;

  if (self.watch) {
    fs.unwatchFile(self.filename);
    self.watch = null;
  }

  if (self.fd) {
    self.emit('end', { position: self.last_read_position });
    fs.close(self.fd);
    self.fd = null;
  };

};


/**
 * Called when no data is received, or count < expected count.
 * Unless `options.tail` is specified, this event will emit a 'eof' event and the parser will terminate.
 *
 * @private
 */
Parser.prototype._wait_for_data = function() {

  var self = this;

  if (typeof self.options.tail === 'undefined' || !self.options.tail) {
    debug("Received EOF");
    self._end();
    return;
  }

  self.emit('eof', { position: self.last_read_position });

  if (self.watch) {
    return; 
  }

  self.watch = fs.watchFile(self.filename, function(curr_stat, prev_stat) {

    if (self.watch) {
      fs.unwatchFile(self.filename);
      self.watch = null;
    }
   
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

/** 
 * Read Unified2RecordHeader
 *
 * @private
 */
Parser.prototype._read_header = function() {
  var self = this;
 
  self.last_read_position = this.offset;

  self.expect(definitions.Unified2RecordHeader.size, function(buffer) {
  
    var header = new definitions.Unified2RecordHeader(buffer);

    // add new Unified2 types here.
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


/** 
 * Read data from file into `this.buffer`
 * 
 * @private
 */
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
        debug("Expected " + length + " bytes, read " + count);
        self.bytes_to_read = length - count;
        self._wait_for_data(); 
      }
    }
  });
};
