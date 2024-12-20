way.lib.getArgs = function (callname, argstocheck) {

  //if (callname == "addCustomApp") {
  //  console.log('------',callname, argstocheck)
  //}

  var callargs = {};
  if (!way.lib.check(way.map.lib[callname])) {
    way.lib.exit(`No implementada llamada "${callname}"`);
  }
  try {
    callargs = {}
    var libconfig = way.lib.getLibConfig(callname);
    //console.log(libconfig);
    if (libconfig !== null) {

      var libsettingskeys = Object.keys(libconfig);
      var libsettings = libconfig;

      if (libsettingskeys.includes("args")) {
        if (way.lib.check(libsettings.args)) {
          //console.log('ENTRA', callname, libsettings.args)
          //callargs = Object.assign({}, libsettings.args.req, libsettings.args.opt);
          callargs = Object.assign({}, libsettings.args);

          
          
          //if (callname == "uma.main") {
          //  console.log(0, callname)
          //  console.log(callname, callargs)
          //}

          //console.log('callargs: ',callargs);console.log()

          try {
            argstocheck.constructor.name;
          } catch (e) {
            argstocheck = {};
          }

          manageArgs = [];
          argLibTree = way.lib.tree(libsettings.args);
          //console.log('argLibTree', argLibTree);

          //console.log('argstocheck:',argstocheck); console.log()
          var settingToCheck = Object.keys(argstocheck);
          //console.log('settingToCheck', settingToCheck)


          /* GLOBAL */
            try {
              var subscribeCall = way.config.env.suscribe.call[callname];
            } catch (e) {}
            /* APP */
            try {
              var subscribeCall = Object.assign({}, subscribeCall, way.config.lib[`${way.proc.name}`].env.suscribe.call[callname]);
            } catch (e) {}
            if (typeof subscribeCall !== "undefined") {
              console.log('TODO!! getArgs (47)')
              process.exit()
            }


          

          var numReqSetting = 0;
          var settRequired = [];

          try {
            var callArgsTree = way.lib.getTree(callargs);
            for (sett of callArgsTree) {
              if (/^\..*\.required$/.test(sett)) {
                if (eval(`callargs${sett}`)) {
                  numReqSetting++;
                  var t = sett.split(".");
                  delete t[0];
                  delete t[t.length - 1];
                  var t = t.join(".");
                  settRequired.push(t);
                }
              }
            }
          } catch (e) {}
          //console.log(numReqSetting)
          //console.log(settRequired.length)
          

          //console.log(libconfig)

          var onlyData = false;

          
          
          //if (callname == "uma.main") {
          //  console.log('ARGSTOCHECK', Object.values(argstocheck).length, Object.values(argstocheck) );
          //}
          var oCallargsString = JSON.stringify(Object.values(callargs));



          if (libconfig.collection === true) {
            //console.log('COLLECTION!')
            colObjNum = 0;
            //console.log(argstocheck);
            for (atc in argstocheck) {
              if (/^[0-9]*$/.test(atc)) {
                colObjNum ++;
              }
            }
            if (colObjNum == 0) {
              var j = {}
              j[0] = argstocheck
              argstocheck = j;
              colObjNum = 1
            }
            for (var i = 0; i < colObjNum; i++) {
              //console.log('i:',i)
              for (atc in argstocheck) {
                if (!/^[0-9]*$/.test(atc)) {
                  eval(`argstocheck[${i}]["${atc}"] = argstocheck["${atc}"]`)
                }
              }
              if (typeof subscribeCall !== "undefined") {
                //manageArgs.push(Object.assign({}, callargs, subscribeCall, argstocheck[i]));
                console.log('TODO!!')
                process.exit();
              } else {
                //manageArgs.push(Object.assign({}, callargs, argstocheck[i]));
                //console.log(Object.keys(callargs))
                manageArgs[i] = [];
                //manageArgs.push([]);
                for (atc of Object.keys(callargs)) {
                  //console.log('-', atc)
                  callargs[atc].value = argstocheck[i][atc];
                  //console.log(`${atc}:`, callargs[atc])
                  //manageArgs.push(Object.assign({}, callargs[atc]));
                  //manageArgs[i].push(Object.assign({}, callargs[atc]));
                  manageArgs[i].push(Object.assign({}, callargs[atc]));
                }
              }
            }
            //console.log('FIN!')
            //console.log(manageArgs)
            //way.lib.exit()
          } else {
            if (typeof subscribeCall !== "undefined") {
              //  manageArgs.push(Object.assign({}, callargs, subscribeCall, argstocheck));
              console.log('TODO!!')
              process.exit();
            } else {
              //  manageArgs.push(Object.assign({}, callargs, argstocheck));
              for (key of Object.keys(callargs)) {
                if (
                  Object.keys(callargs).length == 1 
                  && numReqSetting == 1
                  && typeof callargs[key].value === "undefined"
                  && typeof argstocheck[key] === "undefined"
                  ) {
                  //console.log(1)
                  var onlyData = true;
                  callargs[key].value = argstocheck;
                } else {
                  //console.log(2)
                  callargs[key].value = argstocheck[key];
                }
                manageArgs.push(Object.assign({}, callargs[key]));
              }
            }
          }


          callargsKeys = Object.keys(callargs);
          //console.log(callargsKeys)
          if (libconfig.collection === true) {
            //console.log(Object.values(argstocheck).length)
            //console.log()
            //console.log(JSON.stringify(Object.values(argstocheck)))
            //console.log()
            //console.log(oCallargsString)
            //console.log()
            //console.log(JSON.stringify(Object.values(callargs)))
            //console.log()
            //console.log(JSON.stringify(manageArgs[0]))
            if (JSON.stringify(Object.values(argstocheck)) == "[{}]") {
              //console.log('VACIO!!!!!')
              manageArgs = [];
            }/* else {
              console.log('DISTINTO!!!!!!!')
            }*/
          }


          //console.log(callargs)
          //console.log(argstocheck)
          
          //if (callname == "uma.main") {
          ////if (callname == "exec") {
          //  //console.log(1)
          //  //console.log(manageArgs); console.log()
          //  //way.lib.exit()
          //}




          args = {};
          var x = 0;
          for (ma of manageArgs) {

            warnMessages = [];
            warn = false;

            // COLLECTION
            //if (callname == "cron.stop" || callname == "uma.main") {
            //  console.log(callname, ma.constructor.name, ma)
            //}
            if (ma.constructor.name == "Array") {
              args[x] = {};
              var p = 0;
              for (oma of ma) {
                var key = callargsKeys[p];

                // COMPRUEBA
                  if (
                      typeof oma['type'] === "type" || 
                      typeof oma['type'] === "required" || 
                      typeof oma['type'] === "defaultValue"
                     ) {
                    warnMessages.push(`Fallo al definir interfaz de llamada (${callname}[${x}]). Propiedades requeridas: type, required, defaultValue`);
                    warn = true;
                  }

                  if (oma['required'] 
                        && typeof oma['value'] === "undefined") {
                    warnMessages.push(`Propiedad "${key}" requiere valor desde interfaz "${callname}[${x}]"`);
                    warn = true;
                  }

                  if (!oma['required'] 
                        && typeof oma['defaultValue'] !== "undefined" 
                        && typeof oma['value'] === "undefined") {
                    oma['value'] = oma['defaultValue'];
                    warn = true;
                  }

                  try {
                    var type = oma['value'].constructor.name;
                    if (oma['value'].constructor.name !== oma['type'] && oma['type'] !== null) {
                      warnMessages.push(`Propiedad "${key}" requiere "${oma['type']}". Detectado "${type}" desde llamada "${callname}[${x}]"`);
                      warn = true;
                    }
                  } catch (e) {}


                args[x][key] = oma['value'];
                try {
                  delete way.config.core.interface[callname]['args'][x][key]['value'];
                } catch(e) {}
                try {
                  delete way.config.custom.interface[callname]['args'][x][key]['value'];
                } catch(e) {}
                

                p++;
              }

              if (warnMessages.length > 0) {
                for (msg of warnMessages) {
                  way.lib.log({
                    message: msg,
                    type: "warning"
                  });
                } 
                way.lib.log({
                  message: new Error().stack,
                  type: "log"
                });
                process.exit()
              }

              // MUY IMPORTANTE PARA DEVOLVER A LLAMADA ARRAY DE OBJETOS
              args = Object.values(args);
              //console.log('fin collection')
              //way.lib.exit()

            } 
            // NO COLLECTION
            else {
              
              var key = callargsKeys[x];
              
              // COMPRUEBA
                if (
                    typeof ma['type'] === "type" || 
                    typeof ma['type'] === "required" || 
                    typeof ma['type'] === "defaultValue"
                   ) {
                  warnMessages.push(`Fallo al definir interfaz de llamada (${callname}). Propiedades requeridas: type, required, defaultValue`);
                  warn = true;
                }

                if (ma['required'] 
                      && typeof ma['value'] === "undefined") {
                  warnMessages.push(`Propiedad "${key}" requiere valor desde interfaz "${callname}"`);
                  warn = true;
                }

                if (!ma['required'] 
                      && typeof ma['defaultValue'] !== "undefined" 
                      && typeof ma['value'] === "undefined") {
                  ma['value'] = ma['defaultValue'];
                  warn = true;
                }

                try {
                  var type = ma['value'].constructor.name;
                  //console.log('type', type);
                  //console.log('ma.type', ma['type']);
                  if (ma['value'].constructor.name !== ma['type'] && ma['type'] !== null) {
                    warnMessages.push(`Propiedad "${key}" requiere "${ma['type']}". Detectado "${type}" desde llamada "${callname}"`);
                    warn = true;
                  }
                } catch (e) { }


              if (warnMessages.length > 0) {
                //console.log(warnMessages)
                for (msg of warnMessages) {
                  way.lib.log({
                    message: msg,
                    type: "warning"
                  });
                } 
                way.lib.log({
                  message: new Error().stack,
                  type: "log"
                });
                process.exit()
              } else {

                args[key] = ma['value'];
                //delete manageArgs[x];
                //console.log(manageArgs[x])

                try {
                  delete way.config.core.interface[callname]['args'][key]['value'];
                } catch(e) {}
                try {
                  delete way.config.custom.interface[callname]['args'][key]['value'];
                } catch(e) {}
              }
            }

            x++;
          }

          
          //if (callname == "cron.stop" || callname == "uma.main") {
          //  console.log('fin!')
          //  console.log(callname, args)
          //  //way.lib.exit()
          //}

          //console.log(callname, settingToCheck)
          if (!onlyData && libconfig.collection === false) {
            warnMessages = [];
            //console.log(callname, settingToCheck)
            //console.log(args)
            //console.log()
            //console.log(Object.keys(callargs))
            //console.log(settingToCheck)
            for (stc of settingToCheck) {
              //console.log(stc, args[stc])
              //way.tmp.args.push(stc);
              if (typeof args[stc] === "undefined") {
                if (typeof way.args[stc] == "undefined") {
                  //console.log(way.tmp.args.filter((item, index) => way.tmp.args.indexOf(item) === index))
                  //if (!way.tmp.args.filter((item, index) => way.tmp.args.indexOf(item) === index).includes(stc)) {
                    warnMessages.push(`No detectado argumento "${stc}" en procedimiento "${way.proc.name}" ni en interfaz de llamada "${callname}"`)
                  //} else { 
                  //  way.tmp.args.push(stc);
                  //}
                }
              }
            }
            
            
            if (warnMessages.length > 0) {
              //console.log(warnMessages)
              //process.exit()
              for (msg of warnMessages) {
                way.lib.log({
                  message: msg,
                  type: "warning"
                });
              } 
              //way.lib.log({
              //  message: new Error().stack,
              //  type: "log"
              //});
              process.exit();
            }
            
          }



          //var callargs = args;
          

          //if (callname == "removeDuplicateFromArray") { 
          //  console.log(`callargs (${callname})`, args);
          //  //process.exit() 
          //}



          /*
            try {
              reqargs = way.lib.tree(libsettings.args.req)
            } catch (e) {
              reqargs = []
            }
            try {
              optargs = way.lib.tree(libsettings.args.opt)
            } catch (e) {
              optargs = []
            }
            
            var allSettings = reqargs.concat(optargs);


            try {
              argstocheck.constructor.name;
            } catch (e) {
              argstocheck = {};
            }
            manageArgs = [];
            argLibTree = way.lib.tree(libsettings.args);
            //settingToCheck = [];
            //for (j of argLibTree) {
            //  var test = j.replace(/\.(req|opt)*\./,"");
            //  if (!/^\./.test(test)) {
            //    settingToCheck.push(test)
            //  }
            //}
            //console.log(argLibTree)
            //console.log(callname, argstocheck.constructor.name)
            switch (argstocheck.constructor.name) {
              case "Object":

                // GLOBAL
                try {
                  var subscribeCall = way.config.env.suscribe.call[callname];
                } catch (e) {}
                // APP
                try {
                  var subscribeCall = Object.assign({}, subscribeCall, way.config.lib[`${way.proc.name}`].env.suscribe.call[callname]);
                } catch (e) {}


                var callArgsTree = way.lib.getTree(callargs);
                if (libconfig.args.collection === true) {
                  //console.log('COLLECTION!')
                  colObjNum = 0;
                  for (atc in argstocheck) {
                    if (/^[0-9]*$/.test(atc)) {
                      colObjNum ++;
                    }
                  }
                  if (colObjNum == 0) {
                    var j = {}
                    j[0] = argstocheck
                    argstocheck = j;
                    colObjNum = 1
                  }
                  for (var i = 0; i < colObjNum; i++) {
                    for (atc in argstocheck) {
                      if (!/^[0-9]*$/.test(atc)) {
                        eval(`argstocheck[${i}]["${atc}"] = argstocheck["${atc}"]`)
                      }
                    }
                    if (typeof subscribeCall !== "undefined") {
                      manageArgs.push(Object.assign({}, callargs, subscribeCall, argstocheck[i]));
                    } else {
                      manageArgs.push(Object.assign({}, callargs, argstocheck[i]));
                    }
                  }
                } else {
                  if (typeof subscribeCall !== "undefined") {
                    manageArgs.push(Object.assign({}, callargs, subscribeCall, argstocheck));
                  } else {
                    manageArgs.push(Object.assign({}, callargs, argstocheck));
                  }
                }

                // Comprueba sintaxis de argumentos
                for (c of argLibTree) {
                  if (/_/.test(c)) {
                    way.lib.exit(`Fallo de sintaxis en definición de argumentos desde llamada "${callname}". Caracteres válidos [a-zA-Z]`)
                  }
                }

                //console.log()
                //console.log(JSON.stringify(callargs))
                //console.log(JSON.stringify(manageArgs[0]))
                //console.log()
                if (libconfig.args.collection === true) {
                  if (JSON.stringify(callargs) == JSON.stringify(manageArgs[0])) {
                    manageArgs = [];
                    //way.lib.exit('entra')
                  }
                }


                for (ma of manageArgs) {
                  warnMessages = [];
                  warn = false;
                  for (x of argLibTree) {
                    var st = x.split(".")[1];
                    var stN = (st == "req") ? "requerido": "opcional";
                    var s = x.replace(/^\.(req|opt)/,"");
                    if (way.lib.check(s)) {
                      try {
                        if (eval(`libsettings.args.${st}${s}`) == null) {
                          if (st == "req" && eval(`ma${s}`) === null) {
                            s = s.replace(/\./,"");
                            //way.lib.log({
                            //  message: `Argumento ${stN} "${s}" sin valor desde "${callname}"`,
                            //  type: "warning"
                            //});
                            warnMessages.push(`LLamada "${callname}" (${way.proc.name}) espera valor en argumento ${stN} "${s}"`);
                            warn = true;
                          }
                        } else {
                          try {
                            argLibType = eval(`libsettings.args.${st}${s}.constructor.name`);
                            argImpType = eval(`ma${s}.constructor.name`);
                            //console.log(s, argLibType, argImpType, st)
                            if (st == "req" && (argLibType == "String" && argImpType == "String") && eval(`ma${s}`) == "") {
                              s = s.replace(/\./,"");
                              //way.lib.log({
                              //  message: `Argumento ${stN} "${s}" espera "${argLibType}" desde "${callname}"`,
                              //  type: "warning"
                              //});
                              warnMessages.push(`LLamada "${callname}" (${way.proc.name}) espera "${argLibType}" desde argumento ${stN} "${s}"`);
                              warn = true;
                            }
                            if (argLibType != argImpType) {
                              //console.log(s, argLibType, argImpType)
                              if (way.lib.check(way.fromCLIToCheck) && ((argLibType == "Array" || argLibType == "Object") && argImpType == "String") ){
                                if (way.fromCLIToCheck.includes(s)) {
                                  //way.lib.log({
                                  //  message: `Trata después "${s}"`,
                                  //  type: "warning"
                                  //});
                                }
                              } else {
                                s = s.replace(/\./,"");
                                //way.lib.log({
                                //  message: `Argumento ${stN} "${s}" espera "${argLibType}" e implementado "${argImpType}" desde "${callname}"`,
                                //  type: "warning"
                                //})
                                warnMessages.push(`LLamada "${callname}" (${way.proc.name}) espera "${argLibType}" e implementado "${argImpType}" desde argumento ${stN} "${s}"`);
                                warn = true;
                              }
                            } else {}
                          } catch (e) {
                            //console.log('NO IMPLEMENTADO',s, eval(`libsettings.args.${st}${s}.constructor.name`), eval(`libsettings.args.${st}${s}`), `ma${s}`)
                            try {
                              type = eval(`libsettings.args.${st}${s}.constructor.name`)
                              if (type == "String") {
                                eval(`ma${s} = "${eval(`libsettings.args.${st}${s}`)}"`)
                              } else {
                                if (type == "Object") {
                                  eval(`ma${s} = {}`)
                                } else {
                                  eval(`ma${s} = ${eval(`libsettings.args.${st}${s}`)}`)
                                }
                              }
                              //console.log(ma)
                            } catch (e) {
                              if (!warn) {
                                //way.lib.log({
                                //  message: `Fallo al establecer "${s.replace(/\./,"")}"\n  |=> ${e}`,
                                //  type: "warning"
                                //});
                                warnMessages.push(`Fallo al establecer "${s.replace(/\./,"")}"\n  |=> ${e}`);
                                warn = true;
                              }
                            }
                          }
                        }
                      } catch (e) {}
                    }
                  }
                  if (warnMessages.length > 0) {
                    for (msg of warnMessages) {
                      way.lib.log({
                        message: msg,
                        type: "warning"
                      });
                    } 
                    way.lib.log({
                      message: new Error().stack,
                      type: "log"
                    });
                    process.exit()
                  }
                }

                if (libconfig.args.collection === true) {
                  callargs = manageArgs;
                } else {
                  callargs = manageArgs[0];
                }

                break;
              case "Array":
              case "String":
              case "Number":
              case "Boolean":
              case "Date":
                callargs[allSettings[0].replace(/^\./,"")] = argstocheck;
                break;
              default:
                way.lib.exit('No soportado')
                break
            }
          */
        } else {
          var args = {}
        }
      } else {
        var args = {}
      }
      //if (callname == "api.main") { 
      //  way.lib.exit() 
      //}
    }
    //return callargs;
    return args;
  } catch (e) {
    way.lib.exit(`Fallo al obtener argumentos desde llamada "${callname}". ${e}`)
  }
}