way.lib.getFlatObject = function (_args) {
  var _args = way.lib.getArgs('getFlatObject', _args);

  //console.log(_args)

  let lines = [];

  const isObject = val => typeof val === 'object' && val !== null;
  const colorKey = str => `\x1b[38;5;35m${str}\x1b[0m`;   // Cyan
  const colorVal = str => `\x1b[38;5;178m${str}\x1b[0m`;  // Yellow

  const key_color = 60; //35
  const val_color = 61; //178
  

  switch (true) {
    case typeof _args.data === 'string':
      let out = way.lib.trace([
        { data: ` · `, text_color: null, bg_color: null, bold: false, out: false },
        { data: `${_args.data}`, text_color: val_color, bg_color: null, bold: false, out: false },
      ]);
      lines.push(out);
      break;
    case Array.isArray(_args.data):
      _args.data.forEach((item, index) => {
        const fullPath = `${_args.prefix}[${index}]`;
        if (isObject(item)) {
          lines = lines.concat(way.lib.getFlatObject({ data: item, prefix: fullPath}));
        } else {
          //lines.push(`${colorKey(fullPath)} = ${colorVal(item)}`);
          let out = way.lib.trace([
            { data: ` · `, text_color: null, bg_color: null, bold: false, out: false },
            { data: `${fullPath}`, text_color: key_color, bg_color: null, bold: false, out: false },
            { data: ` = `, text_color: null, bg_color: null, bold: false, out: false },
            { data: `${item}`, text_color: val_color, bg_color: null, bold: true, out: false },
          ]);
          lines.push(out);
        }
      });
      break;
    case _args.data !== null && typeof _args.data === 'object':
      for (let key in _args.data) {
        if (!_args.data.hasOwnProperty(key)) continue;
  
        var dot = "."
        
        var fullPath = _args.prefix ? `${_args.prefix}${dot}${key}` : key;

        /*
        var cadena = fullPath;
        // Paso 1: Buscar la primera ocurrencia de ".."
        const indicePrimerDoblePunto = cadena.indexOf('..');
        // Paso 2: Separar en dos partes
        const parte1 = cadena.slice(0, indicePrimerDoblePunto + 2); // incluye los primeros ".."
        const parte2 = cadena.slice(indicePrimerDoblePunto + 2);
        // Paso 3: Reemplazar todos los ".." por "." en la segunda parte
        const parte2Limpia = parte2.replace(/\.\.+/g, '.');
        // Paso 4: Unir ambas partes
        const resultado = parte1 + parte2Limpia;
        fullPath = resultado;
        */
  
  
        const value = _args.data[key];
  
        if (isObject(value)) {
          lines = lines.concat(way.lib.getFlatObject({ data: value, prefix: fullPath}));
        } else {
          let out = way.lib.trace([
            { data: ` · `, text_color: null, bg_color: null, bold: false, out: false },
            { data: `${fullPath}`, text_color: key_color, bg_color: null, bold: false, out: false },
            { data: ` = `, text_color: null, bg_color: null, bold: false, out: false },
            { data: `${value}`, text_color: val_color, bg_color: null, bold: false, out: false },
          ]);
          lines.push(out);
        }
      }
      break;
  }

  return lines;

}

