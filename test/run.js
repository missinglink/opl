
var tape = require('tape');
var common = {};

var tests = [
  require('./index.js'),
  require('./lib/delta_date.js'),
  require('./lib/delta_string.js'),
  require('./lib/precision.js'),
  require('./lib/delta_int.js'),
  require('./lib/zigzag.js')
];

tests.map(function(t) {
  t.all(tape, common);
});
