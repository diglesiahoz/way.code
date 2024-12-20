way.lib.getCache = function (cache_name) {
  const fs = require('fs');
  if (fs.existsSync(`${way.root}/.cache/${cache_name}`)) {
    const data = fs.readFileSync(`${way.root}/.cache/${cache_name}`, 'utf8');
    var cache_data = JSON.parse(data, function(key, value) {
      if (typeof value === "string" &&
          value.startsWith("/Function(") &&
          value.endsWith(")/")) {
        value = value.substring(10, value.length - 2);
        return new Function(
          'exports',
          'require',
          'module',
          '__filename',
          '__dirname',
          `return ${value}`
        )(exports,require,module,__filename,__dirname);
      }
      return value;
    });
    if (!/^config\.core--/.test(cache_name)) {
      way.lib.log({
        message:`Obtiene caché: ${cache_name}`,
        type: 'log'
      });
    }
    return cache_data;
  }
}