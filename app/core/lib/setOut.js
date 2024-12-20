way.lib.setOut = function (o) {
  if (typeof o === 'object') {
    if (way.lib.isObjEmpty(o)) {
      way.out = null;
    } else {
      way.out = o;
    }
  } else {
    if (way.lib.check(o)) {
      if (typeof o === 'string') {
        if ('|'+o.replace(/^\s*[\r\n]/gm,"")+'|' == '||') {
          way.out = null;
        } else {
          way.out = o.replace(/^\s+|\s+$/g, '');
        }
      } else {
        way.out = o;
      }
    } else {
      way.out = null;
    }
  }
  /*
  if (typeof o === 'object') {
    if (way.lib.isObjEmpty(o)) {
      way.out = {};
    } else {
      for (x of Object.keys(o)) {
        way.out[x] = o[x];
      }
    }
  } else {
    if (way.lib.check(o)) {
      if (typeof o === 'string') {
        if ('|'+o.replace(/^\s*[\r\n]/gm,"")+'|' == '||') {
          way.out = {};
        } else {
          way.out = o.replace(/^\s+|\s+$/g, '');
        }
      } else {
        way.out = o;
      }
    } else {
      way.out = {};
    }
  }
  */
  //console.log(way.out)
}