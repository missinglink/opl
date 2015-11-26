
var algo = require('../../lib/delta_string');

module.exports.tests = {};

module.exports.tests.interface = function(test) {
  test('valid interface', function(t) {
    t.equal(typeof algo, 'object', 'valid exports');
    t.equal(typeof algo.encode, 'function', 'valid function');
    t.equal(typeof algo.decode, 'function', 'valid function');
    t.end();
  });
};

module.exports.tests.encode = function(test) {
  test('encode', function(t) {

    var index = algo.encode();

    t.equal( index('example1'), 'example1', 'field' );
    t.equal( index.delta, 'example1', 'delta' );

    t.equal( index('example2'), 'example2', 'field' );
    t.equal( index.delta, 'example2', 'delta' );

    t.equal( index('example2'), '', 'field' );
    t.equal( index.delta, 'example2', 'delta' );

    t.end();
  });
};

module.exports.tests.decode = function(test) {
  test('decode', function(t) {

    var index = algo.decode();

    t.equal( index('example1'), 'example1', 'field' );
    t.equal( index.delta, 'example1', 'delta' );

    t.equal( index('example2'), 'example2', 'field' );
    t.equal( index.delta, 'example2', 'delta' );

    t.equal( index(''), 'example2', 'field' );
    t.equal( index.delta, 'example2', 'delta' );

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('delta_string: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
