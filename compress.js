
var split = require('split'),
    through = require('through2'),
    opl = require('opl-stream'),
    delta = require('./lib/delta'),
    zigzag = require('./lib/zigzag'),
    precision = require('./lib/precision'),
    misc = require('./lib/misc');

var encoders = {
  latitude:     [ precision.encode(), delta.int.encode(), zigzag.encode() ],
  longitude:    [ precision.encode(), delta.int.encode(), zigzag.encode() ],
  node_id:      [ delta.int.encode(), zigzag.encode() ],
  way_id:       [ delta.int.encode(), zigzag.encode() ],
  relation_id:  [ delta.int.encode(), zigzag.encode() ],
  user_id:      [ delta.int.encode(), zigzag.encode() ],
  changeset:    [ delta.int.encode(), zigzag.encode() ],
  deleted:      [ delta.string.encode() ],
  username:     [ delta.string.encode() ],
  timestamp:    [ delta.date.encode() ],
};

// compress
process.stdin
  .pipe( split() )

  .pipe( opl.decodeStream() )
  // .pipe( misc.removeEmptyTags )

  // run all encoders on all fields
  .pipe( through.obj( function( obj, _, next ){
    for( var field in encoders ){
      if( !obj.hasOwnProperty( field ) ) continue;
      encoders[ field ].forEach( function( encoder ){
        obj[ field ] = encoder( obj[ field ] );
      });
    }
    next( null, obj );
  }))

  .pipe( misc.deltaEncodeNodeRefs )
  .pipe( opl.encodeStream() )

  .pipe( process.stdout );
