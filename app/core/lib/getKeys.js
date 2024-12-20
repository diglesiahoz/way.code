way.lib.getKeys = function (object, tree, keys) {
  keys = keys || []
  for (var key in object) {
    var keyvalue = object[key];
    if (typeof tree !== 'undefined') {
      if (!/^[a-zA-Z]*$/.test(key)) {
        keys.push(`${tree}[${key}]`)
      } else {
        keys.push(`${tree}.${key}`)
      }
    } else {
      if (typeof keyvalue !== "object") {
        keys.push(`${key}`)
      }
    }
    if (keyvalue !== null && typeof keyvalue === "object") {
      if (typeof tree !== 'undefined') {
        if (!/^[a-zA-Z]*$/.test(key)) {
          way.lib.getKeys(keyvalue, `${tree}[${key}]`, keys);
        } else {
          way.lib.getKeys(keyvalue, `${tree}.${key}`, keys);
        }
      } else {
        way.lib.getKeys(keyvalue, `${key}`, keys);
      }
    }
  }
  return keys;
}