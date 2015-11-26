
var through = require('through2');

// @MattA if you trim the float at 7 dp then it will be truly lossless - the OSM data is internally stored as integers and scaled by 10^-7 when output as floats.
function encode( field, precision ){
  var delta = 0, pow = Math.pow( 10, precision || 7 );
  return through.obj( function( obj, _, next ){

    if( !obj.hasOwnProperty( field ) ) return next( null, obj );

    var int = Math.floor( parseFloat( obj[field] ) * pow );
    obj[field] = int - delta;
    delta = int;

    next( null, obj );
  });
}

function decode( field, precision ){
  var delta = 0, pow = Math.pow( 10, precision || 7 );
  return through.obj( function( obj, _, next ){

    if( !obj.hasOwnProperty( field ) ) return next( null, obj );

    var int = parseInt( obj[field] );
    obj[field] = Math.floor( ( int + delta ) / pow );
    delta = ( int + delta );

    next( null, obj );
  });
}

module.exports.encode = encode;
module.exports.decode = decode;
