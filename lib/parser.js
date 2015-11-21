
// http://docs.osmcode.org/opl-file-format-manual/

var through = require('through2');

var KEYMAP = {
  'n': 'node_id',
  'w': 'way_id',
  'r': 'relation_id',
  'v': 'version', // Version
  'd': 'deleted', // Deleted flag ('V' - visible or 'D' - deleted)
  'c': 'changeset', // Changeset ID
  't': 'timestamp', // Timestamp (ISO Format)
  'i': 'user_id', // User ID
  'u': 'username', // Username
  'T': 'tags', // Tags
  'x': 'longitude', // Longitude (nodes only)
  'y': 'latitude', // Latitude (nodes only)
  'N': 'nodes', // Nodes (ways only)
  'M': 'members' // Members (relations only)
}

var INVERSE_KEYMAP = {}
for( var key in KEYMAP ) INVERSE_KEYMAP[ KEYMAP[ key ] ] = key;

var decodeStream = function( opts ){
  opts = opts || {};
  return through.obj( function( buf, enc, next ){

    var line = buf.toString('utf8');
    if( !line.length ) return next();

    var map = expandLine( line );

    // expand tags
    if( map.hasOwnProperty('tags') ) map.tags = expandTags( map.tags );

    // expand way refs
    if( map.hasOwnProperty('nodes') ) map.nodes = expandNodeRefs( map.nodes );

    // unescape strings
    if( map.hasOwnProperty('username') ) map.username = unescape( map.username );

    // if( opts.cast ){
    //   // booleans
    //   if( map.hasOwnProperty('deleted') ) map.deleted = ( map.deleted === 'D' );
    //
    //   // integers
    //   if( map.hasOwnProperty('node_id') ) map.node_id = parseInt( map.node_id, 10 );
    //   if( map.hasOwnProperty('way_id') ) map.way_id = parseInt( map.way_id, 10 );
    //   if( map.hasOwnProperty('relation_id') ) map.relation_id = parseInt( map.relation_id, 10 );
    //   if( map.hasOwnProperty('version') ) map.version = parseInt( map.version, 10 );
    //   if( map.hasOwnProperty('changeset') ) map.changeset = parseInt( map.changeset, 10 );
    //   if( map.hasOwnProperty('user_id') ) map.user_id = parseInt( map.user_id, 10 );
    //
    //   // floats
    //   if( map.hasOwnProperty('longitude') ) map.longitude = parseFloat( map.longitude );
    //   if( map.hasOwnProperty('latitude') ) map.latitude = parseFloat( map.latitude );
    //
    //   // dates
    //   if( map.hasOwnProperty('timestamp') ) map.timestamp = new Date( map.timestamp );
    // }

    if( opts.debug ){
      map.raw = line;
    }

    next( null, map );
  });
}

var encodeStream = function( opts ){
  opts = opts || {};
  return through.obj( function( map, enc, next ){

    // collapse tags
    if( map.hasOwnProperty('tags') ) map.tags = collapseTags( map.tags );

    // collapse way refs
    if( map.hasOwnProperty('nodes') ) map.nodes = collapseNodeRefs( map.nodes );

    // escape strings
    if( map.hasOwnProperty('username') ) map.username = escape( map.username );

    var line = collapseLine( map ) + "\n";

    next( null, line );
  });
}

var expandLine = function( line ){
  var map = {};

  line.split(' ').forEach( function( field ){
    var key = field[0];
    key = KEYMAP[key] || key;
    map[ key ] = field.substr(1);
  });

  return map;
}

var collapseLine = function( map ){

  var lineParts = [];

  for( var attr in map ){
    var key = attr;
    if( INVERSE_KEYMAP.hasOwnProperty( attr ) ) key = INVERSE_KEYMAP[ attr ];
    lineParts.push( key + map[attr] )
  }

  return lineParts.join(' ');
}

var expandTags = function( block ){

  var map = {};
  if( !block ) return map;

  block.split(',').forEach( function( tag ){

    var firstIndex = tag.indexOf('='),
        tagKey = tag.substr(0, firstIndex),
        tagValue = tag.substr(firstIndex +1);

    if( !tagKey ){
      tagKey = tagValue;
      tagValue = '';
    }

    map[ tagKey ] = unescape( tagValue );
  });

  return map;
}

var collapseTags = function( tags ){

  if( !tags ) return '';

  var tagList = [];
  for( var key in tags ){
    var value = tags[key];
    tagList.push( key + '=' + escape( value || '' ) );
  }

  return tagList.join(',');
}

var expandNodeRefs = function( nodes ){
  if( !nodes.length ) return [];
  return nodes.split(',').map( function( node ){
    return node.substr(1);
  });
}

var collapseNodeRefs = function( arr ){
  if( !arr.length ) return '';
  return arr.map( function( node ){
    return 'n' + node;
  }).join(',');
}

function unescape( text ){
  return text.replace( /%([a-f0-9]{2,6})%/g, function( _, code ){
    return String.fromCharCode( parseInt( code, 16 ) );
  });
}

// eg. "@".charCodeAt(0)
// space: 32
// newline: 10
// comma: 44
// equals: 61
// at:  64
// percent: 37
// backspace: 127
// nbs: 160

function escape( text ){

  for( var i=0, code=text.charCodeAt(0); i<text.length; code=text.charCodeAt(++i) ){
    if( code === 32 || code === 10 || code === 44 || code === 61 || code === 64 ||
        code === 37 || code === 127 || code === 160 || code > 1535 ){
      var escaped = codeToHexString( code );
      text = text.substr( 0, i ) + escaped + text.substr( i+1 );
      i += ( escaped.length -1 );
    }
  }

  return text;
}

var LOOKUP = {};
function codeToHexString( code ){
  var esc = LOOKUP[ code ];
  if( !esc ){
    var str = code.toString(16);
    esc = '%' + ( str.length % 2 ? '0': '' ) + str + '%';
    LOOKUP[ code ] = esc;
  }
  return esc;
}

module.exports.decodeStream = decodeStream;
module.exports.encodeStream = encodeStream;
module.exports.expandLine = expandLine;
module.exports.collapseLine = collapseLine;
module.exports.expandTags = expandTags;
module.exports.collapseTags = collapseTags;
module.exports.unescape = unescape;
module.exports.escape = escape;
