way.lib.getTree = function (o, tree, a) {
  a = a || []
  for (var i in o) {
    value = o[i];
    if (/^[a-zA-Z]*$/.test(i)) {
      key = `.${i}`;
    } else {
      key = `[${i}]`;
    }
    if (/\[.*\]/.test(key) && !/\[[0-9]*\]/.test(key)) {
      var matches = key.match(/\[(.*?)\]/);
      if (matches) {
        key = key.replace(matches[1], `"${matches[1]}"`)
      }
    }
    if (typeof tree !== 'undefined') {
      //var lastelem = a[a.length - 1];
      //if (/\[\]$/.test(lastelem) && /^[a-zA-Z]*$/.test(i)) {
      //  a.push(`${lastelem}${key}`);
      //  way.lib.exit(`${lastelem}`)
      //}
      var tc = `${tree}${key}`;
    } else {
      var tc = `${key}`;
    }
    if (!/^\./.test(tc)) {
      tc = `.${tc}`
    }
    a.push(tc);
    if (/\[[0-9]*\]$/.test(tc)) {
      a.push(tc.replace(/\[[0-9]*\]$/,"[]"));
    }
    if (/^\.\[[0-9]*\]/.test(tc)) {
      a.push(tc.replace(/^\.\[[0-9]*\]/,".[]"));
    }
    if (/\[[0-9]*\]/g.test(tc)) {
      a.push(tc.replace(/\[[0-9]*\]/g,"[]"));
    }
    if (value !== null && value.constructor.name === "Object") {
      //a.push(`${tc} | keys`);
    }
    if (value !== null && typeof value === "object") {
      way.lib.getTree(value, tc, a);
    }
  }
  tree = a.filter(function(item, pos) {
    return a.indexOf(item) == pos;
  })
  tree.sort();
  return tree;
  
  /* --- OLD ---
    a = a || []
    for (var i in o) {
      if (typeof tree !== 'undefined') {
        if (!/^[a-zA-Z]*$/.test(i)) {
          a.push(`.${tree}[${i}]`)
        } else {
          a.push(`.${tree}.${i}`)
        }
        if (o[i] !== null && typeof o[i] === "object") {
          if (!/^[a-zA-Z]*$/.test(i)) {
            a.push(`.${tree}[${i}].`)
          } else {
            a.push(`.${tree}.${i}.`)
          }
        }
      } else {
        a.push(`.${i}`)
        if (o[i] !== null && typeof o[i] === "object") {
          a.push(`.${i}.`)
        }
      }
      if (o[i] !== null && typeof o[i] === "object") {
        if (typeof tree !== 'undefined') {
          if (!/^[a-zA-Z]*$/.test(i)) {
            way.lib.getTree(o[i], `${tree}[${i}]`, a);
          } else {
            way.lib.getTree(o[i], `${tree}.${i}`, a);
          }
        } else {
          way.lib.getTree(o[i], `${i}`, a);
        }
      }
    }
    return a
    */
}