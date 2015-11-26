
var Long = require('long'),
    zero = Long.fromInt(0);

function encode(){
  return function( data ){

    // 32bit
    // var int = parseInt( data, 10 );
    // return ( int << 1 ) ^ ( int >> 63 );

    // 64bit
    // (low << 1) ^ (high >> 31)
    var lon = Long.fromInt( data );
    var low = Long.fromInt( lon.low, false );
    var high = Long.fromInt( lon.high, false );
    return parseInt( low.shiftLeft(1).xor( high.shiftRight(63) ).toString(), 10 );
  }
}

function decode(){
  return function( data ){

    // 32bit
    // var int = parseInt( data, 10 );
    // return ( int >> 1 ) - ( int &1 ) * int;

    // 64bit
    // (high << 31) ^ (low >>> 1) ^ -(low & 1)
    var lon = Long.fromInt( data );
    var low = Long.fromInt( lon.low, false );
    var high = Long.fromInt( lon.high, false );
    return parseInt( high.shiftLeft(31).xor( low.shiftRight(1) ).xor( zero.subtract( low.and(1) ) ).toString(), 10 );
  }
}

module.exports.encode = encode;
module.exports.decode = decode;
