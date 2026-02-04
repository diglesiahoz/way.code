way.lib.hookLib = function (_args) {
  var _args = way.lib.getArgs('hookLib', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        let output = {};

        try {
          let hook_signature = `hookLib${_args.name[0].toUpperCase() + _args.name.substring(1)}`;
          if (way.proc.appname == 'core') {
            var regex = new RegExp(hook_signature, "i");
          } else {
            var regex = new RegExp(`${way.proc.appname}.${hook_signature}`, "i");
          }
          const libsToCall = way.map.libKey.filter(p => regex.test(p));
          if (libsToCall.length > 0) {
            for (const libName of libsToCall) {
              var libNameSplited = libName.split('.');
              if (libNameSplited.length > 1) {
                var app_name = libNameSplited[0];
              }
              let tmp_output = await way.lib[app_name][hook_signature]({ config: _args.config });
              output = tmp_output.data
            }
          } else {
            output = _args.config
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