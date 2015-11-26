
var through = require('through2');

var filterDeleted = through.obj( function( map, _, next ){
  if( map.deleted !== 'D' ){
    this.push( map );
  }
  next();
});

var removeEmptyTags = through.obj( function( map, _, next ){
  if( map.hasOwnProperty('tags') && !Object.keys( map.tags ).length ){
    delete map.tags;
  }
  next( null, map );
});

var deltaEncodeNodeRefs = through.obj( function( map, _, next ){
  if( Array.isArray( map.nodes ) ){
    var delta = 0, encoded = [];
    map.nodes.forEach( function( node ){
      encoded.push( node - delta );
      delta = node;
    });
    map.nodes = encoded;
  }
  next( null, map );
});

var deltaDecodeNodeRefs = through.obj( function( map, _, next ){
  if( Array.isArray( map.nodes ) ){
    var delta = 0, encoded = [];
    map.nodes.forEach( function( node ){
      var sum = parseInt( node, 10 ) + parseInt( delta, 10 );
      encoded.push( sum );
      delta = sum;
    });
    map.nodes = encoded;
  }
  next( null, map );
});

var typesBlacklist = function( blacklist ){
  return through.obj( function( line, _, next ){

    if( blacklist.indexOf( line[0] ) === -1 ){
      this.push( line );
    }

    next();
  });
}

// var deltaEncodeFloat = function( field, precision ){
//   var delta = new Big(0), precision = precision || 7;
//   return through.obj( function( map, _, next ){
//
//     if( !map.hasOwnProperty( field ) ) return next( null, map );
//
//     var float = new Big( map[field] ).times( Math.pow( 10, precision ) ).round();
//     map[field] = float.minus( delta );
//     delta = float;
//
//     next( null, map );
//   });
// }

var fieldsBlacklist = function( blacklist ){
  return through.obj( function( map, _, next ){
    blacklist.forEach( function( field ){
      delete map[ field ];
    });
    next( null, map );
  });
}

var tagsBlacklist = function( blacklist ){
  return through.obj( function( map, _, next ){
    for( var key in map.tags ){
      if( blacklist.indexOf( key.toLowerCase() ) > -1 ){
        delete map.tags[ key ];
      }
    }
    next( null, map );
  });
}

module.exports.filterDeleted = filterDeleted;
module.exports.removeEmptyTags = removeEmptyTags;
module.exports.deltaEncodeNodeRefs = deltaEncodeNodeRefs;
module.exports.deltaDecodeNodeRefs = deltaDecodeNodeRefs;
module.exports.typesBlacklist = typesBlacklist;
module.exports.fieldsBlacklist = fieldsBlacklist;
module.exports.tagsBlacklist = tagsBlacklist;
