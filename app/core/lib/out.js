way.lib.out = async function (_args) {
  var _args = way.lib.getArgs('out', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        if (way.lib.check(_args.data)) {
          if (way.out.constructor.name != "Object") {
            way.lib.log({
              message: `No se puede obtener "${_args.data}" desde llamada. La salida no es un objeto.`,
              type: "warning"
            })
            var o = way.out;
          } else {
            try {
              var o = eval(`way.out.${_args.data}`)
            } catch (e) {
              way.lib.exit(`Fallo de sintaxis al establecer la propiedad "data" desde llamada "out"`)
            }
          }
        } else {
          var o = way.out;
        }
        try {
          if (o.message.constructor.name == "String" && o.type.constructor.name == "String") {
            way.lib.log({ message: o.message, type: o.type });
          }
        } catch (e) {
          if (o !== null) {
            console.log(o)
          }
        }
        resolve(o)
      })();
    }, 0); 
  });
}