way.lib.getFilesFromDir = function (_args) {
  var _args = way.lib.getArgs('getFilesFromDir', _args);
  var files = [];
  var toEach = [];
  var rel = _args.dir.replace(/\/*$/,"/");
  try {
    var toEach = require('fs').readdirSync(_args.dir);
  } catch (e) {
    way.lib.log({ message: `Directorio "${_args.dir}" no disponible`, type: "warning" });
  }
  toEach.forEach(function(file) {
    if (require('fs').statSync(_args.dir + '/' + file).isDirectory() && _args.recursive == true) {
      files = way.lib.getArrayMerge({
        array1: files,
        array2: way.lib.getFilesFromDir({
          dir: `${rel}${file}/`,
          recursive: true,
          files: files
        })
      });
    } else {
      if (!require('fs').statSync(_args.dir + '/' + file).isDirectory()) {
        if (_args.onlyNames == true) {
          files.push(`${file}`)
        } else {
          files.push(`${rel}${file}`)
        }
      }
    }
  });
  return files;
}