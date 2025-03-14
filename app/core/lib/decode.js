way.lib.decode = function (_args) {
  var _args = way.lib.getArgs('decode', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        //console.log(_args)

        var data = _args.data;
        var odata = data;
        var opt = opt || {};
        //opt.throwException = opt.throwException || [];
        //opt.data = opt.data || {};
        //opt.showWarn = (opt.showWarn == false) ? false : true;
        //opt.from = opt.from || "";
        //if (way.lib.check(opt.data)) {
        //  console.log('DATA',opt.data)
        //}
        var datafromfile = false;
        if (way.lib.check(way.map.config[data])) {
          data = way.lib.getConfigFromPath(way.map.config[data]);
          datafromfile = true;
        }
        var bkdata = data;
        var sdata = JSON.stringify(data);
        //console.log(sdata)
        //var refpattern = /\{\{[a-z0-9\.\(\)\[\]:_@~]*\}\}/g;
        //var refpattern = /\{\{[\(\)\.a-zA-Z0-9]*\}\}/g;
        //var refpattern = /\(\([\{\}\.a-zA-Z0-9_\?\s\\"\[\]\(\)]*\)\)/g;
        var refpattern = /\((\(|\[)[\{\}\.a-zA-Z0-9_\-\?\\"\[\]\(\)]*(\)|\])\)/g;
        var references = [];
        references = sdata.match(refpattern);
        //console.log('REFERENCES', references)
        //way.lib.exit();
        if (way.lib.check(references)) {
          way.reference.replace = {};
          references = way.lib.unique({
            data: references
          });
          //console.log('REFERENCES',references);

          for (var i = 0; i < references.length; i++) {
            var oReferenceMap = references[i].split("))((");
            if (oReferenceMap.length > 1) {
              delete references[i];
              oReferenceMap.forEach(element => {
                if (!element.startsWith("((") && !element.endsWith("))")) {
                  element = `((${element}))`;
                } else {
                  if (!element.endsWith("))")) {
                    element = `${element}))`;
                  }
                  if (!element.startsWith("((")) {
                    element = `((${element}`;
                  }
                }
                references.push(element);
              });
            }
          }
          
          references = way.lib.unique({
            data: references
          });

          for (var i = 0; i < references.length; i++) {
            var refpattern = /\)\).*\(\(/g;
            if (way.lib.check(references[i].match(refpattern))) {
              var oReferenceMap = references[i].split(/\)\).*\(\(/);
              if (oReferenceMap.length > 1) {
                delete references[i];
                oReferenceMap.forEach(element => {
                  if (!element.startsWith("((") && !element.endsWith("))")) {
                    element = `((${element}))`;
                  } else {
                    if (!element.endsWith("))")) {
                      element = `${element}))`;
                    }
                    if (!element.startsWith("((")) {
                      element = `((${element}`;
                    }
                  }
                  references.push(element);
                });
              }
            }
          }

          references = way.lib.unique({
            data: references
          });
          //console.log('REFERENCES',references);

          for (var i = 0; i < references.length; i++) {
            var oReference = references[i];
            //console.log(oReference)
            var reference  = references[i].replace("((","").replace("))","");
            var refvalue   = null;
            
            /*
            var condicionalReference = false;
            var refconditionalvalue = undefined;
            if (/\s\?\s/.test(reference)) {
              var refobj = reference.split("?");
              refobj = refobj.map(Function.prototype.call, String.prototype.trim);
              refconditionalvalue = refobj[1];
              if (way.lib.check(refconditionalvalue)) {
                refconditionalvalue = `((${refconditionalvalue}))`;
              } else {
                refconditionalvalue = refconditionalvalue;
              }
              //var refobj = refobj[0].split(".");
              var refobj = refobj[0].split(/\.(.+)/);
              condicionalReference = true;
              if (!/^\(\(.*\)\)$/.test(refconditionalvalue) && way.lib.check(refconditionalvalue)) {
                way.lib.exit(`No soportada referencia condicional "${oReference}" con valor explicito "${refconditionalvalue}"`)
              }
            } else {
            */
              //var refobj = reference.split(".");
              //var refobj = way.lib.removeEmptyFromArray(reference.split(/\.(.+)/));
              //var refobj = reference.split(/\.(.+)/);
              //var refconditionalvalue = undefined;
            /*
            }
            */

            
            var refCleaned = reference.replace(/^\(\[/,'')
            refCleaned = refCleaned.replace(/\]\)$/,'')
            var refobj = refCleaned.split(/\.(.+)/);
            //console.log(refobj)

            var refkey = refobj[0];
            var refsetting = refobj[1];

            if (way.lib.check(refsetting)) {
              refsetting = refsetting.replace(/\[/g,"[\"").replace(/\]/g,"\"]");
              if (!/^\./.test(refsetting) && !/^\[/.test(refsetting)) {
                refsetting = `.${refsetting}`
              }
            }
            //console.log(reference, refobj, refkey, refsetting)
            //console.log(datafromfile, refobj, refobj.length, `"${refkey}"`, `"${refsetting}"`, condicionalReference);

            if (/^[0-9]*$/.test(reference) && /^[0-9]*$/.test(refkey)) {
              way.lib.log({ message: `Salta referencia (${reference})` });
            } else {
              var refaccess = null;
              var matchtype = false;

              // simple
                if (refkey != "{}" && /^[a-zA-Z0-9_\-\.\[\]]*$/.test(reference)) {
                  reftype = 'simple';
                  refsetting = reference;
                  if (!/^\./.test(refsetting) && !/^\[/.test(refsetting)) {
                    refsetting = `.${refsetting}`
                  }
                  try {
                    if (datafromfile) {
                      refaccess_key = odata;
                    } else {
                      if (way.lib.check(_args.from)) {
                        refaccess_key = _args.from;
                      } else {
                        refaccess_key = way.args[0];
                      }
                    }
                    //console.log(eval(`way.config.${refaccess_key}`))
                    if (way.lib.check(_args.gData)) {
                      var reference = await way.lib.parseConfigKey({
                        key:`${reference}`,
                        force: true
                      });
                      refaccess = `_args.gData${reference}`;
                    } else {
                      refaccess = `way.config.${refaccess_key}${refsetting}`;
                    }
                    //console.log(refaccess)
                    matchtype = true;
                  } catch (e) {
                    way.lib.exit(e.stack)
                  }
                }
              // global
                if (refkey == "{}" && refsetting != "" && refobj.length >= 2) {
                  if (way.tmp.manageTask) {
                    reftype = 'global';
                    refobj.shift();
                    if (/^[\w\.\-]*$/.test(refobj.join("."))) {
                      refsetting = refsetting.substring(1);
                      refsetting = await way.lib.parseConfigKey({
                        key: refsetting,
                        force: true
                      });
                      refaccess = `way${refsetting}`;
                      try {
                        way.lib.log({ message: `Check: ${refaccess}.constructor.name` });
                        var refglobaltype = eval(`${refaccess}.constructor.name`);
                        switch (refglobaltype) {
                          case 'Function':
                          case 'AsyncFunction':
                            way.lib.exit(`Referencia "${reftype}:${refglobaltype}" a no soportada "${oReference}"`);
                          break;
                        }
                      } catch (e) {
                        if (!way.opt.d && !way.task.exclude) {
                          if (_args.throwException.includes(reftype)/* && !condicionalReference*/) {
                            if (/\{\}\.env\..*/.test(oReference)) {
                              
                            } else {
                              if (way.proc.name != "core.get" && way.proc.name != "get") {
                                if (typeof odata == 'string') {
                                  console.log('==========');
                                  console.log(odata);
                                  console.log('==========');
                                  way.lib.exit(`Referencia "${reftype}" no implementada: "${oReference}"`);
                                } else {
                                  if (refaccess != "way.out.buffer") {
                                    if (!way.opt.d)
                                      way.lib.exit(`Referencia "${reftype}" no implementada: "${oReference}"`);
                                  }
                                }
                              } else {
                                matchtype = true;
                              }
                            }
                          }
                        }
                      }
                      matchtype = true;
                    }
                  } else {
                    matchtype = true;
                  }
                }
              // map
                if (refkey != "{}" && /^\{\w*\}$/.test(refkey) && refsetting != "") {
                  reftype = 'map';
                  refkey = refkey.replace(/^\{/,"").replace(/\}$/,"");
                  if (way.envBatch.status) {
                    var refSignature = way.reference.config[refkey][way.envBatch.num];
                  } else {
                    var refSignature = way.reference.config[refkey];
                  }
                  if (!way.lib.check(refsetting)) {
                    if (way.lib.check(way.env[`${refkey}`])) {
                      refaccess = `way.config.${refSignature}`;
                    }
                    matchtype = true;
                  } else {
                    if (way.lib.check(way.env[`${refkey}`])) {
                      refaccess = `way.config.${refSignature}${refsetting}`;
                    }
                    matchtype = true;
                  }
                }
              
              if (!matchtype) {
                way.lib.exit(`Referencia "${oReference}" no soportada. (Fallo en sintaxis)`);
              }
              
              //console.log('*************',refaccess,'*************')
              //console.log(eval(refaccess))

              //way.lib.log({message:`(${reftype}): ${refaccess} --${refvalue}--`, type:"label"});
              try {
                
                refaccess = await way.lib.parseConfigKey({
                  key: refaccess
                });
                //console.log('refaccess',refaccess)

                var refvalue = eval(refaccess);

                /*
                if (condicionalReference && !way.lib.check(refvalue)) {
                  throw 'condicionalReference undefined';
                }
                */
              } catch(e) {
                /*
                if (condicionalReference) {
                  if (`-${refconditionalvalue}-` == `--`) {
                    var refobjjoin = refobj.join(".");
                    var re = new RegExp(`${refobj[0]}\.${refobj[1]}`, "g");
                    var toCheck = refobjjoin.replace(re,"");
                    try {
                      var libsetting = eval(`way.config.lib.${refobj[0]}.config.lib.${refobj[0]}.${refobj[1]}.args`);
                      for (k of way.lib.getTree(libsetting)) {
                        if (k.replace(/^\.(opt|req)/,"") == toCheck) {
                          var refvalue = eval(`libsetting${k}`)
                        }
                      }
                    } catch (e) {
                      //way.lib.exit(e)
                    }
                  } else {
                    var refvalue = refconditionalvalue
                  }
                } else {
                */
                  if (!way.lib.check(refvalue) && !way.lib.isObjEmpty(opt) && way.lib.check(_args.throwException)) {
                    if (_args.throwException.includes(reftype)) {
                      //console.log(odata)
                      if (/\{\}\.env\..*/.test(oReference)) {
                        
                      } else {
                        if (!way.opt.d) {
                          if (way.proc.name != "core.get" && way.proc.name != "get") {
                            if (!/^\(\[.*\]\)$/.test(oReference)) {
                              way.lib.exit(`Referencia "${oReference}" no definida.`);
                            }
                          }
                        }
                      }
                    }
                  }
                /*
                }
                */
              }

              /*
              if (!way.lib.check(refvalue) && condicionalReference) {
                if (/^\\".*\\"$/.test(refconditionalvalue)) {
                  if (refconditionalvalue == '\\"\\"') {
                    refconditionalvalue = undefined
                  } else {
                    refconditionalvalue = refconditionalvalue.replace(/^\\"/,"").replace(/\\"$/,"")
                  }
                }
                var refvalue = refconditionalvalue;
                if (/\(\([\{\}\.a-zA-Z0-9_\?\s\\"\(\)]*\)\)/g.test(refvalue)) {
                  if (_args.showWarn) {
                    way.lib.log({
                      message: `Recursivo: ${oReference}`,
                      type: "log"
                    });
                  }
                  refvalue = await way.lib.decode({
                    data: refvalue
                  });
                }
              }
              */

              if (!way.lib.check(refvalue) && !way.lib.isObjEmpty(opt) && way.lib.check(_args.throwException)) {
                if (_args.throwException.includes(reftype)) {
                  if (typeof refvalue == "undefined" && !way.opt.d && !way.task.exclude) { 

                    if (!way.task.loop) {
                      if (!/^\(\[.*\]\)$/.test(oReference)) {
                        way.lib.exit(`Referencia "${reftype}" sin valor: "${oReference}"`);
                      }
                    }
                    
                  }
                  if (refvalue == null) {}
                }
              }

              if (typeof refvalue !== "undefined" && refvalue != null) {
                subreferences = refvalue.toString().match(refpattern);
                if (way.lib.check(subreferences)) {
                  for (var sub = 0; sub < subreferences.length; sub++) {
                    var subplaceholdervalue = way.reference.replace[subreferences[sub]];
                    if (way.lib.check(subplaceholdervalue)) {
                      refvalue = refvalue.replace(subreferences[sub], subplaceholdervalue)
                    }
                  }
                }
                way.reference.map[reference] = refvalue;
                way.reference.replace[oReference] = refvalue;
                try {
                  //way.lib.log({ message: `Reference (${reftype}, ${typeof refvalue}):\n\t- ${reference} === ${refaccess}\n\t- ${JSON.stringify(refvalue)}` });
                } catch (e) {}
              }
            }
          }
          // Actualiza configuración
            var udata = undefined;
            for (var refkey in way.reference.replace) {
              stringify = false
              var refvalue = way.reference.replace[refkey];
              var reftype = typeof refvalue;
              if (!way.lib.check(udata)) {
                udata = sdata;
              }
              if (reftype === "string") {
                refvalue = refvalue.replace(/"/g,'\\"');
                replace = refvalue;
              } else {
                expkey = refkey
                         .replace(/\{/g,'\\{')
                         .replace(/\}/g,'\\}')
                         .replace(/\(/g,'\\(')
                         .replace(/\)/g,'\\)')
                         .replace(/\[/g,'\\[\\"')
                         .replace(/\]/g,'\\"\\]')
                         .replace(/\?/g,'\\?')   
                if (refvalue !== null) {
                  try {
                    var replace = JSON.stringify(refvalue)
                  } catch(e) {}
                } else {
                  var replace = null;
                }
                expkey = `"${expkey}"`
                var re = new RegExp(expkey,"g");
                if (!way.lib.check(udata.match(re))){
                  flag = undefined;
                  if (!Array.isArray(refvalue)) {
                    stringify = true
                  }
                  way.lib.log({ message: udata });
                  if (_args.showWarn) {
                    way.lib.log({ message: `Referencia mixta. Sentencia con referencia/s comparte tipos de datos distintos. "${refkey}" ==> "${typeof refvalue}"`, type: "log" });
                  }
                }
                udata = udata.replace(re, refkey);
                if (refvalue !== null) {
                  try {
                    var replace = JSON.stringify(refvalue)
                  } catch(e) {}
                } else {
                  var replace = null;
                }
              }

              expkey = refkey.replace(/\(/g,'\\(').replace(/\)/g,'\\)').replace(/\{/g,'\\{').replace(/\}/g,'\\}').replace(/\?/g,'\\?').replace(/\[/g,'\\[').replace(/\]/g,'\\]');
              //console.log(expkey)
              //if (/\s\?\s/.test(refkey)) {
              //  if (/\?.*".*"/.test(refkey) && !/\?.*\[.*\]/.test(refkey)) {
              //    replace = `"${replace}"`
              //    expkey = expkey.replace(/\"/g,'\\"');
              //    expkey = `"${expkey}"`;
              //  } else {
              //    if (!/\?\s[0-9]*/.test(refkey) && !/\?\s\[\]/.test(refkey) && !/\?\s\{\}/.test(refkey)) {
              //      way.lib.exit('No soportado array u objecto implicito con valor en referencia condicional.', refkey)
              //    }
              //    expkey = `${expkey}`;
              //  }
              //}

              var re = new RegExp(expkey,"g");
              if (stringify) {
                replace = JSON.stringify(replace).replace(/^"/,"").replace(/"$/,"")
                //way.lib.exit()
              }
              //console.log(re, udata)
              var udata = udata.replace(re, replace);
              //console.log(re, udata)
            }
            if (way.lib.check(udata)) {
              udata = way.lib.scapeBreakLines(udata);
              try {
                way.reference.replace = {};
                var msg = (typeof odata == 'string') ? `Decoded "${odata}" code...` : `Decoded code...`;
                /* VERIFICAR EN TODOS LOS PROCEDIMIENTOS */
                //udata = udata.replace(/\\s/g, '\\\\\\\\s')
                //             .replace(/\\w/g, '\\\\\\\\w')
                //             //.replace(/\\d/g, '\\\\\\\\d')
                //             .replace(/\\ /g, '\\\\\\\\ ')
                //             //.replace(/\\\./g, '\\\\\\\\.')
                //console.log(JSON.parse(udata))

                //udata = udata.replace(/\\ /g, '\\\\ ')
                
                //var udata = udata
                //                 .replace(/\\n/g, '\\n')
                //                 .replace(/\\'/g, "\\'")
                //                 .replace(/\\"/g, '\\"')
                //                 .replace(/\\&/g, '\\&')
                //                 .replace(/\\r/g, '\\r')
                //                 .replace(/\\t/g, '\\t')
                //                 .replace(/\\b/g, '\\b')
                //                 .replace(/\\f/g, '\\f')
                //                 .replace(/\\s/g, '\\s')
                //                 .replace(/\\w/g, '\\w')
                                 
  
                //udata = udata
                //             .replace(/\\d/g, '\\\\\\\\d')
                //             //.replace(/\\s/g, '\\\\\\\\s')
                //             //.replace(/\\w/g, '\\\\\\\\w')
                //             .replace(/\\ /g, '\\\\\\\\ ')
                //             //.replace(/\\\./g, '\\\\\\\\.')



                //console.log(udata) 
                //console.log('-----------')    
                //console.log('OK 1');       
                //data = JSON.parse(udata.replace(/\\\\/g, '\\\\\\\\'));
                data = JSON.parse(udata);
                //console.log(data);

              } catch (e) {
                console.log(e)
                console.log(udata);
                if (_args.showWarn) {
                  var msgErrObj = e.message.split(" ");
                  pos = msgErrObj.pop();
                  way.lib.log({
                    message:`${e.message} =====> ${udata.substr(pos - 1, 50 )}`,
                    type: "warning"
                  });
                }
                way.lib.exit(`Fallo de sintaxis al decodificar objeto.`);
              }
            } else {
              data = JSON.parse(sdata);
            }
        }
        // Comprueba si se ha de hacer roolback de remplazos
        if (!way.lib.isObjEmpty(opt) && way.lib.check(opt.excludeKeys) && Array.isArray(opt.excludeKeys)) {
          for (var ex = 0; ex < opt.excludeKeys.length; ex++) {
            try {
              eval(`data${opt.excludeKeys[ex]}=bkdata${opt.excludeKeys[ex]}`)
            } catch (e){}
          }
        }
        way.reference.replace = {};
        //return data;
        resolve(data);
      })();
    }, 0); 
  });
}
