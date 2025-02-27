way.lib.setArgsAndOpt = function (_args) {
  var _args = way.lib.getArgs('setArgsAndOpt', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        var color = require('ansi-colors');

        if (typeof way.proc.code.task.require !== "undefined") {

          taskRequire = await way.lib.decode({data: way.proc.code.task.require });

          //console.log(way.args)
          //console.log(way.opt)

          
          // REQUIRE - OPT
          if (way.lib.check(taskRequire.opt)) {
            try {

              var counter = 1;
              for (opt in taskRequire.opt) {

                if (Object.keys(way.opt).includes(opt)) {
                  way.lib.exit(`No se permite establecer opción del core "${opt}" desde procedimiento "${way.proc.name}"`);
                }

                var ma = taskRequire.opt[opt];

                if (
                  typeof ma['type'] === "undefined" || 
                  typeof ma['default'] === "undefined"
                ) {
                  way.lib.exit(`Fallo al definir opción desde procedimiento "${way.proc.name}". Propiedades requeridas: type, default`)
                }

                ma['value'] = _args.argv[opt];

                if (typeof ma['default'] !== "undefined" && ma['default'] != null) {
                  if (ma['default'].constructor.name == "Object") {
                    ma['default'] = Object.keys(ma['default']);
                  }
                  if (ma['default'].constructor.name == "String" || ma['default'].constructor.name == "Number") {
                    ma['default'] = [ ma['default'].toString() ];
                  }
                }
                
                if (typeof ma['value'] === "undefined") {
                  // Si el tipo de dato que espera es String o Number y está establecido "default" como un Array. Se muestra valores para completar
                  if (typeof ma['default'] !== "undefined" && ma['default'] != null) {
                    if (ma['default'].constructor.name == 'Array') {
                      var choice = await way.lib.complete({ choices: ma['default'], message: `Selecciona "${opt}"`, continue: false });
                      ma['value'] = choice;
                    }
                  } else {

                    // LAS OPCIONES NO SON OBLIGATORIAS, POR LO QUE NO SE SOLICITA VALOR

                  }
                }

                // En caso de String y no se ha introducido valor
                if (ma['type'] == "String" && typeof ma['value'] === "undefined") {
                  ma['value'] = "";
                }
                // En caso de Array u Objeto hacemos convertirmos desde String
                if (ma['type'] == "Number") {
                  if (/^[+-]?\d+(\.\d+)?$/.test(input)) {
                    ma['value'] = Number(ma['value'])
                  }
                }
                // En caso de Array u Objeto hacemos convertirmos desde String
                if (ma['type'] == "Array" || ma['type'] == "Object") {
                  try {
                    console.log(JSON.parse(_args.argv[opt]))
                    ma['value'] = JSON.parse(_args.argv[opt]);
                  } catch (e) {}
                }
                try {
                  var type = ma['value'].constructor.name;
                  if (type !== ma['type'] && ma['type'] !== null) {
                    way.lib.exit(`Argumento "${opt}" requiere valor de tipo "${ma['type']}". Detectado "${type}" desde llamada "${way.proc.name}"`);
                  }
                } catch (e) { 
                  // Establece el valor por defecto si no detecta valor
                  ma['value'] = ma['default'];
                }

                
                if (typeof ma['default'] !== "undefined" && ma['default'] != null) {
                  if (ma['default'].constructor.name == 'Array') {
                    if (!ma['default'].includes(ma['value'])) {
                      way.lib.exit(`No permitido valor "${ma['value']}" en argumento "${opt}" (Permitido: ${ma['default'].join(', ')})`)
                    }
                  }
                }

                way.opt[`${opt}`] = ma['value'];

              };

            } catch (e) {
              way.lib.exit(e)
            }
          }


          // REQUIRE - ARGS
          if (way.lib.check(taskRequire.args)) {
            try {

              var msg = [];
              var c = 0;
              for (k of Object.keys(way.args)) {
                if (c >= Object.keys(taskRequire.args).length) {
                  msg.push(`"${way.args[k]}" no requerido`);
                }
                if (/^arg[0-9]*/.test(k)) {
                  c++;
                }
              }

              if (c > Object.keys(taskRequire.args).length) {
                // way.lib.exit(`El numero de argumentos introducidos no es correcto. (${msg.join(', ')})`);
              }
              
              var counter = 1;
              for (arg in taskRequire.args) {

                var ma = taskRequire.args[arg];

                if (
                  typeof ma['type'] === "undefined" || 
                  typeof ma['default'] === "undefined"
                ) {
                  way.lib.exit(`Fallo al definir argumento desde procedimiento "${way.proc.name}". Propiedades requeridas: type, default`)
                }



                if (ma['type'] === '.*') {
                  ma['value'] = way.args._;
                } else {
                  ma['value'] = way.args[`arg${counter}`];

                  if (typeof ma['default'] !== "undefined" && ma['default'] != null) {
                    
                    if (ma['default'].constructor.name == "Object") {
                      ma['default'] = Object.keys(ma['default']);
                    }
                    if (ma['default'].constructor.name == "String" || ma['default'].constructor.name == "Number") {
                      if (ma['default'].startsWith('callback::')) {
                        way.tmp.manageTask = true;
                        var function_name = `way.lib.${ma['default'].split('::')[1]}();`;
                        var output_callback = await eval(function_name);
                        if (way.lib.check(output_callback.data)) {
                          ma['default'] = output_callback.data;
                        }
                        way.tmp.manageTask = false;
                      } else {
                        ma['default'] = [ ma['default'].toString() ];
                      }
                    }
                  }
                  
                  if (typeof ma['value'] === "undefined") {
                    // Si el tipo de dato que espera es String o Number y está establecido "default" como un Array. Se muestra valores para completar
                    if (typeof ma['default'] !== "undefined" && ma['default'] != null) {
                      if (ma['default'].constructor.name == 'Array') {
                        var choice = await way.lib.complete({ choices: ma['default'], message: `Selecciona "${arg}"`, continue: false });
                        ma['value'] = choice;
                      }
                    } else {
                      // Solicita valor...
                      var input = await way.lib.input({
                        message: `${color.bold.white(`Introduce el valor de "${arg}"`)} (${color.white(`${ma['type']}`)})`
                      }).then((o) => {
                        return o.data;
                      })
                      if (way.lib.check(input)) {
                        ma['value'] = input;
                      } else {
                        way.lib.exit(`Argumento requerido "${arg}" (${ma['type']}) desde procedimiento "${way.proc.name}"`);
                      }
                    }
                  }


                  // En caso de Array u Objeto hacemos convertirmos desde String
                  if (ma['type'] == "Number") {
                    if (/^[+-]?\d+(\.\d+)?$/.test(input)) {
                      ma['value'] = Number(ma['value'])
                    }
                  }
                  // En caso de Array u Objeto hacemos convertirmos desde String
                  if (ma['type'] == "Array" || ma['type'] == "Object") {
                    try {
                      console.log(JSON.parse(_args.argv[arg]))
                      ma['value'] = JSON.parse(_args.argv[arg]);
                    } catch (e) {}
                  }


                  try {
                    var type = ma['value'].constructor.name;
                    if (type !== ma['type'] && ma['type'] !== null) {
                      way.lib.exit(`Argumento "${arg}" requiere valor de tipo "${ma['type']}". Detectado "${type}" desde llamada "${way.proc.name}"`);
                    }
                  } catch (e) { 
                    // Establece el valor por defecto si no detecta valor
                    ma['value'] = ma['default'];
                  }

                  
                  if (typeof ma['default'] !== "undefined" && ma['default'] != null) {
                    if (ma['default'].constructor.name == 'Array') {
                      if (!ma['default'].includes(ma['value'])) {
                        way.lib.exit(`No permitido valor "${ma['value']}" en argumento "${arg}" (Permitido: ${ma['default'].join(', ')})`)
                      }
                    }
                  }

                }


                delete way.args[`arg${counter}`];
                way.args[`${arg}`] = ma['value'];



                if (ma['type'] !== '.*') {
                  var tmp = way.args._.split(' ');
                  var tmp_to_delete = [];
                  tmp.forEach((element, index) => {
                    //console.log(`I:${index} - ${arg}`)
                    if (/^-/.test(element)) {
                      var tmp_opt_name = element.replace(/^-*/, '');
                      //console.log(way.opt)
                      //console.log(index, element, tmp_opt_name)
                      if (typeof way.opt[tmp_opt_name] !== "undefined") {
                        //console.log(index, `to delete (1): ${element}, ${way.opt[tmp_opt_name]}`)
                        tmp_to_delete.push(element);
                        tmp_to_delete.push(way.opt[tmp_opt_name]);
                      } else {
                        if ( index == 0 && (element != tmp_to_delete[tmp_to_delete.length -1]) ) {
                          //console.log(index, `to delete (2): ${element}`)
                          tmp_to_delete.push(element);
                        }
                      }
                    } else {
                      if ( index == 0 && (element != tmp_to_delete[tmp_to_delete.length -1]) ) {
                        //console.log(index, `to delete (3): ${element}`, tmp_to_delete[tmp_to_delete.length -1])
                        tmp_to_delete.push(element);
                      }
                    }
                  });
                  //console.log('todelete:', tmp_to_delete)
                  tmp_to_delete.forEach((element, index) => {
                    if (tmp_to_delete[index] == tmp[index]) {
                      delete tmp[index];
                    }
                  });
                  var tmp = tmp.filter(function(ele){
                    return ele;
                  })
                  way.args._ = tmp.join(' ');
                } else {
                  if ( way.args[`${arg}`] == "" && (typeof ma['default'] !== "undefined" && ma['default'] != null) ) {
                    way.args._ = ma['default'];
                    way.args[`${arg}`] = ma['default'];
                  } else {
                    way.args._ = way.args[`${arg}`];
                  }
                }

                counter++;

              };


            } catch (e) {
              way.lib.exit(e)
            }
          }


          // console.log('------')
          // console.log(way.args)
          // console.log(way.opt)
          // console.log('------')

        }

        resolve({
          args: Object.assign({}, _args),
          attach: {},
          code: 0,
          data: {},
        });

      })();
    }, 0);       
  });
}