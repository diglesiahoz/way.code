way.lib.loadEnv = async function (_args){
  var _args = way.lib.getArgs('loadEnv', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        var fs = require('fs');
        var path = require('path');
        var jsonToEnv = require('json-to-env2'); // https://github.com/nlapshin/json-to-env

        var envThis = await way.lib.decode({ data: way.env._this }).catch((o) => { return {} });
        const env = jsonToEnv(envThis, {});
        //console.log(env)

        var env_array = [];
        env.split(/\n/).forEach(env_var => {
          if (env_var === "") return;
          var a = env_var.split('=');
          if (/-/.test(a[0])) {
            env_var = env_var.replace(a[0], a[0].replace(/-/g,'_'));
          }
          if (a[1] !== "undefined" && a.length <= 2) {
            env_array.push(`${env_var}`);
          }
        });
        
        // From env setting
        if (way.lib.check(envThis['env']) && envThis['env'].length > 0) {
          envThis['env'].forEach(env_var => {
            var a = env_var.split('=');
            if (a[1] !== "undefined" && a.length <= 2) {
              env_array.push(`${env_var}`);
            }
          });
        }

        //console.log(env_array)
        //env_array.forEach(env_var => {
        //  console.log(env_var)
        //});

        way.var.loadEnv = env_array;

        // way.var.env = `${env_array.join("; ")}`;
        // console.log(way.var.env); 
        // console.log('')
        // way.var.env_dockerfile = `ENV ${env_array.join("\nENV ")}`;
        // console.log(way.var.env_dockerfile); 


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