
var through = require('through2');

function encode( field ){
  var delta = 0;
  return through.obj( function( obj, _, next ){

    if( !obj.hasOwnProperty( field ) ) return next( null, obj );

    var int = parseInt( obj[field], 10 );
    obj[field] = ( int - delta );
    delta = int;

    next( null, obj );
  });
}

function decode( field ){
  var delta = 0;
  return through.obj( function( obj, _, next ){

    if( !obj.hasOwnProperty( field ) ) return next( null, obj );

    var int = parseInt( obj[field], 10 );
    obj[field] = ( int + delta );
    delta = ( int + delta );

    next( null, obj );
  });
}

module.exports.encode = encode;
module.exports.decode = decode;
