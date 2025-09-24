way.lib.getObjectAsTree = function (obj, patterns = null, prefix = '') {
  const result = {};

  const isValidKey = key => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key);

  const formatKey = (prefix, key) => {
    if (typeof key === 'number') return `${prefix}[${key}]`;
    if (!prefix) return isValidKey(key) ? key : `["${key}"]`;
    return isValidKey(key) ? `${prefix}.${key}` : `${prefix}["${key}"]`;
  };

  const matchesPattern = key => {
    if (!patterns) return true; // no filtros, aceptar todo
    const escapeRegExp = str => str.replace(/[+?${}()|[\]\\]/g, '\\$&');
    return patterns.some(p => {
      const regex = p instanceof RegExp ? p : new RegExp(escapeRegExp(p));
      return regex.test(key);
    });
  };

  const process = (obj, prefix = '') => {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const newKey = `${prefix}[${index}]`;
        if (item !== null && typeof item === 'object') {
          Object.assign(result, process(item, newKey));
        } else {
          if (matchesPattern(newKey)) result[newKey] = item;
        }
      });
    } else if (obj !== null && typeof obj === 'object') {
      for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        const value = obj[key];
        const newKey = formatKey(prefix, key);
        if (value !== null && typeof value === 'object') {
          Object.assign(result, process(value, newKey));
        } else {
          if (matchesPattern(newKey)) result[newKey] = value;
        }
      }
    } else {
      if (matchesPattern(prefix)) result[prefix] = obj;
    }
    return result;
  };

  return process(obj, prefix);
};
