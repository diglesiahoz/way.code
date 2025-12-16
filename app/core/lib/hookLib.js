way.lib.hookLib = function (_args) {
  var _args = way.lib.getArgs('hookLib', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        let output = {};
        for (const app_name of way.apps) {
          output[app_name] = _args.config
        }

        try {
          let hook_signature = `hookLib${_args.name[0].toUpperCase() + _args.name.substring(1)}`;
          for (const app_name of way.apps) {
            let tmp_output = await way.lib[app_name][hook_signature]({ config: _args.config });
            output[app_name] = tmp_output.data
          }
        } catch (e) { 
          // way.lib.exit(e) 
        }

        return resolve({
          args: Object.assign({}, _args),
          attach: {},
          code: 0,
          data: output,
        });

      })();
    }, 0); 
  });

  



}