
var through = require('through2');

function encode( field ){
  var delta = 0;
  return through.obj( function( obj, _, next ){

    if( !obj.hasOwnProperty( field ) ) return next( null, obj );

    var time = new Date( obj[field] ).getTime();
    obj[field] = time - delta;
    delta = time;

    next( null, obj );
  });
}

function decode( field ){
  var delta = 0;
  return through.obj( function( obj, _, next ){

    if( !obj.hasOwnProperty( field ) ) return next( null, obj );

    var time = new Date( parseInt( obj[field], 10 ) + delta );
    obj[field] = time.toISOString().replace('.000Z','Z');
    delta = time.getTime();

    next( null, obj );
  });
}

module.exports.encode = encode;
module.exports.decode = decode;
