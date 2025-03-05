way.lib.checkRequiredTaskSettings = function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        var color = require('ansi-colors');

        if (typeof way.proc.code.task.require !== "undefined") {

          taskRequire = await way.lib.decode({data: way.proc.code.task.require });

          if (way.lib.check(way.env._this)) {

            messages = [];

            var config_name = eval(`way.env._this._config_name`);

            // COMPRUEBA QUE EL PERFIL TIENE DEFINIDAS LAS PROPIEDADES QUE NECESITA EL PROCEDIMIENTO
            var procDecode = await way.lib.decode({ data: way.proc.code });
            var to_check = JSON.stringify(procDecode);
            var refpattern = /\((\(|\[)[\{\}\.a-zA-Z0-9_\-\?\\"\[\]\(\)]*(\)|\])\)/g;
            var references = to_check.match(refpattern);
            //console.log(to_check, references)
            if (references != null && !/^core\./.test(way.proc.name)) {
              for (ref of references) {
                // EXCLUYE REFRENCIAS GLOBALES Y/O TEMPORALES
                if (!/^\(\(\{\}\./g.test(ref) && !/^\(\(\)\)/g.test(ref)) {
                  var setting = ref.replace(/^\(\(\{[a-z]*\}\./g, '').replace(/\)\)$/g, '');
                  messages.push(`Procedimiento "${way.proc.name}" requiere que la propiedad "${setting}" este definida desde perfil "${config_name}"`);
               }
              }
            }

            // REQUIRE - SETTINGS
            if (way.lib.check(taskRequire.settings)) {

              for (setting in taskRequire.settings) {

                var setting_tree = await way.lib.parseConfigKey({
                  key: `${setting}`,
                  force: true
                });

                var founded = false;
                try {
                  if (typeof eval(`way.env._this${setting_tree}`) !== "undefined") {
                    founded = true;
                  }
                } catch (e) { }

                if (!founded) {
                  messages.push(`Procedure '${way.proc.name}' requires property '${setting}' to be implemented from profile '${config_name}'`);
                } else {
                  try {
                    var error = false;
                    if (taskRequire.settings[setting] != null) {
                      var out = eval(`way.env._this${setting_tree}`);
                      if (!way.lib.check(out) || !new RegExp(`${taskRequire.settings[setting]}`).test(out)) {
                        error = true;
                      }
                    }
                    if (error) {
                      messages.push(`Procedure '${way.proc.name}' requires property '${setting}' to be defined and to match pattern '${taskRequire.settings[setting]}' from profile '${config_name}'`);
                    }
                  } catch (e) {
                    way.lib.exit(e);
                  }
                }

              }

            }

            for (msg of messages) {
              way.lib.log({ message: msg, type: "error" });
            }
            if (messages.length > 0) {
              way.lib.exit();
            }

          }

        }
        

        resolve({
          attach: {},
          code: 0,
          data: {},
        });

      })();
    }, 0);       
  });
}