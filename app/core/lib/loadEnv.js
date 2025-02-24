way.lib.loadEnv = async function (_args){
  var _args = way.lib.getArgs('loadEnv', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        var jsonToEnv = require('json-to-env2'); // https://github.com/nlapshin/json-to-env

        var envThis = await way.lib.decode({ data: way.env._this }).catch((o) => { return {} });
        const env = jsonToEnv(envThis, {});
        var export_env = [];
        env.split(/\n/).forEach(env_var => {
          if (env_var === "") return;
          var a = env_var.split('=');
          if (/-/.test(a[0])) {
            env_var = env_var.replace(a[0], a[0].replace(/-/g,'_'));
          }
          export_env.push(`export ${env_var}`);
        });
        way.var.env = `${export_env.join("; ")}`;

        //console.log(way.var.env); way.lib.exit();

        return resolve({
          args: Object.assign({}, _args),
          attach: {},
          code: 0,
          data: {},
        });

      })();
    }, 0); 
  });
}