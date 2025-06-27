way.lib.getFlatObject = function (_args) {
  var _args = way.lib.getArgs('getFlatObject', _args);

  let lines = [];

  const isObject = val => typeof val === 'object' && val !== null;
  const colorKey = str => `\x1b[38;5;35m${str}\x1b[0m`;   // Cyan
  const colorVal = str => `\x1b[38;5;178m${str}\x1b[0m`;   // Yellow

  if (Array.isArray(_args.data)) {
    _args.data.forEach((item, index) => {
      const fullPath = `${_args.prefix}[${index}]`;
      if (isObject(item)) {
        lines = lines.concat(way.lib.getFlatObject({ data: item, prefix: fullPath}));
      } else {
        lines.push(`${colorKey(fullPath)} = ${colorVal(item)}`);
      }
    });
  } else if (isObject(_args.data)) {
    for (let key in _args.data) {
      if (!_args.data.hasOwnProperty(key)) continue;

      const fullPath = _args.prefix ? `${_args.prefix}.${key}` : key;
      const value = _args.data[key];

      if (isObject(value)) {
        lines = lines.concat(way.lib.getFlatObject({ data: value, prefix: fullPath}));
      } else {
        lines.push(`${colorKey(fullPath)} = ${colorVal(value)}`);
      }
    }
  }

  return lines;

}

