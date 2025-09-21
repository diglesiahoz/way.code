way.lib.getConfigFromCLI = async function (_args) {
  var _args = way.lib.getArgs('getConfigFromCLI', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        //console.log(_args);

        if (way.lib.check(_args.q)) {
          var output = await way.lib.query({
            input: _args.config,
            select: _args.q
          }).then((o) => { return o.data; });
        } else {
          var output = _args.config;
        }

        //console.log(way.env._this._config_name)
        //console.log(output._config_name)
        push = {}
        if (way.opt.o) {
          push = output;
        } else {
          if (typeof output._config_name !== 'undefined') {
            push[output._config_name] = output;
          } else {
            push[way.env._this._config_name] = output;
          }
        }
        way.tmp.out.push(push);

        //way.lib.log({
        //  message: output,
        //  type: 'console'
        //});

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