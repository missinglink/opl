
var through = require('through2');

var zigzagEncodeFloat = function( field, precision ){
  var pow = Math.pow( 10, precision || 7 );
  return through.obj( function( obj, _, next ){

    if( !obj.hasOwnProperty( field ) ) return next( null, obj );

    var int = Math.floor( parseFloat( obj[field] * pow ) );
    obj[field] = ( int << 1 ) ^ ( int >> 31 );

    next( null, obj );
  });
}

var zigzagDecodeFloat = function( field, precision ){
  var pow = Math.pow( 10, precision || 7 );
  return through.obj( function( obj, _, next ){

    if( !obj.hasOwnProperty( field ) ) return next( null, obj );

    var int = parseInt( obj[field], 10 );
    decode = ( int >> 1 ) - ( int &1 ) * int;
    // try  value >> 1 ) ^ ( ~( value & 1 ) + 1 )
    obj[field] = Math.floor( decode / pow )

    next( null, obj );
  });
}

module.exports.float = {
  encode: zigzagEncodeFloat,
  decode: zigzagDecodeFloat
};
