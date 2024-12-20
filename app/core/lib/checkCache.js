way.lib.checkCache = function (cache_name) {
  const fs = require('fs');
  if (fs.existsSync(`${way.root}/.cache/${cache_name}`)) {
    return true;
  } else {
    return false;
  }
}