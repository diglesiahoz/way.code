way.lib.loadConfig = function (_args) {
  var _args = way.lib.getArgs('loadConfig', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        const fs = require('fs');
        var loaded = {}
        //console.log(`ARGS: `,_args)

        
        for (configname of _args.key) {


          // EVITA PROBLEMA DE CACHE...
          if (typeof way.env._this !== "undefined") {
            var bkEnvThis = way.env._this
            way.env._this = {}
          }

    
          var oConfigName = configname;
          var tree = "";
          var nsetting = "";
          if (configname.split(".").length != 1) {
            var n = configname.split(".");
            for (var x = 0; x < n.length; x++) {
              var nsetting = n[x];
              if (!way.lib.check(tree)) {
                if (!way.lib.check(eval(`way.config["${nsetting}"]`))) {
                  eval(`way.config["${nsetting}"] = {}`);
                }
                var tree = `.${nsetting}`;
                var treeSignature = `["${nsetting}"]`;
              } else {
                if (!way.lib.check(eval(`way.config${treeSignature}["${nsetting}"]`))) {
                  eval(`way.config${treeSignature}["${nsetting}"] = {}`);
                }
                tree += `.${nsetting}`;
                treeSignature += `["${nsetting}"]`;
              }
              if ((tree.replace(/^\./,"") in way.map.config)) {
                configname = tree.replace(/^\./,"");
              }
            }
            var tree = tree.replace(/^\./,"");
          } else {
            var tree = configname;
            if (!way.lib.check(nsetting)) {
              var treeSignature = `["${configname}"]`;
            } else {
              var treeSignature = `["${nsetting}"]`;
            }
          }


          var stat = fs.statSync(`${way.map.config[configname]}`);
          var cache_name = `config.${configname}--${way.lib.getHash(stat.mtime.toString())}`;
          //console.log('CACHE_NAME:', cache_name)


          if (fs.existsSync(`${way.root}/.cache/${cache_name}`)) {

            var cache_data = way.lib.getCache(cache_name);

            eval(`way.config${treeSignature} = ${JSON.stringify(cache_data)}`);
            loaded[tree] = eval(`way.config${treeSignature}`);

          } else {


            if (!way.lib.check(eval(`way.config${treeSignature}`)) || _args.force == true) {
              if (!(configname in way.map.config)) {
                way.lib.exit(`Configuración "${configname}" no disponible`);
                //way.lib.log({
                //  message: `Configuración "${configname}" no disponible`,
                //  type: "warning"
                //});
                //return reject();
                //process.exit()
              } else {

                way.reference.configFrom[`${oConfigName}`] = {};
                way.reference.configFrom[`${oConfigName}`].configname = configname;
                way.reference.configFrom[`${oConfigName}`].tree = tree;
                way.reference.configFrom[`${oConfigName}`].treeSignature = treeSignature;
                way.reference.configFrom[`${oConfigName}`].required = [];
                var data = way.lib.getConfigFromPath(way.map.config[configname]);
                configSignature = `["${configname.replace(/\./g,"\"][\"")}"]`;
                eval(`way.config${configSignature} = ${JSON.stringify(data)}`);
                if (way.lib.check(data)) {
                  try {
                    for (required of eval(`way.config.${configname}.require.config`)){
                      way.lib.log({
                        message: `*Recursivo: ${required}`,
                        type: "log"
                      });
                      requiredConfig = await way.lib.loadConfig({
                        key: [required],
                        force: _args.force
                      });
                      way.reference.configFrom[`${oConfigName}`].required.push(required);
                    }
                  } catch (e) {}
                  //console.log(1, way.reference.configFrom[`${oConfigName}`].configname)
                  var data = await way.lib.decode({
                    data: way.reference.configFrom[`${oConfigName}`].configname,
                    excludeKeys: [ "[\"task\"]" ]
                  });
                  //console.log(data)
                  configname = way.reference.configFrom[`${oConfigName}`].configname;
                  treeSignature = way.reference.configFrom[`${oConfigName}`].treeSignature;
                  configSignature = `["${configname.replace(/\./g,"\"][\"")}"]`;
                  try {
                    oConfigNameSignature = `["${oConfigName.replace(/\./g,"\"][\"")}"]`;
                    eval(`way.config${oConfigNameSignature}.constructor.name`);
                  } catch (e) {
                    way.lib.log({
                      message: `Configuración "${oConfigName}" no disponible`,
                      type: "warning"
                    });
                    return reject();
                  }
                  eval(`way.config${configSignature} = ${JSON.stringify(data)}`);

                  var toCheck = [];
                  if (way.reference.configFrom[`${oConfigName}`].required.length > 0) {
                    toCheck = way.reference.configFrom[`${oConfigName}`].required;
                  } else {
                    try {
                      for (include of eval(`way.config${treeSignature}.include.config`)){
                        way.lib.log({
                          message: `*Recursivo: ${include}`,
                          type: "log"
                        });
                        if (way.map.configKey.includes(include)) {
                          includedConfig = await way.lib.loadConfig({
                            key: [include],
                            force: _args.force
                          });
                          toCheck.push(include);
                        }
                      }
                    } catch (e) {}
                    try {
                      for (required of eval(`way.config${treeSignature}.require.config`)){
                        way.lib.log({
                          message: `*Recursivo: ${required}`,
                          type: "log"
                        });
                        if (!way.map.configKey.includes(required)) {
                          way.lib.exit(`Configuración requerida "${required}" no disponible`);
                        }
                        requiredConfig = await way.lib.loadConfig({
                          key: [required],
                          force: _args.force
                        });
                        toCheck.push(required);
                      }
                    } catch (e) {}
                  }
                  /*
                  for (toCheckConfigName of toCheck){
                    requiredSignature = `["${toCheckConfigName.replace(/\./g,"\"][\"")}"]`;
                    try {
                      var o = {}
                      o = Object.assign(
                        {}, 
                        eval(`way.config${requiredSignature}`),
                        eval(`way.config${treeSignature}`),
                      );
                    } catch (e) {}
                    requiredConfigTree = way.lib.tree(eval(`way.config${requiredSignature}`));
                    for (treeKey of requiredConfigTree) {
                      try {
                        eval(`way.config${treeSignature}${treeKey}.constructor.name`)
                      } catch (e) {
                        eval(`o${treeKey} = way.config${requiredSignature}${treeKey}`)
                      }
                    }
                    eval(`way.config${treeSignature} = Object.assign({}, o);`);
                  } 
                  */
                  var o = {}
                  if (typeof way.config.env !== "undefined") {
                    if (Object.keys(way.config.env).includes('@')) {
                      eval(`o = way.config.env['@']`)
                    }
                  }
                  for (toCheckConfigName of toCheck){
                    requiredSignature = `["${toCheckConfigName.replace(/\./g,"\"][\"")}"]`;
                    for (treeKey of way.lib.tree(eval(`way.config${requiredSignature}`))) {
                      eval(`o${treeKey} = way.config${requiredSignature}${treeKey}`)
                    }
                  } 
                  eval(`way.config${treeSignature} = Object.assign({}, o, way.config${treeSignature});`);
                }
                way.lib.log({
                  message: `Carga configuración: ${configname}`,
                  type: "log"
                });
                loaded[tree] = eval(`way.config${treeSignature}`);
              }
            } else {
              way.lib.log({
                message: `Obtiene configuración: ${configname}`,
                type: "log"
              });
              loaded[tree] = eval(`way.config${treeSignature}`);
            }
          }




          for (c_key in loaded) {

            //console.log(way.reference.configFrom, oConfigName)

            if (way.lib.check(way.reference.configFrom[`${oConfigName}`])) {
              var from = way.reference.configFrom[`${oConfigName}`].tree
            } else {
              var from = configname;
            }


            
            //console.log(`CHECK: ${c_key}`, way.map.profileKey)

            if (way.map.profileKey.includes(c_key)) {
              
              var configRefKey = await way.lib.parseConfigKey({
                key:`${c_key}`,
                force: true
              });


              var map = c_key.replace(/^@/,"").split(".");

              way.env['_this'] = {};
              way.env['_this'].key = "";
              way.env['_this'].env = "";

              way.env['_this']._env = map.slice(-1).toString();
              eval(`${configRefKey}["_env"] = "${map.slice(-1).toString()}"`);
              map.pop();

              //
              // NO ELIMINAR...
              //
              // way.env['_this']._key = map.join(".").replace(/\./g,"").replace(/^@/g,"");
              // eval(`${configRefKey}["_key"] = "${map.join(".").replace(/\./g,"").replace(/^@/g,"")}"`);

              way.env['_this']._key = map.join(".").replace(/^@/g,"");
              eval(`${configRefKey}["_key"] = "${map.join(".").replace(/^@/g,"")}"`);

              way.env['_this']._parent_key = way.env['_this']._key.split('.')[0];
              eval(`${configRefKey}["_parent_key"] = "${way.env['_this']._key.split('.')[0]}"`);

              var tagFromString = await way.lib.getTagFromString({ data: way.env['_this']._key });
              way.env['_this']._tag = tagFromString.data;
              eval(`${configRefKey}["_tag"] = "${way.env['_this']._tag}"`);

              //console.log(way.env)
              //way.lib.exit()
              //console.log(configRefKey)

              var s = [];
              for (var i = 0; i < map.length; i++) {
                s[i] = map[i].charAt(0).toUpperCase() + map[i].slice(1);
              }
              way.env['_this']._name = `${ s.join("") }`;
              eval(`${configRefKey}["_name"] = "${ s.join("") }"`);
              
              way.env['_this']._name = c_key;
              eval(`${configRefKey}["_config_name"] = "${c_key}"`);
              
              way.env['_this']._path = way.map.config[c_key];
              eval(`${configRefKey}["_path"] = "${way.map.config[`${c_key}`]}"`);
              
              //console.log(way.env);way.lib.exit()

            } else {
              if (/^@/.test(c_key)) {
                console.log(way.map.profileKey)
                way.lib.log({ message: `Config. available: ${way.map.profileKey}`, type: "warning" })
                way.lib.exit(`Not found "${c_key}" configuration from loadConfig()`)
              }
            }
            

            //console.log(loaded[c_key])

            
            loaded[c_key] = await way.lib.decode({
              data: loaded[c_key],
              throwException: [ "simple" ],
              from: from
            });
            eval(`way.config${treeSignature} = ${JSON.stringify(loaded[c_key])}`);


            

            
            if (!fs.existsSync(`${way.root}/.cache/${cache_name}`)) {
              //var stat = fs.statSync(`${way.map.config[configname]}`);
              //console.log(way.map.config[configname], stat, `${way.lib.getHash(`${stat.mtime}`)}`)
              if (way.proc.name != "core.init") {
                way.lib.setCache(cache_name, loaded[c_key]);
              }
            }
            


          }


          // EVITA PROBLEMA DE CACHE...
          if (typeof bkEnvThis !== "undefined") {
            way.env._this = bkEnvThis;
          }


          //process.exit()

        }

        if (Object.keys(loaded).length == 1) {
          resolve(loaded[ Object.keys(loaded)[0] ]);
        } else {
          resolve(loaded)
        }
      })();
    }, 0); 
  });
}