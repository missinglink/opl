
var algo = require('../../lib/delta_date');

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

    t.equal( index('2015-07-09T09:46:58Z'), 1436435218000, 'field' );
    t.equal( index.delta, 1436435218000, 'delta' );

    t.equal( index('2015-07-10T09:46:58Z'), 86400000, 'field' );
    t.equal( index.delta, 1436521618000, 'delta' );

    t.equal( index('2015-07-08T09:46:58Z'), -172800000, 'field' );
    t.equal( index.delta, 1436348818000, 'delta' );

    t.end();
  });
};

module.exports.tests.decode = function(test) {
  test('decode', function(t) {

    var index = algo.decode();

    t.equal( index(1436435218000), '2015-07-09T09:46:58Z', 'field' );
    t.equal( index.delta, 1436435218000, 'delta' );

    t.equal( index(86400000), '2015-07-10T09:46:58Z', 'field' );
    t.equal( index.delta, 1436521618000, 'delta' );

    t.equal( index(-172800000), '2015-07-08T09:46:58Z', 'field' );
    t.equal( index.delta, 1436348818000, 'delta' );

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('delta_date: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
