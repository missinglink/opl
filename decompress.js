
var split = require('split'),
    through = require('through2'),
    opl = require('opl-stream'),
    delta = require('./lib/delta'),
    zigzag = require('./lib/zigzag'),
    precision = require('./lib/precision'),
    misc = require('./lib/misc');

var decoders = {
  latitude:     [ zigzag.decode(), delta.int.decode(), precision.decode() ],
  longitude:    [ zigzag.decode(), delta.int.decode(), precision.decode() ],
  node_id:      [ zigzag.decode(), delta.int.decode() ],
  way_id:       [ zigzag.decode(), delta.int.decode() ],
  relation_id:  [ zigzag.decode(), delta.int.decode() ],
  user_id:      [ zigzag.decode(), delta.int.decode() ],
  changeset:    [ zigzag.decode(), delta.int.decode() ],
  deleted:      [ delta.string.decode() ],
  username:     [ delta.string.decode() ],
  timestamp:    [ delta.date.decode() ],
};

// decompress
process.stdin
  .pipe( split() )

  .pipe( opl.decodeStream() )
  // .pipe( misc.removeEmptyTags )

  // run all decoders on all fields
  .pipe( through.obj( function( obj, _, next ){
    for( var field in decoders ){
      if( !obj.hasOwnProperty( field ) ) continue;
      decoders[ field ].forEach( function( decoder ){
        obj[ field ] = decoder( obj[ field ] );
      });
    }
    next( null, obj );
  }))

  .pipe( misc.deltaDecodeNodeRefs )
  .pipe( opl.encodeStream() )

  .pipe( process.stdout );
