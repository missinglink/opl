
var split = require('split'),
    opl = require('opl-stream'),
    delta = require('./lib/delta'),
    zigzag = require('./lib/zigzag'),
    misc = require('./lib/misc');

// compress
process.stdin
  .pipe( split() )

  .pipe( opl.decodeStream() )
  // .pipe( misc.removeEmptyTags )

  .pipe( delta.int.decode( 'node_id' ) )
  .pipe( delta.int.decode( 'way_id' ) )
  .pipe( delta.int.decode( 'relation_id' ) )

  .pipe( zigzag.float.decode( 'latitude' ) )
  .pipe( zigzag.float.decode( 'longitude' ) )
  .pipe( delta.int.decode( 'latitude' ) )
  .pipe( delta.int.decode( 'longitude' ) )

  .pipe( delta.date.decode( 'timestamp' ) )
  .pipe( delta.int.decode( 'user_id' ) )
  .pipe( delta.int.decode( 'changeset' ) )
  .pipe( delta.string.decode( 'username' ) )

  // .pipe( misc.deltaEncodeNodeRefs )
  .pipe( opl.encodeStream() )

  .pipe( process.stdout );
