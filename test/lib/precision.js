
var algo = require('../../lib/precision');

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

    t.equal( index(100.1), 1001000000, 'field' );
    t.equal( index(100.255), 1002550000, 'field' );
    t.equal( index(0), 0, 'field' );
    t.equal( index(99.1), 991000000, 'field' );

    t.end();
  });
};

module.exports.tests.decode = function(test) {
  test('decode', function(t) {

    var index = algo.decode();

    t.equal( index(1001000000), 100.1, 'field' );
    t.equal( index(1002550000), 100.255, 'field' );
    t.equal( index(0), 0, 'field' );
    t.equal( index(991000000), 99.1, 'field' );

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('precision: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
