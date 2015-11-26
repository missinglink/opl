
// @MattA if you trim the float at 7 dp then it will be truly lossless - the OSM data is internally stored as integers and scaled by 10^-7 when output as floats.
var precision = Math.pow(10,7);

function encode(){
  return function( data ){
    return Math.round( parseFloat( data ) * precision );
  }
}

function decode(){
  return function( data ){
    return parseInt( data, 10 ) / precision;
  }
}

module.exports.encode = encode;
module.exports.decode = decode;
