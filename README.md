# Unified2

A small library for unified2 parsing in node.js.  Unified2 is a common output 
format for network intrusion detection devices such as Snort + Suricata.

See Sourcefire's documentation for the unified2 protocol: http://manual.snort.org/node44.html

## Installation

```
$ npm install unified2 
 ```

## Usage

### Example

```js
var unified2 = require('unified2');
parser = new unified2unified2.Parser('unified2.alert.14560142132', { offset: 0 });

parser.on('data', function(data) {
  // event data...
});

parser.on('error', function(error) {
  // error
});

parser.on('eof', function() {
  // triggered when an EOF (no data is received).  Useful to save a bookmark
  // when you are running in tail mode (see below).

});

parser.on('rollover', function() {
  // triggered when a rollover is detected (the file shrinks in size)
});

parser.on('end', function(data) {
  // triggered when parser ends (e.g., out of data)
});

parser.run()
```
### Tailing a file

It is often useful to wait for more data as the file is being written, e.g. by a Snort sensor.

Simply pass `tail: true` in the options for the parser to wait for more logs, e.g.:

```js
var unified2 = require('unified2');
parser = new unified2.Parser('unified2.alert.14560142132', { offset: 0, tail: true });
...
parser.run();
```

To stop the parser, you can do `parser.stop()` which will trigger an end event.

### Bookmark

To read the current bookmark, you can use `parser.last_read_position`,
which is the offset after the last read unified2 event. Useful after a 'nodata'
event or 'end' event if you wish to resume parsing again later,
you can pass this into the `offset: <value>` parameter in the Parser
constructor.

### Debug logging

pass in `DEBUG=unified2` as an environment variable to turn on debug logging.

## Is it fast? This is javascript after all.

Pretty fast!  IO is async too, so by parallelizing parsers you can increase performance.

Here's reading ~4.6 MB and writing parsed objects (~34MB) to stdout.

```
unified2 (master*) $ time node tests/test.js > /tmp/test.js.output                                                                                                                                                                ~/src/unified2
node tests/test.js > /tmp/test.js  12.16s user 0.84s system 103% cpu 12.621 total
```
## Missing?

Right now, this is just a bare bones parser. E.g., the pcaps and extra data 
are not correlated with the ids event messages.  This is intentional.  

I'll be releasing a nice utility that does this, plus all of the fancy stuff 
like monitor directories with blob support with output plugins similar 
to Barnyard2 in the very near future.

## Bug Reporting

Please use Github or email support@threatstack.com.  

## License

Copyright (C) 2013 Threat Stack, Inc (https://www.threatstack.com) 

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.


