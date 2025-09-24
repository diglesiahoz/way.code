way.lib.getConfigFromCLI = async function (_args) {
  var _args = way.lib.getArgs('getConfigFromCLI', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        //console.log(_args)

        if (JSON.stringify(way.reference.scope) != "{}") {
          // Filtra configuración por propiedad
          var output = await way.lib.getConfigAsTree({
            key: _args.config._config_name,
            filter_setting: way.reference.scope.conf
          });
        } else {
          // No filtra configuración por propiedad
          var output = await way.lib.getConfigAsTree({
            key: _args.config._config_name
          });
        }
        // console.log('output.data', output.data)

        if (JSON.stringify(output.data) != "{}") {
          push = {}
          if (way.opt.o) {
            push = output.data;
          } else {
            if (typeof output.data._config_name !== 'undefined') {
              push[output.data._config_name] = output.data;
            } else {
              push[way.env._this._config_name] = output.data;
            }
          }
          way.tmp.out.push(push);
        }

        resolve({
          args: Object.assign({}, _args),
          attach: {},
          code: 0,
          data: output,
        });
      })();
    }, 0); 
  });
}