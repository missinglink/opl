
function encode(){
  var index = function( data ){
    var int = parseInt( data, 10 ),
        result = int - index.delta;
    index.delta = int;
    return result;
  }
  index.delta = 0;
  return index;
}

function decode(){
  var index = function( data ){
    var int = parseInt( data, 10 ),
        result = ( int + index.delta );
    index.delta = ( int + index.delta );
    return result;
  }
  index.delta = 0;
  return index;
}

module.exports.encode = encode;
module.exports.decode = decode;
