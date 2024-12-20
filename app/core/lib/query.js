way.lib.query = async function (_args) {
  var _args = way.lib.getArgs('query', _args);
  //console.log(_args)
  if (!way.lib.check(_args.input)) {
    _args.input = way;
  }
  const fs = require('fs');
  const path = require('path')
  try {
    var stats = fs.statSync(_args.input);
    if (!stats.isFile()) {
      way.lib.exit(`Ruta "${_args.input}" a fichero de consulta no valida`);
    }
    if (path.basename(_args.input).split(".")[1] !== "json") {
      way.lib.exit(`Fichero de consulta "${_args.input}" debe de ser JSON`);
    }
    var input = "file";
    var target = _args.input;
  } catch (e) {
    var input = "string";
    var target = JSON.stringify(_args.input);
  }
  //if (way.opt.c) {
  //  var tree = way.lib.getTree(_args.input);
  //  var choice = await way.lib.complete({
  //    choices: tree,
  //    message: `Selecciona propiedad...`
  //  });
  //  _args.select = choice;
  //}
  if (_args.select == "..") {
    way.lib.exit(`Error de sintaxis en llamada "query"`);
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //if (way.lib.isObjEmpty(_args.input)) {
      //  resolve([])
      //} else {
        require('node-jq').run(_args.select, target, {
          input: input,
          output: "compact",
          sort: _args.sort
        }).then((output) => {
          var lines = output.split("\n");
          o = [];
          for (var l = lines.length - 1; l >= 0; l--) {
            var line = lines[l];
            way.lib.log({
              message: `Query output line: ${line}`,
            });
            o.push(JSON.parse(line));
          }
          if (way.lib.check(_args.output)) {
            switch (_args.output) {
              case "string":
                resolve(way.lib.cast({
                  data: o,
                  flag: "sb"
                }));
                break;
              case "array":
                resolve(o);
                break;
              case "object":
                resolve(way.lib.cast({
                  data: o,
                  flag: "o"
                }));
                break;
              default:
                reject();
            }
          } else {
            if (_args.removeDuplicate) {
              o = way.lib.removeDuplicateFromArray(o);
            }
            if (_args.removeEmpty) {
              o = way.lib.removeEmptyFromArray(o);
            }
            //if (o.length == 1) {
            //  //resolve(o[0]);
            //  resolve(o);
            //} else {
            //  resolve(o);
            //}
            resolve({
              args: Object.assign({}, _args),
              attach: {},
              code: 0,
              data: o,
            });
          }
        }).catch((err) => {
          reject(`Fallo en consulta\n| ${err.message.trim()}\n|==> "${_args.select}"`)
        });
      //}
    }, 0);       
  });
}