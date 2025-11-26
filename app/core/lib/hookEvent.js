way.lib.hookEvent = function (_args) {
  var _args = way.lib.getArgs('hookEvent', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        // @TODO: No soportado hooks desde configuración de procedimiento. Queda pendiente. Ver: ./config/hook.yml

        // Establece tipo de hook
        const hook_type = `event`;

        // Carga configuración
        var config = await way.lib.loadConfig({
          key: [ `${_args.config_key}` ],
          force: true
        }).catch((o) => {
          return {};
        });

        // Obtiene tareas a ejecutar
        try {
          let hook_signature = `config.hook.${hook_type}['${way.proc.name}']['${_args.event}']`;
          var hookConfig = eval(hook_signature);
          // Manage task
          for (var i = 0; i < hookConfig.length; i++) {
            await way.lib.manageTask(hookConfig[i]);
          }
        } catch (e) {
          // TODO
        }

        // Devuelve resultado
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