way.lib.getAlias = function (_args) {
  var _args = way.lib.getArgs('getAlias', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        var output = undefined;
        var similars = [];
        if (typeof way.map.aliasKey[_args.data] !== "undefined") {
          // COMPRUEBA SI HAY ALIAS...
          if (way.map.aliasKey[_args.data].length == 1) {
            output = way.map.aliasKey[_args.data][0];
          } else {
            similars = way.map.aliasKey[_args.data];
          }
        } else {
          // NOMBRES DE PROCEDIMIENTOS SIMILARES...
          similars = Object.keys(way.map.config).filter(element => {
            if (new RegExp(`\.${_args.data}$`,"g").test(element) && !new RegExp(`^@`,"g").test(element)) {
              return element;
            }
          });
        }
        if (similars.length > 0) {
          choice = await way.lib.complete({
            choices: similars,
            message: `Tengo dudas... ¿Qué quieres ejecutar?`
          });
          if (!choice) {
            if (similars.length > 0) {
              way.lib.exit(`No disponible "${_args.data}" (Similares... ${similars.join(", ")})`)
            }
          } else {
            output = choice;
          }
        }

        if (typeof output === "undefined") {
          way.lib.exit(`No disponible "${_args.data}"`);
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