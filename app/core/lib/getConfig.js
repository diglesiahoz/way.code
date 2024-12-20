way.lib.getConfig = async function (_args) {
  var _args = way.lib.getArgs('getConfig', _args);
  _args.key = `${way.proc.appconfig.replace(/^(core|custom)\//,"").replace(/config$/,"").replace(/\//g,".")}${_args.key}`;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        if (way.lib.check(way.map.config[_args.key])) {
          arrayTree = _args.key.split(".");
          testconfigkey = ""
          for (t of arrayTree) {
            if (/^[0-9]*$/.test(t)) {
              testconfigkey += `["${t}"]`;
            } else {
              testconfigkey += `.${t}`;
            }
          }
          testconfigkey = testconfigkey.replace(".","")
          if ( way.lib.isObjEmpty(eval(`way.config.${testconfigkey}`)) ){
            await way.lib.loadConfig({
              key:`${_args.key}`, 
              force: true
            });
          }
          var keys = _args.key.split(".");
          var tree = "";
          for (var v = 0; v < keys.length; v++) {
            if (/^[0-9]*$/.test(keys[v])) {
              tree += `["${keys[v]}"]`;
            } else {
              tree += `.${keys[v]}`
            }
          }
          if(way.lib.check(eval(`way.config${tree}`))) {
            var data = eval(`way.config${tree}`);
            if (_args.decode) {
              var data = await way.lib.decode({
                data: data, 
                throwException: [ "simple", "global", "map" ] 
              });
            }
            resolve(data);
          } else {
            reject(`Fallo al obtener la configuración "${_args.key}"`);
          }
        } else {
          reject(`No disponible configuración "${_args.key}"`);
        }
      })();
    }, 0); 
  });
}