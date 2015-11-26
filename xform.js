
var through = require('through2'),
    split = require('split'),
    // Big = require('big.js'),
    opl = require('opl-stream'),
    delta = require('./lib/delta'),
    zigzag = require('./lib/zigzag'),
    misc = require('./lib/misc');

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

// timers
// var startTime = new Date().getTime();
// process.stdin.on( 'end', function(){
//   var nowTime = new Date().getTime();
//   console.error( 'done' );
//   console.error( (( nowTime - startTime ) / 1000 ) + 's' );
// })

// n204737

// compress
process.stdin
  .pipe( split() )

  .pipe( opl.decodeStream() )
  .pipe( misc.removeEmptyTags )

  .pipe( delta.int.encode( 'node_id' ) )
  .pipe( delta.int.encode( 'way_id' ) )
  .pipe( delta.int.encode( 'relation_id' ) )

  .pipe( delta.int.encode( 'latitude' ) )
  .pipe( delta.int.encode( 'longitude' ) )

  .pipe( zigzag.float.encode( 'latitude' ) )
  .pipe( zigzag.float.encode( 'longitude' ) )

  .pipe( delta.date.encode( 'timestamp' ) )
  .pipe( delta.int.encode( 'user_id' ) )
  .pipe( delta.int.encode( 'changeset' ) )
  .pipe( delta.string.encode( 'username' ) )

  .pipe( misc.deltaEncodeNodeRefs )
  .pipe( opl.encodeStream() )

  .pipe( process.stdout );
