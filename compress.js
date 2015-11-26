
var split = require('split'),
    opl = require('opl-stream'),
    delta = require('./lib/delta'),
    zigzag = require('./lib/zigzag'),
    misc = require('./lib/misc');

// compress
process.stdin
  .pipe( split() )

  .pipe( opl.decodeStream() )
  .pipe( misc.removeEmptyTags )

  .pipe( delta.int.encode( 'node_id' ) )
  .pipe( delta.int.encode( 'way_id' ) )
  .pipe( delta.int.encode( 'relation_id' ) )

  .pipe( zigzag.float.encode( 'latitude' ) )
  .pipe( zigzag.float.encode( 'longitude' ) )
  .pipe( delta.int.encode( 'latitude' ) )
  .pipe( delta.int.encode( 'longitude' ) )

  .pipe( delta.date.encode( 'timestamp' ) )
  .pipe( delta.int.encode( 'user_id' ) )
  .pipe( delta.int.encode( 'changeset' ) )
  .pipe( delta.string.encode( 'username' ) )

  .pipe( misc.deltaEncodeNodeRefs )
  .pipe( opl.encodeStream() )

  .pipe( process.stdout );
