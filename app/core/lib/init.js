//const { profile } = require('console');

const { type } = require('os');

//const { profile } = require('console');

way.lib.init = async function (_args){
  var _args = way.lib.getArgs('init', _args);

  const fs = require('fs');
  const glob = require('glob');
  const path = require('path');
  var columnify = require('columnify');
  var color = require('ansi-colors');
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        // ESTABLECE APLICACIONES PERSONALIZADAS
        if (typeof way.config.custom !== 'undefined') {
          if (typeof way.config.custom.apps !== 'undefined') {
            for (app in way.config.custom.apps) {
              if (fs.existsSync(`${way.root}/custom/app/${app}`)){
                if (way.opt.f) {
                  way.lib.log({ message: `Updating "${app}" app`, type: "label" });
                  await way.lib.exec({ cmd: `cd ${way.root}/custom/app/${app} && git pull -q`, out: true }).catch((e) => {
                    way.lib.exit(`Could not update "${app}" app`);
                  });
                } else {
                  way.lib.log({ message: `Skipping app "${app}" as it already exists in "${way.root}/custom/app/${app}"`, type: "label" });
                }
              } else {
                way.lib.log({ message: `Clonning "${app}" app`, type: "label" });
                await way.lib.exec({ cmd: `git clone ${way.config.custom.apps[app]} ${way.root}/custom/app/${app} 2>/dev/null`, out: false }).catch((e) => {
                  way.lib.exit(`Could not clone app "${app}"`);
                });
              }
            }
          }
        }
        

        for (file of _args.file) {
          var cFile = await way.lib.getFile({ 
            key: file.origin, 
            data: { 
              app: path.basename(way.root),
              func: `__${path.basename(way.root)}Complete__ ${way.app_name_root}`,
              root: way.root 
            } 
          }).then((o) => { 
            return o.data; 
          }).catch((o) => {});
          try {
            var syncFile = false;
            if (!file.ignoreIfExist) {
              syncFile = true;
            } else {
              if (!fs.existsSync(`${way.root}/${file.target}`)) {
                syncFile = true;
              }
            }
            if (syncFile) {
              fs.writeFileSync(`${way.root}/${file.target}`, cFile, 'utf8');
            }
          } catch (e) {
            way.lib.log({ message:`No se ha podido crear "${file.target}"`, type:"warning"});
          }
        }

        var complete = [];
        var customProfile = [];
        var help = {};
        help['proc'] = [];
        var errorMessage = [];
        var wayComplete = [];
        var barstatus = 1;
        if (way.opt.v) {
          barstatus = 0;
        }
        var configPwd = [];


        for (profile in way.map.config) {
          if (/^custom\/.*config\/@\//.test(way.map.config[profile])) {
            customProfile.push(profile);
            complete[profile] = [];
          }
        }

        
        if (barstatus) {
          var bar = way.lib.bar();
          bar.start(way.map.procKey.length, 0);
        }

        way.tmp.proc = {};
        way.args = {};

        for (configKey of way.map.procKey) {

          if (!barstatus) {
            way.lib.log({ message: `Parsing: ${configKey}`, type: "label" });
          }


          complete[configKey] = []; 

          try {

            way.tmp.proc.sig = `${way.app_name_root} ${configKey}`;

            var parseConfigKey = await way.lib.parseConfigKey({
              key: `${configKey}`,
              force: true
            }).then((o) => {
              return o;
            });
            await way.lib.loadConfig({key:[configKey]});
            procConfig = eval(`way.config${parseConfigKey}`);

            if (procConfig.allowed || !way.lib.check(procConfig.allowed)) {

              var singleHelp = {};
              var helpArgs = [];
              

              singleHelp['proc'] = `${color.green(configKey)}`;


              if (way.lib.check(procConfig.help)) {
                singleHelp['description'] = `\n${color.dim.white(procConfig.help)}`;
              }

              //singleHelp['example'] = `\n\n${color.dim.white(procConfig.example.join(", "))}`;
              singleHelp['example'] = `\n${color.dim.white(procConfig.example[0])}`;


              //way.lib.exit()

              try {
                if (!way.lib.check(procConfig.task.do)) {
                  errorMessage.push(`Procedimiento "${configKey}" no implementa propiedad "task.do"`);
                }
              } catch (e) {
                errorMessage.push(`Procedimiento "${configKey}" no implementa propiedad "task"`);
              }




              
              if (way.lib.check(procConfig.task.require)) {

                var taskRequire = procConfig.task.require;

                //console.log(configKey, taskRequire)

                var configRequired = false;
                if (way.lib.check(taskRequire.config)) {
                  try {
                    var nconf = 0;
                    var profileHelp;
                    for (var i = nconf; i < taskRequire.config.length; i++) {
                      var configSignature = taskRequire.config[nconf];
                      var rc = configSignature.split(" ");
                      if (rc.length > 1) {

                        for (profile of customProfile) {
                          var re = rc[0];
                          if (i == 0) {
                            profileHelp = re;
                          }
                          /*
                            if (profile == "@omt.dev" && configKey == "mysql.import") {
                              console.log(new RegExp(`^@${re}`,"g"), profile, configKey)
                              if (new RegExp(`^@${re}`,"g").test(`${profile}`)) {
                                console.log('OK')
                                way.lib.exit()
                              }
                            }
                          */


                          if (new RegExp(`^@${re}`,"g").test(`${profile}`)) {
                            
                            //console.log(configKey, wayComplete)
                            
                            if (!wayComplete.includes(profile)) {
                              wayComplete.push(profile);
                            }

                            

                            configRequired = true;
                            //complete[configKey].push(profile);
                            //console.log('OK',re,configKey,profile)

                            var c = way.lib.getConfigFromPath(way.map.config[profile]);

                            
                            // var added = false;
                            // if (typeof c['hook'] !== "undefined") {
                            //   if (typeof c['hook']['call'] !== "undefined") {
                            //     if (typeof c['hook']['call']['ssh'] !== "undefined") {
                            //       complete[configKey].push(profile);
                            //       added = true;
                            //     }
                            //   }
                            // }
                    
                            complete[profile].push(configKey);

                            

                            // AÑADE ALIAS A AUTOCOMPLETADO DE PERFIL
                            if (typeof way.map.aliasKeyRev[configKey] !== "undefined") {
                              for (alias of way.map.aliasKeyRev[configKey]) {
                                complete[profile].push(alias);
                              }
                            }

                            
                            

                            if (way.lib.check(c._pwd)) {
                              if (!configPwd.includes(`${c._pwd}:${profile}`)) {
                                configPwd.push(`${c._pwd}:${profile}`)
                                //way.lib.exit()
                              }
                            } else {
                              //way.lib.exit(`Cannot read property "_pwd" from ${profile}`)
                            }
                          } else {
                            //console.log('NO',re,configKey,profile)
                          }



                          if (configKey == "ssh") {
                            //way.lib.exit()
                          }

                          

                        }
                      }
                      nconf++;
                    }
                    //way.lib.exit()
                    if (way.lib.check(profileHelp)) {
                      singleHelp['proc'] = `${color.dim.yellow(`@${profileHelp}`)} ${color.green(configKey)}`;
                    } else {
                      singleHelp['proc'] = `${color.green(configKey)}`;
                      wayComplete.push(configKey);
                    }

                    //console.log(complete)
                    
                  } catch (e) {
                    way.lib.exit(e)
                  }
                }/* else {
                  wayComplete.push(configKey);
                }*/

                wayComplete.push(configKey);


                //
                // Analiza argumentos
                //
                if (way.lib.check(taskRequire.args)) {
                  for (arg in taskRequire.args) {

                    var setted = false;

                    var require_conf = taskRequire.args[arg];
                    if (typeof require_conf !== "undefined" && require_conf != null) {
                      if (require_conf.type == '.*') {
                        helpArgs.push(`${color.dim.grey('[(')}${color.dim.green(`${arg}`)}${color.dim.grey(')]')}`);
                        setted = true;
                      }
                    }

                    if (!setted) {
                      helpArgs.push(`${color.dim.grey('(')}${color.dim.green(`${arg}`)}${color.dim.grey(')')}`);
                    }
                  }
                }


                //
                // Analiza opciones
                //
                if (way.lib.check(taskRequire.opt)) {
                  
                  for (opt in taskRequire.opt) {
                    
                    var prefix = '--';
                    if (opt.length == 1) {
                      prefix = '-';
                    }

                    complete[configKey].push(`${prefix}${opt}`);

                    // AÑADE ALIAS A AUTOCOMPLETADO DE PERFIL
                    if (typeof way.map.aliasKeyRev[configKey] !== "undefined") {
                      for (alias of way.map.aliasKeyRev[configKey]) {
                        if (typeof complete[alias] === "undefined") {
                          complete[alias] = [];
                        }
                        complete[alias].push(`${prefix}${opt}`);
                      }
                    }

                    helpArgs.push(`${color.dim.grey('[')}${color.dim.green(`${prefix}${opt}`)}${color.dim.grey(']')}`);

                  }
                }


                //console.log(helpArgs)

              } else {
                wayComplete.push(configKey)
              }

              applyWith = [];
              for (a of way.lib.tree(procConfig)) {
                if (/\.applyWith/.test(a)) {
                  var action = await way.lib.query({
                    input: procConfig,
                    select: `${a}`
                  }).then((o) => { return o.data[0]; });
                  if (typeof complete[`${configKey}.--apply`] === "undefined") {
                    complete[`${configKey}.--apply`] = [];
                  }
                  if (!complete[`${configKey}.--apply`].includes(action)) {
                    complete[`${configKey}.--apply`].push(action);
                    if (!complete[`${configKey}`].includes('--apply')) {
                      complete[`${configKey}`].push('--apply');
                    }
                  }
                  if (!applyWith.includes(`${color.green('--apply')} ${color.green(action)}`)){
                    applyWith.push(`${color.green('--apply')} ${color.green(action)}`);
                  }
                }
              }


              if (way.lib.check(procConfig.task.complete)) {
                for (c of procConfig.task.complete) {
                  complete[configKey].push(c)
                }
              }


              if (helpArgs.length > 0) {
                singleHelp['proc'] += ` ${helpArgs.join(" ")}`;
              }
              if (applyWith.length > 0) {
                singleHelp['proc'] += ` ${color.dim.grey('[')}${color.dim.grey(applyWith.join(" | "))}${color.dim.grey(']')}`;
              }

              help['proc'].push(singleHelp);


            }

            //process.exit()

            
            if (barstatus) {
              bar.increment();
            }


          } catch (e) {
            way.lib.exit(e.toString())
            way.lib.log({message: `${configKey} => ${e.toString()}`, type: 'warn'});
          }
        }


        // AÑADE ALIAS
        wayComplete = wayComplete.concat(Object.keys(way.map.aliasKey));
        wayComplete = wayComplete.filter((element, index) => {
          return wayComplete.indexOf(element) === index;
        });


        //process.exit()

        if (barstatus) {
          bar.stop();
        }



        if (errorMessage.length > 0) {
          for (var i = 0; i < errorMessage.length; i++) {
            way.lib.log({
              message: errorMessage[i],
              type: 'warn'
            });
          }
          //way.lib.exit();
        }


        // PWD
        try {
          fs.writeFileSync(`${way.root}/.cache/out.pwd`, configPwd.sort().join("\n"), 'utf8');
        } catch (e) {
          return reject({message: e.message})
        }



        // Establece ficheros de completado
          for (key in complete) {
            try {
              fs.writeFileSync(`${way.root}/.cache/complete.way.${key}`, complete[key].sort().join("\n"), 'utf8');
            } catch (e) {
              return reject({message: e.message})
            }
          }
          try {
            fs.writeFileSync(`${way.root}/.cache/complete.way`, wayComplete.sort().join("\n"), 'utf8');
          } catch (e) {
            return reject({message: e.message})
          }



        // HELP
          var help_out = "";
          help_out += `${help_out}\n`;
          //help_out += `  ` + color.bold.grey(`~~~`) + color.bold.white(` ${way.pkg.name} `) + color.bold.grey(`~~~`);
          //help_out += `${color.dim.bold.white(`\n`)}`;
          //help_out += `${color.dim.bold.white(`\n`)}`;
          help_out += columnify(help['proc'], {
            columns: ['proc', 'description', 'example'],
            showHeaders: false,
            preserveNewLines: true,
            paddingChr: '',
            columnSplitter: '  '
          });
          help_out += `${color.dim.bold.white(`\n`)}`;
          //help_out += `${color.dim.bold.white(`\n`)}`;

          //
          // NO ELIMINAR
          //
          // help_out += `${color.italic.grey(`Opciones:`)} ${color.dim.white(``)}`;
          // help_out += `${color.dim.bold.white(`\n`)}`;
          // data = [];
          // for (o of Object.keys(way.config.core.opt).sort()) {
          //   optConf = way.config.core.opt[o];
          //   if (o.length == 1) {
          //     var prefix = "-"
          //   } else {
          //     var prefix = "--"
          //   }
          //   data.push({
          //     opt: `${color.green(`  ${prefix}`)}${color.green(o)}`,
          //     description: color.dim.white(`${(way.lib.check(optConf.help) ? `${optConf.help}`: "" )}`)
          //   });
          // }
          // help_out += columnify(data, {
          //   columns: ['opt', 'description'],
          //   showHeaders: false,
          //   preserveNewLines: true,
          //   paddingChr: '',
          //   columnSplitter: '  '
          // });
          // help_out += `${color.dim.bold.white(`\n`)}`;
          // help_out += `${color.dim.bold.white(`\n`)}`;

          //help_out += `${color.bold.grey(`~~~~~~~~~~~`)}`;
          //help_out += `${color.dim.bold.white(`\n`)}`;
          try {
            //console.log(help_out)
            fs.writeFileSync(`${way.root}/.cache/out.help`, JSON.stringify(help_out).replace(/^"/,"").replace(/"$/,"").replace(/\\"/g,"\""), 'utf8');
          } catch (e) {
            return reject({message: e.message})
          }

        
        // GENERA DOCUMENTACIÓN
        await way.lib.makeDocs({});

 
        // CACHE
          var cacheCore = {}
          cacheCore.pkg     = way.pkg;
          cacheCore.lib     = way.lib;
          cacheCore.map     = way.map;
          //cacheCore.config  = way.config;
          way.lib.setCache('core', cacheCore);
        

        // Permisos
          way.lib.log({
            message: `Normalizando permisos...`,
            type: `log`
          });
          await glob.sync(`**/*`, {
            ignore: [
              '**/node_modules/**',
              '**/.git/**',
              '**/*.yml',
              '**/*.sh',
            ],
          }).map(file => {
            if (fs.lstatSync(file).isDirectory()) {
              fs.chmodSync(file, '775');
            } else {
              fs.chmodSync(file, '664');
            }
          });
          await glob.sync(`**/*.yml`, {
            ignore: [],
          }).map(file => {
            fs.chmodSync(file, '660');
          });
        
        
        // // Acciones finales
        //   await way.lib.exec({
        //     cmd: ". ~/.bashrc"
        //   }).catch((o) => {
        //     //console.log(o)
        //     way.lib.log({message: o});
        //   })

          resolve({
            message: "Completado"
          });


      })();
    }, 0); 
  });
}