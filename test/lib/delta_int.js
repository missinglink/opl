
var algo = require('../../lib/delta_int');

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

    t.equal( index(100), 100, 'field' );
    t.equal( index.delta, 100, 'delta' );

    t.equal( index(101), 1, 'field' );
    t.equal( index.delta, 101, 'delta' );

    t.equal( index(101), 0, 'field' );
    t.equal( index.delta, 101, 'delta' );

    t.equal( index(99), -2, 'field' );
    t.equal( index.delta, 99, 'delta' );

    t.end();
  });
};

module.exports.tests.decode = function(test) {
  test('decode', function(t) {

    var index = algo.decode();

    t.equal( index(100), 100, 'field' );
    t.equal( index.delta, 100, 'delta' );

    t.equal( index(1), 101, 'field' );
    t.equal( index.delta, 101, 'delta' );

    t.equal( index(0), 101, 'field' );
    t.equal( index.delta, 101, 'delta' );

    t.equal( index(-2), 99, 'field' );
    t.equal( index.delta, 99, 'delta' );

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('delta_int: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
