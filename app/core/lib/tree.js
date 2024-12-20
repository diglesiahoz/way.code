way.lib.tree = function (o, tree, a) {
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
      var tc = `${tree}${key}`;
    } else {
      var tc = `${key}`;
    }
    if (!/^\./.test(tc)) {
      tc = `.${tc}`
    }
    a.push(tc);

    if (value !== null && typeof value === "object") {
      way.lib.tree(value, tc, a);
    }
  }
  tree = a.filter(function(item, pos) {
    return a.indexOf(item) == pos;
  })

  return tree;
}