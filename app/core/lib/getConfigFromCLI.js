way.lib.getConfigFromCLI = async function (_args) {
  var _args = way.lib.getArgs('getConfigFromCLI', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        if (way.lib.check(_args.q)) {
          var output = await way.lib.query({
            input: _args.config,
            select: _args.q
          }).then((o) => { return o.data; });
        } else {
          var output = _args.config;
        }

        way.tmp.out.push(output);

        //way.lib.log({
        //  message: output,
        //  type: 'pretty'
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