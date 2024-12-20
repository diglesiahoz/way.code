way.lib.getConfigMapOBSOLETO = function (dir, filelist) {
  /*
  var rel = dir.replace(/\/*$/,"/");
  var pat = `${way.root}/${dir.replace(/\/*$/,"/")}`;
  var files = require('fs').readdirSync(pat);
  filelist = filelist || {};
  files.forEach(function(file) {
    if (require('fs').statSync(pat + file).isDirectory()) {
      filelist = way.lib.getConfigMap(`${rel}${file}/`, filelist);
    }
    else {
      if (/^[a-z0-9\.]*\.(yml|yaml)$/.test(file)) {
        var fkey = rel + file.split('.').slice(0, -1).join('.')
        fkey = fkey.replace(/\//g, '.');
        fkey = fkey.replace(/^core\./g, '').replace(/^custom\./g, '');
        fkey = fkey.replace(/^config\./g, '').replace(/^proc\./g, '');
        var o = {};
        fkeyobj = fkey.split(".");
        if (way.lib.check(fkeyobj[0]) && fkeyobj[0] == "lib" && fkeyobj[2] == "config") {
          if (
             way.lib.check(fkeyobj[fkeyobj.length - 2]) && 
             fkeyobj[fkeyobj.length - 2] != "proc" &&
             fkeyobj[1] == fkeyobj[fkeyobj.length - 1]
             ) {
              fkeyobj.pop()
          }
          o.key = fkeyobj.join('.');
          //o.key = o.key.replace(/^.*\.config\./g, '');
          //o.key = o.key.replace(/^proc\./g, '');
          if (fkeyobj.includes("proc")) {
            o.key = o.key.replace(/^.*\.config\./g, '');
            o.key = o.key.replace(/^proc\./g, '');
          } else {
            if (fkeyobj[2] == "config" && !fkeyobj.includes("proc") && fkeyobj.length >= 4) {
              o.key = o.key.replace(/\.config/g, '');
            }
          }
        } else {
          o.key = fkey;
        }
        o.path = rel + file;
        filelist[o.key] = o.path;
      }
    }
  });
  return filelist;
  */
}
