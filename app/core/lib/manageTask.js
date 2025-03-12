way.lib.manageTask = async function (argTask) {      
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        way.tmp.manageTask = true;

        var figures = require('figures');
        var color = require('ansi-colors');

        //console.log(argTask)

        //console.log(argTask)

        // Comprobación pre-eliminar
          if (Object.keys(argTask).includes('loop')) {
            if (Object.keys(argTask).length != 2 || !Object.keys(argTask).includes('do')) {
              way.lib.exit(`"Loop" mal formado comprueba sintaxis. Solo permitido propiedades "loop" y "do"`);
            }

            tmpTask = [];
            iTask = [];

            var ite = 0

            async function replaceLoop (data, recursive = false) {
              ite++;
              var loop = await way.lib.decode({
                data: data.loop
              });
              if (!Array.isArray(loop)) {
                way.lib.log({ message: loop });
                way.lib.exit(`Debes de proveer datos del tipo (array) a la propiedad (loop)`)
              }
              var counter = 0;
              for (pos in loop){
                var value = loop[pos];
                for (elem of data.do) {
                  var original_elem = {};
                  var original_elem = Object.assign({}, elem);
                  if (typeof value === 'object' ) {
                    for (elem of data.do) {
                      way._this = value;
                      way._this['_COUNTER'] = counter;
                      var original_elem = await way.lib.decode({
                        data: original_elem,
                        throwException: [ "simple", "map" ] 
                      });
                    }
                  }
                  var current_elem = {};
                  var current_elem = Object.assign({}, original_elem);
                  var re = new RegExp(`\\(\\(\\)\\)`, "g");
                  if ((way.lib.check(original_elem.label))) {
                    current_elem.label = original_elem.label.replace(re, value);
                  }
                  if ((way.lib.check(current_elem.call))) {
                    current_elem.call = original_elem.call.replace(re, value);
                  }
                  if ((way.lib.check(original_elem.check))) {
                    current_elem.check = JSON.parse(JSON.stringify(original_elem.check).replace(re, value) );
                  }
                  if ((way.lib.check(original_elem.args))) {
                    if (typeof value == "object") {
                      current_elem.args = JSON.parse(JSON.stringify(original_elem.args).replace(re, JSON.stringify(value).replace(/"/g,'\\"')));
                    } else {
                      current_elem.args = JSON.parse(JSON.stringify(original_elem.args).replace(re, value));
                    }
                  }
                  tmpTask.push(Object.assign({}, current_elem));
                }
                counter++;
              }
              for (elem of tmpTask) {
                var original_elem = Object.assign({}, elem);
                var current_elem = Object.assign({}, elem);
                for (pos in loop){
                  var value = loop[pos];
                  var re = new RegExp(`\\(\\(${pos}\\)\\)`, "g");
                  if ((way.lib.check(current_elem.label))) {
                    current_elem.label = current_elem.label.replace(re, value);
                  }
                  if ((way.lib.check(original_elem.call))) {
                    current_elem.call  = current_elem.call.replace(re, value);
                  }
                  if ((way.lib.check(current_elem.check))) {
                    current_elem.check = JSON.parse(JSON.stringify(current_elem.check).replace(re, value) );
                  }
                  if ((way.lib.check(current_elem.args))) {
                    current_elem.args = JSON.parse(JSON.stringify(current_elem.args).replace(re, value) );
                  }
                }
                var re = new RegExp(`\\(\\([0-9]*\\)\\)`, "g");
                no_replaced = JSON.stringify(current_elem).match(re);
                if (way.lib.check(no_replaced) && no_replaced.length > 0) {
                  if (way.lib.check(current_elem.do) && current_elem.do.length > 0) {
                    // ...
                  } else {
                    way.lib.exit(`Fallo en bucle. No encuentra remplazo/s "${no_replaced}"`)
                  }
                }
                return tmpTask;
              }
            }

            iTask = await replaceLoop(argTask);
            //console.log('iTask',iTask)
            //way.lib.exit()
            
          } 
          else if (Object.keys(argTask).includes('check')) {
            if (Object.keys(argTask).length != 1) {
              way.lib.exit(`"Check" mal formado comprueba sintaxis. Solo permitido propiedad "check"`);
            }
            if (!way.lib.check(argTask.check.data)) {
              way.lib.exit(`Debes de establecer los datos a comprobar a través de la propiedad "data"`);
            }
            if (!way.lib.check(argTask.check.true) && !way.lib.check(argTask.check.false)) {
              way.lib.exit(`Debes de establecer "check.true" o "check.false"`);
            }
            //console.log(argTask.check.data)
            var status = await way.lib.checkReq({ data: argTask.check.data });
            //console.log(status)
            if (status.includes(true) && status.every((val, i, arr) => val === arr[0])) {
              way.lib.log({
                message: `Selecciona task::TRUE`,
                type: "log"
              });
              if (way.lib.check(argTask.check.true)) {
                iTask = argTask.check.true;
              } else {
                iTask = {}
                var doResolve = true
              }
            } else {
              way.lib.log({
                message: `Selecciona task::FALSE`,
                type: "log"
              });
              if (way.lib.check(argTask.check.false)) {
                iTask = argTask.check.false;
              } else {
                iTask = {}
                var doResolve = true
              }
            }

            //console.log(iTask)
            //way.lib.exit()
          
          } 
          else {
            iTask = Object.assign({}, argTask)
          }
        

          //console.log(iTask)
          //way.lib.exit()
          

        //console.log(iTask.constructor.name)
        //console.log(iTask, iTask.constructor.name)
        if (doResolve) {
          way.lib.log({ message: `No establecidas acciones para comprobación "${status}"`, type: "log" });
          resolve();
        } else {
          var doResolve = false
        }
        

        if (typeof iTask !== "undefined") {
          //console.log('warning')
          //console.log(iTask.constructor.name, doResolve)
          if (iTask.constructor.name == "Object" && !doResolve) {
            //console.log(iTask)
            //way.lib.exit()

              // Procesa tarea
                if (!way.lib.check(iTask.call) && !way.lib.check(iTask.event)) {
                  await way.lib.manageTask(iTask);
                  //way.lib.exit(`Tarea requiere una llamada a una función de la librería.`);
                }

                //console.log(Object.keys(iTask), Object.keys(way.config.core.task.keys))
                diff = way.lib.getArrayDiff({ array1: Object.keys(iTask), array2: Object.keys(way.config.core.task.keys) });
                //console.log(diff)
                if (diff.length > 0) {
                  if (diff.length == 1) {
                    way.lib.exit(`No soportada propiedad "${diff}" establecida en tarea de procedimiento "${way.proc.name}"`);
                  } else {
                    way.lib.exit(`No soportadas propiedades "${diff}" establecidas en tarea de procedimiento "${way.proc.name}"`);
                  }
                }

              
              /* COMPRUEBA COMPATIBILIDAD DE CALL Y HOOK */
                if (way.lib.check(iTask.call) && way.lib.check(iTask.event)) {
                  way.lib.exit(`No compatible "event" con llamada a función.`);
                }


              hTask = [];

              /* HOOK EVENT */

                


                if (!way.lib.check(iTask.call) && way.lib.check(iTask.event)) {


                  /* HOOK EVENT FROM PROC CONFIG */
                  var hookEventIsAllowed = false;
                  var eventSignature = iTask.event.split(" ");
                  if (eventSignature.length == 1) {
                    var hookEventIsAllowed = true;
                    var eventName = iTask.event;
                  } else {
                    if (eventSignature.length == 2) {
                      var hookEventIsAllowed = true;
                      var eventName = eventSignature[1];
                    }
                  }
                  if (hookEventIsAllowed) {
                    try {

                      // IMPORTANTE
                      if (way.app_name_root != way.proc.name.split('.')[0]) {
                        var app_name_root = way.proc.name.split('.')[0];
                      }

                      if (way.lib.check( way.config.app[app_name_root]["hook"] )) {
                        var hookConfigFromProc = way.config.app[app_name_root]["hook"];
                        if (way.lib.check(hookConfigFromProc.event)) {
                          var hookConfigFromProcEvent = hookConfigFromProc.event[`${way.proc.name}`];
                          var hookCallNameKeys = Object.keys(hookConfigFromProcEvent);
                          var hooked = false;
                          var hooks = [];
                          for (hookCallNameKey of hookCallNameKeys) {
                            if (eventName == hookCallNameKey) {
                              var hookCall = `hookConfigFromProc.event["${way.proc.name}"]["${hookCallNameKey}"]`;
                              var hookTasks = eval(hookCall);
                              way.lib.log({
                                message: `Launch "${hookCallNameKey}" event from general hooks configuration`,
                                type: "verbose"
                              });
                              for (var i = 0; i < hookTasks.length; i++) {
                                hooks.push(iTask.hook);
                                hTask.push(hookTasks[i]);
                                hooked = true;
                              }
                            } 
                          }
                        }
                      }
                    } catch (e) {
                      //way.lib.exit(`Fallo al ejecutar evento desde configuración de procedimiento.\n  ${e.toString()}`);
                    }
                  }

                  //way.lib.exit()


                  /* HOOK EVENT FROM PROFILE */
                  if (way.envBatch.status) {
                    var argsToRun = [way.envBatch.now.replace(/^@/,'')];
                  } else {
                    if (way.args['@'].length == 0 && way.lib.check(way.env._this)) {
                      if (way.lib.check(way.env._this._config_name)) {
                        var argsToRun = [ way.env._this._config_name ];
                      } else {
                        var argsToRun = [];
                      }
                    } else {
                      var argsToRun = way.args['@'];
                    }
                  }
                  for (confKey of argsToRun) {
                    var confKeyName = confKey;
                    if (!(confKey in way.map.config)) {
                      var n = confKey.split(".");
                      if (`@${n.join(".")}` in way.map.config) {
                        confKey = `@${confKey}`;
                      } else {
                        n.pop();
                        if (`@${n.join(".")}` in way.map.config) {
                          confKey = `@${confKey}`;
                        }
                      }
                    }
                    // console.log()
                    //console.log(`-----${confKey}------`)
                    // console.log(app_name_root)
                    var to_check_config_name = confKey;
                    if (!/^@/.test(confKey)) {
                      to_check_config_name = `@${app_name_root}.${confKey}`;
                    }
                    //console.log(to_check_config_name)

                    var hookEventIsAllowed = false;
                    var eventSignature = iTask.event.split(" ");
                    if (eventSignature.length == 1) {
                      var hookEventIsAllowed = true;
                      var eventName = iTask.event;
                    } else {
                      if (eventSignature.length > 1) {
                        var eventTarget = eventSignature[0];
                        var eventReference = Object.keys(way.reference.config);
                        if (eventReference.includes(eventTarget) && way.reference.config[eventTarget] == to_check_config_name) {
                          var hookEventIsAllowed = true;
                          var eventName = eventSignature[1];
                        }
                      }
                    }
                    //console.log(hookEventIsAllowed)
                    if (hookEventIsAllowed) {
                      try {
                        var confKey = await way.lib.parseConfigKey({
                          key: `way.config.${to_check_config_name}`
                        }).then((o) => {
                          return o;
                        })
                        //console.log(eval(`${confKey}.hook.event`))
                        var hookProcKeys = Object.keys(eval(`${confKey}.hook.event`));
                        var hooked = false;
                        var hooks = [];
                        //console.log(hookProcKeys)
                        for (hookProcKey of hookProcKeys) {
                          //console.log(hookProcKey)
                          if (new RegExp(`^${hookProcKey}`, "g").test(`${way.proc.name}`)) {
                            var hookCallNameKeys = Object.keys(eval(`${confKey}.hook.event["${hookProcKey}"]`));
                            //console.log(hookCallNameKeys)
                            for (hookCallNameKey of hookCallNameKeys) {
                              //console.log(`-${hookCallNameKey} ~ ${iTask.event}`)
                              if (eventName == hookCallNameKey) {
                                //console.log(hookCallNameKey, `@${confKeyName}`)
                                hookCall = `${confKey}.hook.event["${hookProcKey}"]["${hookCallNameKey}"]`;
                                var hookTasks = eval(hookCall);
                                way.lib.log({
                                  message: `Launch "${hookCallNameKey}" event from configuration profile "${confKeyName}"`,
                                  type: "verbose"
                                });
                                for (var i = 0; i < hookTasks.length; i++) {
                                  hooks.push(iTask.hook);
                                  hTask.push(hookTasks[i]);
                                  hooked = true;
                                }
                              }
                            }
                          }
                        }
                      } catch (e) {
                        //way.lib.exit(`Fallo al ejecutar evento desde perfil.\n  ${e.toString()}`);
                      }
                    } else {
                      way.lib.log({
                        message: `No permitido ejecutar evento`
                      });
                    }
                  }

                  //way.lib.exit()
                  //console.log(hTask); way.lib.exit()


                } else {
                  hTask.push(iTask)
                }
                //console.log()
                //console.log(hTask)
                //way.lib.exit()
                
                if (hTask.length == 0) {
                  //way.lib.exit(`Procedimiento "${way.proc.name}" no ejecuta acciones`);
                  // Hook de evento no implementado en @
                  resolve();
                }

                

              
              //console.log('hTask:', hTask.length, hTask)
              //for await (iTask of hTask) {
              for (var h = 0; h < hTask.length; h++) {
                var iTask = hTask[h];
                //console.log('iTask ===>', iTask)
                //way.lib.exit()


                /* ARGCALL */
                  if (way.lib.check(iTask) && !way.lib.check(iTask.callType)) {

                    callname = iTask.call;

                    try {
                      way.lib.log({ message: `Check: way.lib["${iTask.call.replace(/\./g, "\"][\"")}"].constructor.name` });
                      iTask.callType = eval(`way.lib["${iTask.call.replace(/\./g, "\"][\"")}"].constructor.name`);
                    } catch (e) {
                      if (hooked && way.lib.check(iTask.check)) {
                        way.lib.exit(`No soportado "check" desde la implementación de un hook. (Revisa implementación de hooks desde "@${confKeyName}")`);
                      } 
                      else if (hooked && way.lib.check(iTask.loop)) {
                        way.lib.exit(`No soportado "loop" desde la implementación de un hook. (Revisa implementación de hooks desde "@${confKeyName}")`);
                      }
                      else {
                        way.lib.exit(`Librería no implementa "${iTask.call}"`);
                      }
                    }
                    
                    if (callname == "exit") {
                      if (way.lib.check(iTask.args)){
                        diff = way.lib.getArrayDiff({ array1: Object.keys(iTask.args), array2: Object.keys(way.config.core.lib.exit.args.req) });
                        if (diff.length > 0) {
                          if (diff.length == 1) {
                            way.lib.exit(`No soportada propiedad "${diff}" establecida en llamada "exit"`);
                          } else {
                            way.lib.exit(`No soportadas propiedades "${diff}" establecidas en llamada "exit"`);
                          }
                        }
                        var tocheck = Array.from(new Set(iTask.args.data.match(/(\(\(){1}\w*(\)\)){1}/g)));
                        if (tocheck.length > 0) {
                          for (ref of tocheck) {
                            if (way.lib.check(way.reference.map[ref])) {
                              originaRef = ref;
                              var re = new RegExp(ref.replace(/\(/g,'\\(').replace(/\)/g,'\\)'), "g");
                              tmp = JSON.stringify(iTask).replace(re, way.reference.map[originaRef]);
                              iTask = JSON.parse(tmp)
                            } else {
                              way.lib.exit(`Reference "${originaRef}" founded before execute task.`);
                            }
                          }
                        }
                        way.lib.exit(iTask.args.data)
                      } else {
                        way.lib.exit()
                      }
                    }

                    if (way.lib.check(iTask.args)) {
                      iTask.args = await way.lib.decode({
                        data: iTask.args, 
                        throwException: [ "simple", "global", "map" ] 
                      });
                    }
                    //console.log(iTask.args)
                    
                    //console.log('way.args',way.args)
                    way.argcall = Object.assign({}, way.args);
                    //console.log(way.argcall)

                    for (a in way.argcall) {
                      if (typeof way.opt[a] !== "undefined") {
                        delete way.argcall[a]
                      }
                    }
                    // iTask.args  = Opciones implementadas en procedimiento
                    // way.argcall = Opciones desde CLI
                    //way.argcall = Object.assign({}, iTask.args, way.argcall);
                    //way.lib.log({
                    //  label: 'way.argcall',
                    //  message: way.argcall,
                    //  type: "log"
                    //});
                    var oArgCall = way.argcall;
                    way.fromCLIToCheck = way.lib.tree(way.argcall);



                    /* HOOK CALL FROM PROFILE (@) */
                      if (way.envBatch.status) {
                        var argsToRun = [way.envBatch.now.replace(/^@/,'')];
                      } else {
                        if (way.args['@'].length == 0 && way.lib.check(way.env._this)) {
                          if (way.lib.check(way.env._this._config_name)) {
                            var argsToRun = [ way.env._this._config_name ];
                          } else {
                            var argsToRun = [];
                          }
                        } else {
                          var argsToRun = way.args['@'];
                        }
                      }
                      for (confKey of argsToRun) {

                        if (!(confKey in way.map.config)) {
                          var n = confKey.split(".");
                          if (`@${n.join(".")}` in way.map.config) {
                            confKey = `@${confKey}`;
                          } else {
                            n.pop();
                            if (`@${n.join(".")}` in way.map.config) {
                              confKey = `@${confKey}`;
                            }
                          }
                        }

                        try {

                          // IMPORTANTE
                          if (way.app_name_root != way.proc.name.split('.')[0]) {
                            var app_name_root = way.proc.name.split('.')[0];
                          }

                          var to_check_config_name = confKey;
                          if (!/^@/.test(confKey)) {
                            to_check_config_name = `@${app_name_root}.${confKey}`;
                          }

                          var o_confKey = confKey;
                          var confKey = await way.lib.parseConfigKey({
                            key: `way.config.${to_check_config_name}`
                          }).then((o) => {
                            return o;
                          }).catch((o) => {});

                          var hookProcKeys = Object.keys(eval(`${confKey}.hook.call`));
                          //console.log(hookProcKeys)

                          for (hookProcKey of hookProcKeys) {
                            //console.log(1, hookProcKey, way.proc.name)
                            if (new RegExp(`^${hookProcKey}`, "g").test(way.proc.name)) {
                              var hookCallNameKeys = Object.keys(eval(`${confKey}.hook.call["${hookProcKey}"]`));
                              //console.log(2, hookCallNameKeys)
                              for (hookCallNameKey of hookCallNameKeys) {
                                //console.log(3, hookCallNameKey, callname)
                                if (new RegExp(`^${hookCallNameKey}$`, "g").test(callname)) {
                                  hookCall = `${confKey}.hook.call["${hookProcKey}"]["${hookCallNameKey}"]`;
                                  //console.log(4, hookCall)
                                  way.lib.log({
                                    message: `Launch "${hookCallNameKey}" hook call from configuration profile "${o_confKey}"`,
                                    type: "verbose"
                                  });
                                  //console.log(iTask.args)
                                  //console.log(eval(hookCall))
                                  //iTask.args = Object.assign({}, eval(hookCall), iTask.args);
                                  iTask.args = Object.assign({}, iTask.args, eval(hookCall));
                                  //console.log(iTask.args)
                                }
                              }
                            } else {
                              way.lib.log({
                                message:`No call hooked from profile: ${callname} (${hookProcKey})`,
                                type: "log"
                              });
                            }
                          }

                          //way.lib.exit()

                        } catch (e) {}

                        
                      }


                    /* HOOK CALL ENV */
                      try {

                        var hookProcKeys = Object.keys(eval(`way.config.env.hook.call`));

                        for (hookProcKey of hookProcKeys) {
                          if (new RegExp(`^${hookProcKey}`, "g").test(way.proc.name)) {
                            var hookCallNameKeys = Object.keys(eval(`way.config.env.hook.call["${hookProcKey}"]`));
                            for (hookCallNameKey of hookCallNameKeys) {
                              if (new RegExp(`^${hookCallNameKey}$`, "g").test(callname)) {
                                hookCall = `way.config.env.hook.call["${hookProcKey}"]["${hookCallNameKey}"]`;
                                way.lib.log({
                                  message:`Call hooked from env: ${hookCall}`,
                                  type: "verbose"
                                });
                                iTask.args = Object.assign({}, iTask.args, eval(hookCall));
                              }
                            }
                          } else {
                            way.lib.log({
                              message:`No call hooked from env: ${callname} (${hookProcKey})`,
                              type: "log"
                            });
                          }
                        }
                      } catch (e) {}



                    //console.log(way.argcall)
                    //console.log('Before getArgs',callname, Object.assign({}, iTask.args, way.argcall))
                    //console.log(iTask.args, JSON.stringify(way.argcall))
                    if (typeof iTask.args !== "undefined" || JSON.stringify(way.argcall) != '{}') {
                      //console.log('-------OBTIENE ARGUMENTOS--------')
                      //console.log(Object.assign({}, iTask.args, way.argcall))
                      //console.log('---------------------------------')
                      way.argcall = way.lib.getArgs(callname, Object.assign({}, iTask.args, way.argcall));
                    }
                    //console.log('way.argcall', way.argcall)
                    //way.lib.exit()
                    way.lib.log({
                      label: `way.argcall (${callname})`,
                      message: way.argcall,
                      type: "log"
                    });
                    //console.log(`way.fromCLIToCheck`, way.fromCLIToCheck);
                    //console.log(`way.argcall`,way.argcall, callname);

                    // Obtiene configuración de libreria
                    
                    var libconfig = way.lib.getLibConfig(callname);
                    if (libconfig !== null) {
                      try {
                        var libarg = Object.keys(libconfig.args)
                        var tmp = [];
                        for (l of libarg) {
                          tmp.push(`.${l}`);
                        }
                        libarg = [...tmp];
                      } catch (e) {
                        var libarg = [];
                      }
                      //try {
                      //  libreq = way.lib.tree(libconfig.args.req)
                      //} catch (e) {
                      //  libreq = []
                      //}
                      //try {
                      //  libopt = way.lib.tree(libconfig.args.opt)
                      //} catch (e) {
                      //  libopt = []
                      //}
                      //var libarg = libreq.concat(libopt);
                    } else {
                      var libarg = [];
                    }


                    // Determina si hay argumentos no validos
                    var diff = way.lib.getArrayDiff({
                      array1: way.fromCLIToCheck,
                      array2: libarg
                    })
                    //console.log(way.fromCLIToCheck)
                    //console.log(libarg)
                    //console.log(diff)
                    //process.exit()
                    warnMessage = [];
                    if (diff.length > 0) {
                      for (var i = 0; i < diff.length; i++) {
                        warnMessage.push(`No soportado argumento "${diff[i].replace(/^./,"")}" desde CLI. Revisa la definición de "${callname}" desde "${way.map.lib[callname].split("/")[0]}"`);
                        try {
                          //console.log('elimina')
                          eval(`delete way.argcall${diff[i]}`);
                        } catch (e) {}
                      }
                    }
                    if (warnMessage.length > 0) {
                      for (wm of warnMessage) {
                        way.lib.log({
                          message: wm,
                          type: "log"
                        });
                      }
                    }


                    // NECESARIO PARA DECODIFICAR VALORES DE ARGUMENTOS
                    // Ejemplo: way ssh @grpr.site.dev.atam8 --cd "(({}.env.origin.privat))" --cmd "drush cr"
                    if (typeof Object.keys(way.env) !== "undefined") {
                      if (Object.keys(way.env).length > 0) {
                        way.argcall = await way.lib.decode({
                          data: way.argcall,
                          throwException: [ "simple", "global", "map" ] 
                        });
                      }
                    }

                    //console.log(way.argcall)
                    //way.lib.exit()


                    //argcallTree = way.lib.tree(way.argcall);

                    /* COMENTADO POR CAMBIOS Y SOPORTE A COLECCIÓN. REVISAR SI ES NECESARIO
                      if (libconfig !== null) {
                        //console.log(way.fromCLIToCheck)
                        //console.log(libconfig.args)
                        argLibTree = way.lib.tree(libconfig.args);
                        //console.log(argLibTree)

                        //console.log(way.fromCLIToCheck)

                        // Analiza valores desde CLI y convierte
                        p = 1;
                        oldSetting = undefined;
                        for (s of way.fromCLIToCheck) {
      
                          var re = new RegExp(`^${s.replace(".","\.")}`, "g"); 

                          oldSetting = s;
                          continueCheck = true;

                          if (!re.test(way.fromCLIToCheck[p])) {
                            oArgValue = eval(`oArgCall${s}`);
                            if (argLibTree.includes(`.req${s}`)) {
                              var argType = ".req"
                              var argTypeName = "requerido"
                            } else {
                              if (argLibTree.includes(`.opt${s}`)) {
                                var argType = ".opt"
                                var argTypeName = "opcional"
                              } else {
                                //way.lib.log({
                                //  message:`No soportado tipo de argumento "${s}"`,
                                //  type: "warning"
                                //});
                                //way.lib.exit(`No soportada opción "${s.replace(/^\./,"")}"`)
                                continueCheck = false;
                              }
                            }
                            //console.log(`libconfig.args${argType}${s}`)
                            if (continueCheck) {
                              try {
                                if (typeof eval(`libconfig.args${argType}${s}`) !== "undefined") {
                                  //console.log(eval(`libconfig.args.req${s}`), oArgValue, oArgValue.constructor.name)
                                  try {
                                    libArgType = eval(`libconfig.args${argType}${s}.constructor.name`);
                                    switch (libArgType) {
                                      case "Array":
                                        try {
                                          var ineritvalue = eval(`libconfig.args${argType}${s}`);
                                          if (ineritvalue.length == 0) {
                                            eval(`way.argcall${s} = [ oArgValue ]`);
                                          } else {
                                            ineritvalue.push(oArgValue)
                                            eval(`way.argcall${s} = ineritvalue`);
                                          }
                                        } catch (e) {
                                          way.lib.exit(`Fallo al establecer el valor del argumento ${argTypeName} "${s.replace(/\./,"")}" desde CLI.\n  |=> ${e.message}`)
                                        }
                                        break;
                                      case "Object":
                                        try {
                                          eval(`way.argcall${s} = JSON.parse(eval(\`oArgValue\`))`);
                                        } catch (e) {
                                          way.lib.exit(`Fallo al establecer el valor del argumento ${argTypeName} "${s.replace(/\./,"")}" desde CLI. Requiere objeto válido.\n  |=> ${e.message}`);
                                        }
                                        break;
                                    }
                                    //console.log(JSON.parse())
                                  } catch (e) {
                                    // VALOR ES NULL
                                  }
                                }
                              } catch (e) {way.lib.exit(e)}
                            }
                          } else {
                            //console.log('EXCLUYE OBJETO PADRE: '+s)
                          }

                          p++;
                        }
                      }
                    */

                    //console.log(2, way.argcall)
                    try {
                      if (libconfig.args.collection == true) {
                        way.argcall = Object.assign({}, way.argcall)
                      }
                    } catch (e) {}
                    //console.log(3, way.argcall)
                    
                    
                    //console.log(iTask)
                    //way.lib.exit()


                    // Establece llamada en función del tipo
                      call = `way.lib.${iTask.call}`
                      switch (iTask.callType) {
                        case 'Function':
                        case 'AsyncFunction':
                          iTask.callName = iTask.call;
                          iTask.callCmd = "";
                          if (iTask.callName == "exec") {
                            iTask.callCmd = way.argcall.cmd;
                          }
                          if (way.lib.check(way.argcall)) {
                            iTask.call = `${call}(${JSON.stringify(way.argcall)});`;
                            msgsimulate = `${call}(${JSON.stringify(way.argcall)})`;
                          } else {
                            iTask.call = `${call}();`;
                            msgsimulate = `${call}()`;
                          }
                          break;
                        default:
                          way.lib.exit(`Uso de "call" limitado a "Function" y "AsyncFunction". Tipo (${iTask.callType}) no soportado.`)
                          break;
                      }
                      
                  }


                //console.log('...........')
                eTask = [];

                //console.log(way.opt.apply, iTask)
                eTask.push({
                  applyWith: iTask.applyWith,
                  exclude: iTask.exclude,
                  label: iTask.label,
                  call: iTask.call,
                  callName: iTask.callName,
                  callType: iTask.callType,
                  callCmd: iTask.callCmd,
                  check: (way.lib.check(iTask.check)) ? iTask.check : undefined,
                });
                //console.log('----end')

                

                //Ejecuta
                  for await (task of eTask) {


                  //for (var e = 0; e < eTask.length; e++) {
                    //var task = eTask[e];

                    //console.log('TASK', task);

                    //way.out = {}
                    //way.out.buffer = ''

                    //console.log(task)
                    //console.log('OUT',way.out)

                    //console.log(Object.keys(iTask).length, Object.keys(iTask))
                    if (way.lib.check(task.check) && Object.keys(iTask).length == 1) {
                      way.lib.log({ message: `(1) Ejecuta tarea recursiva.`, type: "warning" });
                      await way.lib.manageTask(task);
                    } else {

                      // Copia tarea original (con check)
                        oTask = null;

                        //if (way.lib.check(task.check) && Object.keys(iTask).length > 1) {
                          oTask = Object.assign({}, task);
                          delete task.check
                        //}

                        //console.log(1,task.loop)

                        /*
                        if (task.loop) {
                          way.task.loop = true;
                        } else {
                          way.task.loop = false;
                        }
                        */
                        
                        //if (task.loop && !way.lib.check(way.out)) {
                        //  console.log('ENTRA', way.out)
                        //  way.out = null
                        //  //way.out = {}
                        //  //way.out.buffer = ''
                        //  //console.log(way.task.exclude, way.out)
                        //  //way.task.exclude = true;
                        //  task.exclude = true;
                        //} else {
                          //console.log('DECO', way.out)
                        // Descodifica tarea
                          //console.log('TASK:',task)
                          var taskdecoded = await way.lib.decode({
                            data: task,
                            throwException: [ "simple", "global", "map" ] 
                          });
                          //way.lib.exit()
                          if (way.lib.check(taskdecoded)) {
                            task = taskdecoded;
                          }
                          if (!way.lib.check(task)) {
                            way.lib.exit(`Task cannot be null.`)
                          }

                        //}


                      // Establece tiempos
                        //const { PerformanceObserver, performance } = require('perf_hooks');
                        //way.time = {}
                        //way.time.start = performance.now();


                      // Ejecuta tarea
                        if (
                          way.opt.d && 
                          task.callName != "cast" &&
                          task.callName != "var" && 
                          task.callName != "exec" && 
                          task.callName != "syncFile"
                          ) {
                          if (!way.lib.check(task.callCmd)) {
                            way.lib.log({ message: `${task.call}`, type: 'label' });
                          } else {
                            way.lib.log({ message: `${task.callCmd}`, type: 'sim' });
                          }
                        } else {

                          // FUERZA EJECUTAR TAREA SI ANTERIOR A DADO ERROR
                          if (way.lib.check(task.exclude) && task.exclude == false) {
                            way.task.excludeFlag = way.task.exclude;
                            way.task.exclude = false;
                          } else {
                            //console.log('-----------eee', way.task.excludeFlag, way.task.warn)
                            //way.lib.exit()
                          }

                          // APLICA SOLO TAREAS SELECCIONADAS POR OPCIÓN -a
                          //console.log()
                          //console.log(task)
                          //console.log(way.opt.apply)
                          //console.log(task.applyWith)

                          //console.log(hTask.length)
                          //console.log(task)

                          if (way.lib.check(task.applyWith)) {

                            if (!way.opt.apply.includes(task.applyWith)) {
                              way.task.exclude = true;
                            } else {
                              way.task.exclude = false;
                            }

                          } else {
                            /* IMPORTANTE )*/
                            /* AÑADIDO TRAS COMENTAR LINEA 862 index.js ( "if (way.lib.check(d.applyWith)) {" ) */
                            /* Soporte llamada "apply" en tiempo de ejecución */
                            //way.task.exclude = false;
                            if (way.lib.check(way.task.excludeFlag) && !way.lib.check(task.exclude)) {
                              way.task.exclude = way.task.excludeFlag;
                            }
                          }
                          //console.log('EXCLUDE:', way.task.exclude)

                          if (!way.opt.v && way.lib.check(task.label) && !way.opt.d && !way.task.exclude) {
                            way.lib.log({ message: `${task.label}`, type: "running" });
                          }
                          way.lib.log({ message:`${task.callType} call: ${task.call}` });
                          //way.lib.log({
                          //  message: task.call,
                          //  type: "verbose"
                          //});
                          var tocheck = Array.from(new Set(task.call.match(/(\(\(){1}\w*(\)\)){1}/g)));
                          if (tocheck.length > 0) {
                            if (way.proc.name != "get") {
                              way.lib.exit(`Referencias de bucle no reemplazadas`)
                            }
                            /*
                            for (ref of tocheck) {
                              console.log(ref)
                              if (way.lib.check(way.reference.map[ref])) {
                                originaRef = ref;
                                var re = new RegExp(ref.replace(/\(/g,'\\(').replace(/\)/g,'\\)'), "g");
                                tmp = JSON.stringify(task).replace(re, way.reference.map[originaRef]);
                                task = JSON.parse(tmp)
                              } else {
                                way.lib.exit(`Reference "${originaRef}" founded before execute task.`);
                              }
                            }
                            */
                          }
                          try {

                            /* EXCLUDE */
                              if (!way.task.exclude) {
                                var ma = []
                                ma = task.call.match(/\(\(.*\)\)/g);
                                if (way.proc.name != "get") {
                                  if (way.lib.check(ma)) {
                                    var haserors = false;
                                    for (var m = 0; m < ma.length; m++) {
                                      var error = true;
                                      if (/\{\}\.env\..*/.test(ma[m])) {
                                        if (way.proc.name == "up") {
                                          var error = false;
                                        }
                                      }
                                      if (error && !way.opt.d) {
                                        way.lib.log({
                                          message: `Fallo en remplazo: ${ma[m]}`,
                                          type: "warning"
                                        });
                                        var haserors = true;
                                      }
                                    }
                                    if (haserors && !way.opt.d) {
                                      way.lib.exit()
                                    }
                                  }
                                }
                              }

                              //way.lib.log({
                              //  label: callname,
                              //  message: way.argcall,
                              //  type: "log"
                              //});

                            
                            //console.log('TASK',task)
                            //console.log(way.task.exclude, task.label)


                            way.task.message = "-"
                            if (!way.task.exclude) {
                              //console.log('EJECUTA!!!', task)
                              //console.log(task.call)
                              //console.log(way.args)
                              if (task.callType === 'AsyncFunction') {
                                await eval(task.call).then(function(o){

                                  //console.log(`OUT:|${o}|`)
                                  way.lib.setOut(o);

                                  //console.log(1,way.out)
                                  way.task.warn = false;

                                  /*
                                  if (typeof o !== "undefined") {
                                    if (typeof o == "string" && way.lib.check(o)) {
                                      way.task.message = o;
                                    }
                                    if (way.lib.check(o.message)) {
                                      way.task.message = o.message;
                                    }
                                  }
                                  if (way.proc.name != "ssh") {
                                    if (way.task.message != "-" && way.lib.check(way.task.message)) {
                                      way.lib.log({
                                        message: way.task.message,
                                        type: "success"
                                      });
                                    }
                                  }
                                  */

                                  if (!way.opt.v && way.lib.check(task.label) && !way.opt.d) {
                                    way.lib.clearLogRunning()
                                    
                                    /*
                                    way.lib.log({
                                      message: `Completado (${task.label})`,
                                      type: "success"
                                    });
                                    */
                                    
                                  }
                                  
                                }).catch(function(o) {

                                  way.lib.setOut(o);

                                  resolve({code: o.code, message: o.message});
                                  
                                  /*
                                  if (typeof o !== "undefined") {
                                    if (way.lib.check(o.message)) {
                                      way.task.message = o.message;
                                    } else {
                                      way.task.message = o;
                                    }
                                    //way.task.message = way.task.message;
                                  }
                                  
                                  way.lib.setOut(o);
                                  way.task.warn = true;
                                  
                                  //console.log(way.task.message)
                                  // way.lib.log({
                                  //   message: way.task.message,
                                  //   type: "warning"
                                  // });

                                  //console.log('FALLO')
                                  */
                                  
                                  
                                });
                              } else {
                                o = eval(task.call);
                                way.lib.setOut(o);

                                
                                if (way.lib.check(task.label) && !way.opt.d) {
                                  way.lib.clearLogRunning()
                                  /*
                                  way.lib.log({
                                    message: `Completado (${task.label})`,
                                    type: "success"
                                  });
                                  */
                                }
                                
                                way.task.warn = false;
                                //resolve()
                              }
                            }
                            if (way.task.exclude) {
                              var status = color.bold.yellow(`EXCLUDED`);
                            } else {
                              if (way.task.warn) {
                                var status = color.bold.gray(`DENIED`);
                                way.task.exclude = true;
                              } else {
                                var status = color.bold.gray(`RESOLVED`);
                              }
                            }
                            if (way.log.level > 1) {
                              // console.log(status, color.gray(task.call));
                            }

                            var rend = way.lib.getPerformanceTask().toFixed(2);
                            way.task.log.push({
                              'Status': status,
                              'Proc.::Task': `${way.proc.name}`,
                              'Call': `${task.call.split("(")[0]}`,
                              'Call type': task.callType,
                              'Reason': way.task.message,
                              'Performance': `${rend} / ${(rend / 60).toFixed(2)} / ${(rend / 3600).toFixed(2)}`
                            });
                            way.task.message = ""


                          } catch (e){
                            if (e == `TypeError: Cannot read property 'then' of undefined`) {
                              way.lib.exit(`Fallo al ejecutar la tarea "${msgsimulate}" (Comprueba si debes de realizar una llamada asíncrona).`);
                            } else {
                              way.lib.log({ message:`${e}`, type:"warning" });
                              way.lib.log({ message:`Fallo al ejecutar la tarea "${msgsimulate}"` });
                            }
                          }

                          way.lib.log({ message:`task.warn: ${way.task.warn}` });
                          // Comprueba salida
                            if (way.lib.check(way.out)) {
                              way.lib.log({ message: way.out, label: "out" });
                              //way.lib.log({
                              //  message: `(out) ${JSON.stringify(way.out)}`,
                              //  type: "verbose"
                              //});
                            }
                        }
                        //console.log('OUT:', way.out)


                      // Ejecuta comprobaciones posteriores
                        if (way.lib.check(oTask) && way.lib.check(oTask.check)) {
                          if (!way.lib.check(oTask.check.data)) {
                            way.lib.exit(`Debes de establecer los datos a comprobar a través de la propiedad "data"`);
                          }
                          if (!way.lib.check(oTask.check.true) && !way.lib.check(oTask.check.false)) {
                            way.lib.exit(`Debes de establecer "check.true" o "check.false"`);
                          }
                          var status = await way.lib.checkReq({ data:oTask.check.data });
                          //console.log('STATUS',status)
                          if (status.includes(true) && status.every((val, i, arr) => val === arr[0])) {
                            way.lib.log({
                              message: `Selecciona task::TRUE`
                            });
                            if (way.lib.check(oTask.check.true)) {
                              oTask = oTask.check.true;
                            } else {
                              var doResolve = true
                            }
                          } else {
                            way.lib.log({
                              message: `Selecciona task::FALSE`
                            });
                            if (way.lib.check(oTask.check.false)) {
                              oTask = oTask.check.false;
                            } else {
                              var doResolve = true
                            }
                          }
                          if (doResolve) {
                            way.lib.log({ message: `No establecidas acciones para comprobación "${status}`, type: "log" });
                            //resolve();
                          } else {
                            for await (otask of oTask) {
                              way.lib.log({ message: `(2) Ejecuta tarea recursiva.`, type: "log" });
                              await way.lib.manageTask(otask)
                            }
                          }
                        }
                      
                    }

                  }


                //resolve();

              }


              resolve();

          } else {
            if (iTask.constructor.name == "Array") {
              for await (task of iTask) {
                if (way.lib.check(task.applyWith)) {
                  task.applyWith = await way.lib.decode({
                    data: task.applyWith
                  });
                  if (way.opt.apply.includes(task.applyWith)) {
                    delete task.applyWith;
                    await way.lib.manageTask(task);
                  }
                } else {
                  await way.lib.manageTask(task);
                }
              }
            }
            resolve()
          }
        }
        

      })();
    }, 0);
  });
}