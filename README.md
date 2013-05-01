# Unified2

A small library for unified2 parsing in node.js.  

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
parser = new unified2unified2.Parser('unified2.alert.14560142132', { offset: 0, tail: true });
...
parser.run();
```

To stop the parser, you can do `parser.stop()` which will trigger an end event.

### Debug logging

pass in `DEBUG=unified2` as an environment variable to turn on debug logging.

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


