way.lib.setFile = async function (_args) {
  var _args = way.lib.getArgs('setFile', _args);
  var relkey = _args.key;
  var type = "file"
  var root = `${way.proc.approot}/${type}`;
  var base = `${root.replace(/^(core|custom)\//,"").replace(/file$/,"").replace(/\//g,".")}`
  _args.key = `${base}${_args.key}`;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        try {
          var fs = require('fs');
          if (!way.lib.check(_args.data)) {
            reject(`No establece datos (${_args.key})`);
          }
          //console.log(way.map.file)
          if (!way.lib.check(way.map.file[_args.key])) {
            var parentkey = root.replace(/^(core|custom)\//,"").replace(/file$/,"").replace(/\//g,".");
            var rel = `${root}`
            var relobj = relkey.split(".");
            configfilename = `${relobj[relobj.length-1]}.${_args.ext}`;
            if (relobj.length > 1) {
              for (var i = 0; i < relobj.length - 1 ; i++) {
                rel += `/${relobj[i]}`;
                if (!fs.existsSync(rel)) {
                  try {
                    fs.mkdirSync(rel);
                    way.lib.log({
                      message: `Directorio creado: ${rel}`,
                      type: "label"
                    });
                  } catch (e) {
                    reject(`No se ha podido crear: ${rel}`);
                  }
                }
              }
            }
            way.map.file[`${parentkey}${relkey}`] = `${rel}/${configfilename}`;
          }
          var fpath = way.map.file[_args.key].split("/");
          var flag = fpath[fpath.length - 1];
          delete fpath[fpath.length - 1];
          var lockfile = `${fpath.join("/")}${flag}.LOCK`;
          if (fs.existsSync(lockfile)) {
            let i = 1;
            do {
              await new Promise(function(resolve) { 
                if (i > 5000) {
                  way.lib.exit(`Fichero de control "${lockfile}" bloqueado permanentemente.`)
                }
                (!fs.existsSync(lockfile)) ? i = 0 : i++;
                setTimeout(resolve, 0);
              });
            } while (i >= 1);
          }
          //console.log(way.map.file[_args.key])
          //console.log(_args.data)

          fs.writeFileSync(lockfile, '', 'utf8');
          fs.writeFileSync(way.map.file[_args.key], _args.data, 'utf8');
          fs.unlinkSync(lockfile);
          //console.log(way.map.file[_args.key])
          resolve(way.map.file[_args.key])
        } catch (e) {
          way.lib.log({
            message: `Fallo al establecer el fichero "${_args.key}"\n${e}`,
            type: "warning"
          });
          reject();
        }
      })();
    }, 0);
  });
}