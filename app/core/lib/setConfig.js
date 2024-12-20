way.lib.setConfig = async function (_args) {
  var _args = way.lib.getArgs('setConfig', _args);
  var relkey = _args.key;
  var root = way.proc.appconfig;
  var base = `${root.replace(/^(core|custom)\//,"").replace(/config$/,"").replace(/\//g,".")}`
  oKey = _args.key;
  if (/^\{\}\./g.test(_args.key)) {
    // CLAVE ABSOLUTA
    _args.key = `${_args.key.replace(/^\{\}\./,"way.config.")}`;
    if (_args.save) {
      way.lib.exit(`No permitido almacenar configuración de forma absoluta desde clave "${_args.key}". Solo permitido a nivel de aplicación.`)
    }
  } else {
    // CLAVE RELATIVA A LA APLICACIÓN
    _args.key = `${base}${_args.key}`;
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        try {
          var fs = require('fs');
          if (!way.lib.check(_args.data)) {
            //reject(`Establece configuración sin valor desde "${_args.key}"`);
          }
          if (!way.lib.check(way.map.config[_args.key]) && _args.save) {
            var parentkey = root.replace(/^(core|custom)\//,"").replace(/config$/,"").replace(/\//g,".");
            var rel = `${root}`
            var relobj = relkey.split(".");
            configfilename = `${relobj[relobj.length-1]}.yml`;
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
            way.map.config[`${parentkey}${relkey}`] = `${rel}/${configfilename}`;
          }
          if (_args.save) {
            var fpath = way.map.config[_args.key].split("/");
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
          }


          if (_args.save) {
            fs.writeFileSync(lockfile, '', 'utf8');
            fs.writeFileSync(way.map.config[_args.key], require('js-yaml').safeDump(_args.data), 'utf8');
            fs.unlinkSync(lockfile);
          }

          var keys = _args.key.split(".");
          var tree = "";
          for (var v = 0; v < keys.length; v++) {
            if (/^[0-9]*$/.test(keys[v])) {
              tree += `["${keys[v]}"]`;
            } else {
              if (keys[v] != "way") {
                tree += `.${keys[v]}`
              } else {
                tree += `${keys[v]}`
              }
            }
            if (_args.save) {
              if (!way.lib.check(eval(`way.config${tree}`))) {
                eval(`way.config${tree} = {}`);
              }
            } else {
              if (!way.lib.check(eval(`${tree}`))) {
                eval(`${tree} = {}`);
              }
            }
          }
          if (_args.save) {
            eval(`way.config${tree} = ${JSON.stringify(_args.data)}`);
          } else {
            eval(`${tree} = ${JSON.stringify(_args.data)}`);
          }
          if (_args.save) {
            var config = await way.lib.getConfig({
              key: _args.key.replace(base,""),
              decode: _args.decode
            });
            resolve(config)
          } else {
            resolve(eval(`${tree}`))
          }
        } catch (e) {
          way.lib.log({
            message: `Fallo al almacenar la configuración "${_args.key}"\n${e.stack}`,
            type: "warning"
          });
          reject();
        }
      })();
    }, 0);
  });
}