
var through = require('through2'),
    split = require('split'),
    // Big = require('big.js'),
    opl = require('opl-stream');

// v - Version
// d - Deleted flag ('V' - visible or 'D' - deleted)
// c - Changeset ID
// t - Timestamp (ISO Format)
// i - User ID
// u - Username
// T - Tags
// x - Longitude (nodes only)
// y - Latitude (nodes only)
// N - Nodes (ways only)
// M - Members (relations only)

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

var typesBlacklist = function( blacklist ){
  return through.obj( function( line, _, next ){

    if( blacklist.indexOf( line[0] ) === -1 ){
      this.push( line );
    }

    next();
  });
}

var deltaEncodeInt = function( field, func ){
  var delta = 0;
  return through.obj( function( map, _, next ){

    if( !map.hasOwnProperty( field ) ) return next( null, map );

    var int = parseInt( map[field], 10 );
    map[field] = ( int - delta );
    delta = int;

    next( null, map );
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

// @MattA if you trim the float at 7 dp then it will be truly lossless - the OSM data is internally stored as integers and scaled by 10^-7 when output as floats.
var deltaEncodeFloat = function( field, precision ){
  var delta = 0, pow = Math.pow( 10, precision || 7 );
  return through.obj( function( map, _, next ){

    if( !map.hasOwnProperty( field ) ) return next( null, map );

    var int = Math.floor( parseFloat( map[field] ) * pow );
    map[field] = int - delta;
    delta = int;

    next( null, map );
  });
}

var zigzagEncodeFloat = function( field, precision ){
  var pow = Math.pow( 10, precision || 7 );
  return through.obj( function( map, _, next ){

    if( !map.hasOwnProperty( field ) ) return next( null, map );

    var int = Math.floor( parseFloat( map[field] * pow ) );
    map[field] = ( int << 1 ) ^ ( int >> 31 );

    next( null, map );
  });
}

var deltaEncodeDate = function( field ){
  var delta = 0;
  return through.obj( function( map, _, next ){

    if( !map.hasOwnProperty( field ) ) return next( null, map );

    var ut = new Date( map[field] ).getTime();
    map[field] = ut - delta;
    delta = ut;

    next( null, map );
  });
}

var deltaEncodeString = function( field ){
  var delta = '';
  return through.obj( function( map, _, next ){

    if( !map.hasOwnProperty( field ) ) return next( null, map );

    var str = map[field];
    map[field] = ( str === delta ) ? '' : str;
    delta = str;

    next( null, map );
  });
}

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

// timers
var startTime = new Date().getTime();
process.stdin.on( 'end', function(){
  var nowTime = new Date().getTime();
  console.error( 'done' );
  console.error( (( nowTime - startTime ) / 1000 ) + 's' );
})

// n204737

process.stdin
  .pipe( split() )

  .pipe( opl.decodeStream() )
  .pipe( filterDeleted )
  // .pipe( fieldsBlacklist( ['version','deleted','changeset','timestamp','user_id','username'] ) )
  // .pipe( tagsBlacklist( ['created_by','fixme','source','comment','note'] ) )
  .pipe( removeEmptyTags )

  .pipe( deltaEncodeInt( 'node_id' ) )
  .pipe( deltaEncodeInt( 'way_id' ) )
  .pipe( deltaEncodeInt( 'relation_id' ) )

  .pipe( zigzagEncodeFloat( 'latitude' ) )
  .pipe( zigzagEncodeFloat( 'longitude' ) )
  .pipe( deltaEncodeInt( 'latitude' ) )
  .pipe( deltaEncodeInt( 'longitude' ) )

  .pipe( deltaEncodeDate( 'timestamp' ) )
  .pipe( deltaEncodeInt( 'user_id' ) )
  .pipe( deltaEncodeInt( 'changeset' ) )
  .pipe( deltaEncodeString( 'username' ) )

  .pipe( deltaEncodeNodeRefs )
  .pipe( opl.encodeStream() )

  .pipe( process.stdout );
