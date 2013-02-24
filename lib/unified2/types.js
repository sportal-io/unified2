var ref = require('ref');
var StructType = require('ref-struct');
var ip = require('ip');
/**
 * The `int16` type.
 */

exports.int16_be = {
    size: ref.sizeof.int16
  , indirection: 1
  , get: function get (buf, offset) {
      return buf['readInt16BE'](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeInt16BE'](val, offset || 0)
    }
}

/**
 * The `uint16` type.
 */

exports.uint16_be = {
    size: ref.sizeof.uint16
  , indirection: 1
  , alignment: ref.types.uint16.alignment
  , get: function get (buf, offset) {
      return buf['readUInt16BE'](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeUInt16BE'](val, offset || 0)
    }
}

/**
 * The `int32` type.
 */

exports.int32_be = {
    size: ref.sizeof.int32
  , indirection: 1
  , alignment: ref.types.int32.alignment
  , get: function get (buf, offset) {
      console.log("READING: at offset", offset);
      return buf['readInt32BE'](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeInt32BE'](val, offset || 0)
    }
}

/**
 * The `uint32` type.
 */

exports.uint32_be = {
    size: ref.sizeof.uint32
  , indirection: 1
  , alignment: ref.types.uint32.alignment
  , get: function get (buf, offset) {
      return buf['readUInt32BE'](offset || 0)
    }
  , set: function set (buf, offset, val) {
      return buf['writeUInt32BE'](val, offset || 0)
    }
}

exports.ip6addr_string = {
    size: 16 
  , indirection: 1
  , alignment: 4 
  , get: function get (buf, offset) {
      return ip.toString(buf, offset || 0, this.size);
    }
  , set: function set (buf, offset, val) {
      return ip.toBuffer(val, buf, offset || 0); 
    }
}


