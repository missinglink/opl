
function encode(){
  var index = function( data ){
    var time = new Date( data ).getTime(),
        result = time - index.delta;
    index.delta = time;
    return result;
  }
  index.delta = 0;
  return index;
}

function decode(){
  var index = function( data ){
    var time = parseInt( data, 10 ) + ( index.delta || 0 ),
        result = new Date( time ).toISOString().replace('.000Z','Z');
    index.delta = time;
    return result;
  }
  index.delta = 0;
  return index;
}

module.exports.encode = encode;
module.exports.decode = decode;
