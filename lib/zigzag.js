
function encode(){
  return function( data ){
    var int = parseInt( data, 10 );
    return ( int << 1 ) ^ ( int >> 31 );
  }
}

function decode(){
  return function( data ){
    var int = parseInt( data, 10 );
    //obj[field] = ( value >> 1 ) ^ ( ~( value & 1 ) + 1 )
    return ( int >> 1 ) - ( int &1 ) * int;
  }
}

module.exports.encode = encode;
module.exports.decode = decode;
