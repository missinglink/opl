
function encode(){
  var index = function( data ){
    var result = ( data == index.delta ) ? 'Δ' : data;
    index.delta = data;
    return result;
  }
  index.delta = '';
  return index;
}

function decode(){
  var index = function( data ){
    if( data !== 'Δ' ) index.delta = data;
    return index.delta;
  }
  index.delta = '';
  return index;
}

module.exports.encode = encode;
module.exports.decode = decode;
