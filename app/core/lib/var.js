way.lib.var = function (_args) {
  var _args = way.lib.getArgs('var', _args);
  if (!/^[a-z\.]*$/.test()) {
    way.lib.exit('Fallo al establecer variable.');
  } else {
    if (typeof _args.key != "string") {
      way.lib.exit(`Fallo al establecer la clave de la variable "${_args.key}". Solo permitido cadenas en minúsculas y puntos.`)
    }
    if (typeof _args.value == "string") {
      _args.value = JSON.stringify(_args.value);
    }
    try {
      var arrkey = _args.key.split(".");
      if (arrkey.length > 1) {
        var xtree = "";
        for (var x = 0; x < arrkey.length; x++) {
          var xset = arrkey[x];
          if (x == 0) {
            xtree = `way.var.${xset}`;
          } else {
            xtree += `.${xset}`;
          }
          if (!way.lib.check(eval(xtree)) && ((arrkey.length - 1) != x)) {
            eval(`${xtree} = {};`)
          }
        }
      }
      if (_args.allow_merge) {
        var currentVarValue = eval(`way.var.${_args.key}`);
        if (way.lib.check(currentVarValue)) {
          switch (currentVarValue.constructor.name) {
            case "Array":
              _args.value = [].concat(currentVarValue, _args.value);
              break;
            default:
              way.lib.exit(`No soportada fusión de variable del tipo "${currentVarValue.constructor.name}"`);
          }
        }
      }
      if (typeof _args.value == "string") {
        //var set = eval(`way.var.${_args.key} = "${_args.value}"`);
        var set = eval(`way.var.${_args.key} = ${_args.value}`);
      } else {
        var set = eval(`way.var.${_args.key} = ${JSON.stringify(_args.value)}`);
      }
      return set;
    } catch (e) {
      way.lib.exit(`Fallo al establecer la variable "${_args.key}" (${e.message})`);
    }
  }   
}