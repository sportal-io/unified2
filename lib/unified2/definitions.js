var _types = require('./types');
var ref = require('ref');
var StructType = require('ref-struct');
var UnionType = require('ref-union');
var ArrayType = require('ref-array');
var debug = require('debug')('unified2');

var uint32_t = _types.uint32_be;
var uint16_t = _types.uint16_be;
var uint8_t = ref.types.uint8;


var in6addr_t = UnionType({
  u6_addr8: ArrayType(uint8_t, 16),
  u6_addr16: ArrayType(uint16_t, 8),
  u6_addr32: ArrayType(uint32_t, 4),
  u6_addr_string: _types.ip6addr_string
});

exports.linktypes = {
    LINKTYPE_ETHERNET: 1,
    LINKTYPE_NULL: 0,
    LINKTYPE_RAW: 12,
    LINKTYPE_IEEE802_11_RADIO: 127,
    LINKTYPE_LINUX_SLL: 113,

};

exports.typedefs = {
  UNIFIED2_EVENT: 1,
  UNIFIED2_PACKET: 2,
  UNIFIED2_IDS_EVENT_LEGACY: 7,
  UNIFIED2_IDS_EVENT_IPV6_LEGACY: 72,
  UNIFIED2_IDS_EVENT_MPLS: 99,
  UNIFIED2_IDS_EVENT_IPV6_MPLS: 100,
  UNIFIED2_IDS_EVENT: 104,
  UNIFIED2_IDS_EVENT_IPV6: 105,
  UNIFIED2_EXTRA_DATA: 110
};

/* typedef struct _Unified2RecordHeader {
    uint32_t type;
    uint32_t length;
} Unified2RecordHeader;

*/
exports.Unified2RecordHeader = StructType({
  type: uint32_t,
  length: uint32_t 
});

/* typedef struct _Unified2IDSEvent {
    uint32_t sensor_id;
    uint32_t event_id;
    uint32_t event_second;
    uint32_t event_microsecond;
    uint32_t signature_id;
    uint32_t generator_id;
    uint32_t signature_revision;
    uint32_t classification_id;
    uint32_t priority_id;
    uint32_t source_ip;
    uint32_t destination_ip;
    uint16_t sport_itype;
    uint16_t dport_icode;
    uint8_t  protocol;
    uint8_t  impact_flag;//overloads packet_action
    uint8_t  impact;
    uint8_t  blocked;
    uint32_t mpls_label;
    uint16_t vlanId;
    uint16_t pad2;//Policy ID
} Unified2IDSEvent;
*/

exports.Unified2IDSEvent = StructType({
    sensor_id: uint32_t,
    event_id: uint32_t,
    event_second: uint32_t,
    event_microsecond: uint32_t,
    signature_id: uint32_t,
    generator_id: uint32_t,
    signature_revision: uint32_t,
    classification_id: uint32_t,
    priority_id: uint32_t,
    source_ip: uint32_t,
    destination_ip: uint32_t,
    source_port: uint16_t,
    dest_port: uint16_t,
    protocol: uint8_t,
    impact_flag: uint8_t,//overloads packet_action
    impact: uint8_t,
    blocked: uint8_t,
    mpls_label: uint32_t,
    vlanId: uint16_t,
});

/*typedef struct Unified2IDSEvent_legacy
{
    uint32_t sensor_id;
    uint32_t event_id;
    uint32_t event_second;
    uint32_t event_microsecond;
    uint32_t signature_id;
    uint32_t generator_id;
    uint32_t signature_revision;
    uint32_t classification_id;
    uint32_t priority_id;
    uint32_t source_ip;
    uint32_t destination_ip;
    uint16_t sport_itype;
    uint16_t dport_icode;
    uint8_t  protocol;
    uint8_t  impact_flag;//sets packet_action
    uint8_t  impact;
    uint8_t  blocked;
} Unified2IDSEvent_legacy;
*/


exports.Unified2IDSEventLegacy = StructType({
    sensor_id: uint32_t,
    event_id: uint32_t,
    event_second: uint32_t,
    event_microsecond: uint32_t,
    signature_id: uint32_t,
    generator_id: uint32_t,
    signature_revision: uint32_t,
    classification_id: uint32_t,
    priority_id: uint32_t,
    source_ip: uint32_t,
    destination_ip: uint32_t,
    source_port: uint16_t,
    dest_port: uint16_t,
    protocol: uint8_t,
    impact_flag: uint8_t,//overloads packet_action
    impact: uint8_t,
    blocked: uint8_t,
});

/*
typedef struct _Unified2EventCommon {
    uint32_t sensor_id;
    uint32_t event_id;
    uint32_t event_second;
    uint32_t event_microsecond;
    uint32_t signature_id;
    uint32_t generator_id;
    uint32_t signature_revision;
    uint32_t classification_id;
    uint32_t priority_id;
} Unified2EventCommon; 
*/

exports.Unified2EventCommon = StructType({
  sensor_id: uint32_t,
  event_id: uint32_t,
  event_second: uint32_t,
  event_microsecond: uint32_t,
  signature_id: uint32_t,
  generator_id: uint32_t,
  signature_revision: uint32_t,
  classification_id: uint32_t,
  priority_id: uint32_t
});


/* typedef struct _Unified2IDSEventIPv6
{
    uint32_t sensor_id;
    uint32_t event_id;
    uint32_t event_second;
    uint32_t event_microsecond;
    uint32_t signature_id;
    uint32_t generator_id;
    uint32_t signature_revision;
    uint32_t classification_id;
    uint32_t priority_id;
    struct in6_addr source_ip;
    struct in6_addr destination_ip;
    uint16_t sport_itype;
    uint16_t dport_icode;
    uint8_t  protocol;
    uint8_t  impact_flag;
    uint8_t  impact;
    uint8_t  blocked;
    uint32_t mpls_label;
    uint16_t vlanId;
    uint16_t pad2;//could be IPS Policy local id to support local sensor alerts
} Unified2IDSEventIPv6;
**/

exports.Unified2IDSEventIPv6 = StructType({
  sensor_id: uint32_t,
  event_id: uint32_t,
  event_second: uint32_t,
  event_microsecond: uint32_t,
  signature_id: uint32_t,
  generator_id: uint32_t,
  signature_revision: uint32_t,
  classification_id: uint32_t,
  priority_id: uint32_t,
  source_ip: in6addr_t,
  destination_ip: in6addr_t,
  source_port: uint16_t,
  dest_port: uint16_t,
  protocol: uint8_t,
  impact_flag: uint8_t,
  impact: uint8_t,
  blocked: uint8_t,
  mpls_label: uint32_t,
  vlanId: uint16_t,
  pad2: uint16_t
});

/*
typedef struct Unified2IDSEventIPv6_legacy
{
    uint32_t sensor_id;
    uint32_t event_id;
    uint32_t event_second;
    uint32_t event_microsecond;
    uint32_t signature_id;
    uint32_t generator_id;
    uint32_t signature_revision;
    uint32_t classification_id;
    uint32_t priority_id;
    struct in6_addr source_ip;
    struct in6_addr destination_ip;
    uint16_t sport_itype;
    uint16_t dport_icode;
    uint8_t  protocol;
    uint8_t  impact_flag;
    uint8_t  impact;
    uint8_t  blocked;
} Unified2IDSEventIPv6_legacy;
*/

exports.Unified2IDSEventIPv6Legacy = StructType({
  sensor_id: uint32_t,
  event_id: uint32_t,
  event_second: uint32_t,
  event_microsecond: uint32_t,
  signature_id: uint32_t,
  generator_id: uint32_t,
  signature_revision: uint32_t,
  classification_id: uint32_t,
  priority_id: uint32_t,
  source_ip: in6addr_t,
  destination_ip: in6addr_t,
  source_port: uint16_t,
  dest_port: uint16_t,
  protocol: uint8_t,
  impact_flag: uint8_t,
  impact: uint8_t,
  blocked: uint8_t
});

/*
//UNIFIED2_PACKET = type 2
typedef struct _Unified2Packet
{
    uint32_t sensor_id;
    uint32_t event_id;
    uint32_t event_second;
    uint32_t packet_second;
    uint32_t packet_microsecond;
    uint32_t linktype;
    uint32_t packet_length;
    uint8_t packet_data[4];   
} Unified2Packet;
*/

exports.Unified2Packet = StructType({
  sensor_id: uint32_t,
  event_id: uint32_t,
  event_second: uint32_t,
  packet_second: uint32_t,
  packet_microsecond: uint32_t,
  linktype: uint32_t,
  packet_length: uint32_t,
  packet_data: ArrayType(uint8_t, 4)
});

/*
//UNIFIED2_EXTRA_DATA - type 110
typedef struct _Unified2ExtraData{
    uint32_t sensor_id;
    uint32_t event_id;
    uint32_t event_second;
    uint32_t type;              
    uint32_t data_type;        
    uint32_t blob_length;     
} Unified2ExtraData
*/


exports.Unified2ExtraData = StructType({
  event_type: uint32_t,
  event_length: uint32_t,
  sensor_id: uint32_t,
  event_id: uint32_t,
  event_second: uint32_t,
  type: uint32_t,              
  data_type: uint32_t,        
  blob_length: uint32_t
});
