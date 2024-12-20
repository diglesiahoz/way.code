way.lib.getLib = function (path, lib) {
  var files = require('fs').readdirSync(path);
  lib = lib || {};
  for (var i = 0; i < files.length; i++) {
    filename = files[i];
    if (require('fs').statSync(`${path}/${filename}`).isDirectory() && !/\/node_modules\//.test(path)) {
      way.lib.getLib(`${path}/${filename}`, lib);
    } else {
      if (/^[a-zA-Z\.]*\.js$/.test(filename)) {
        pathobj = path.replace(way.root, "").split("/");
        if (pathobj[pathobj.length - 1] == "lib" || pathobj[pathobj.length - 1] == "app") {
          var fk = `${path}/`.replace(way.root, "").replace(/^\/(core|custom)\/(lib|app)/, "");
          if (fk == "/") {
            filekey = `${filename.replace(/\.js$/,"")}`;
          } else {
            filekey = `${fk.replace(/^\//,"").replace(/\/(lib|app)\//,"")}.${filename.replace(/\.js$/,"")}`;
          }
          lib[`${filekey}`] = `${path.replace(`${way.root}/`, "")}/${filename}`;
        }
      }
    }
  }
  return lib;
}