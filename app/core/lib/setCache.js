way.lib.setCache = function (cache_name, cache_data) {
  const fs = require('fs');
  if (!fs.existsSync(`${way.root}/.cache/${cache_name}`)) {
    var fileStat = cache_name.split('--');
    if (way.lib.check(fileStat[0])) {
      cacheFileName = fileStat[0];
    }
    fs.readdirSync(`${way.root}/.cache/`).forEach(file => {
      var cacheOldFileStat = file.split('--');
      if (cacheOldFileStat.length > 1) {
        if (cacheFileName == cacheOldFileStat[0]) {
          if (!/^config\.core--/.test(cache_name)) {
            way.lib.log({
              message: `Elimina cache obsoleta: ${way.root}/.cache/${file}`,
              type: 'log'
            });
          }
          fs.unlinkSync(`${way.root}/.cache/${file}`);
        }
      }
    });
    fs.writeFileSync(`${way.root}/.cache/${cache_name}`, JSON.stringify(cache_data, function(key, value) {
      if (typeof value === "function") {
        return "/Function(" + value.toString() + ")/";
      }
      return value;
    }), {encoding: 'utf8'});

    if (!/^config\.core--/.test(cache_name)) {
      way.lib.log({
        message:`Establece caché: ${cache_name}`,
        type: 'log'
      });
    }
  }
}