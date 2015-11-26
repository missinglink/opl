
var through = require('through2');

function encode( field ){
  var delta = '';
  return through.obj( function( obj, _, next ){

    if( !obj.hasOwnProperty( field ) ) return next( null, obj );

    var str = obj[field];
    obj[field] = ( str === delta ) ? '' : str;
    delta = str;

    next( null, obj );
  });
}

function decode( field ){
  var delta = '';
  return through.obj( function( obj, _, next ){

    if( !obj.hasOwnProperty( field ) ) return next( null, obj );

    var str = obj[field];


    if( str === '' ){
      obj[field] = delta;
    }
    else {
      obj[field] = str;
      delta = str;
    }

    next( null, obj );
  });
}

module.exports.encode = encode;
module.exports.decode = decode;
