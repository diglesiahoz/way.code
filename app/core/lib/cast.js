way.lib.cast = function (_args) {

  var _args = way.lib.getArgs('cast', _args);

  var dtype = typeof _args.data;
  var output = _args.data;
  switch(_args.to) {
    case 'array':
      if (dtype == 'string') {
        var a = _args.data.split(_args.delimiter);
        var a = a.filter(function(el) { return el; });
        output = Array.from(a);
      } else {
        //way.lib.log({ message:`Conversión a array no realizada. Necesita cadena de texto.`, type:"warning" });
        output = _args.data;
      }
      break;
    case 'object':
      if (dtype == 'string') {
        _args.data = _args.data.split(_args.delimiter);
        _args.data = _args.data.filter(function(el) { return el; });
      }
      output = Object.assign({}, _args.data);
      break;
    case 'number':
      var n = parseInt(_args.data);
      if (isNaN(n)) {
        way.lib.exit(`Fallo casting (${_args.to}) a entero.`);
      }
      output = n;
      break;
    case 'string':
      output = _args.data.join(_args.join);
      break;
    case 'stringbreak':
      output = _args.data.toString().replace(/,/g,"\n");
      break;
    default:
      way.lib.log({ message:`No soportado (${_args.to}) casting`, type: "warning" });
      output = _args.data;
  }
  if (_args.pipe != "") {
    way.lib.var({
      key: _args.pipe,
      value: output
    });
  } else {
    return output;
  }
}

