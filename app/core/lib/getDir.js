way.lib.getDir = async function (_args) {
  var _args = way.lib.getArgs('getDir', _args);
  const { readdirSync } = require('fs');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        try {
          var directories = readdirSync(_args.path, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
          resolve(directories)
        } catch (e) {
          reject(e)
        }
      })();
    }, 0); 
  });
}