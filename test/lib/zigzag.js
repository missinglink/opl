
var algo = require('../../lib/zigzag');

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

    t.equal( index(0), 0, 'field' );
    t.equal( index(-1), 1, 'field' );
    t.equal( index(1), 2, 'field' );
    t.equal( index(-2), 3, 'field' );
    t.equal( index(2147483647), 4294967294, 'field' );
    t.equal( index(-2147483648), 4294967295, 'field' );

    t.end();
  });
};

module.exports.tests.decode = function(test) {
  test('decode', function(t) {

    var index = algo.decode();

    t.equal( index(0), 0, 'field' );
    t.equal( index(1), -1, 'field' );
    t.equal( index(2), 1, 'field' );
    t.equal( index(3), -2, 'field' );
    t.equal( index(4294967294), 2147483647, 'field' );
    t.equal( index(4294967295), -2147483648, 'field' );

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('zigzag: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
