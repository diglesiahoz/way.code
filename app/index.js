const { resolve } = require('dns');

process.setMaxListeners(0);


(async () => {


  const fs = require('fs');
  const { PerformanceObserver, performance } = require('perf_hooks');
  var os = require("os");
  var color = require('ansi-colors');
  var figures = require('figures');
  var path = require('path');
  var glob = require('glob');

  const { networkInterfaces } = require('os');

  const nets = networkInterfaces();
  const ip = [];
  for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
          if (net.family === 'IPv4' && !net.internal) {
            ip.push(net.address);
          }
      }
  }

  //console.log(process.env)
  //console.log(process.env.PWD)
  //console.log(process.cwd())

  way = {
    pkg: {},
    //argv: {},
    envBatch: false,
    batch: {},
    hooked: {},
    argcall: [],
    fromCLIToCheck: [],
    //out: {},
    lib: {},
    map: {
      lib: {}
    },
    opt: {},
    optSig: "",
    args: {
      '@': [],
    },
    task: {
      log: []
    },
    app_name_root: process.env.WAY_CODE_APP_NAME,
    apps: [],
    reference: {},
    config: {},
    start: new Date(),
    time: {},
    exec: `${process.execPath} ${__filename}`,
    cmd: process.argv.slice(2).join(" "),
    hash: require('crypto').createHash('md5').update(`${process.execPath} ${__filename} ${process.argv.slice(2).join(" ")}`).digest("hex"),
    pid: process.pid,
    // pwd: process.cwd(),
    pwd: process.env.PWD,
    root: __dirname,
    root_app: "",
    ip: ip,
    //user: os.userInfo().username,
    //user_home: os.homedir(),
    user: os.userInfo(),
    date: "",
    id: "",
    config: {},
    reference: {
      config: {},
      map: {},
      replace: {},
      configFrom: {}
    },
    proc: {},
    var: {},
    env: {
      _this: {}
    },
    envBatch: {
      status: false,
      num: 0,
      now: null
    },
    tmp: {
      manageTask: false,
      args: [],
      out: []
    },
    log: {
      level: 0
    },
    cache: false,
    _this: {},
  };
  var date_year = way.start.getFullYear();
  var date_month = way.start.getMonth()+1;
  date_month = (date_month < 10) ? `0${date_month}`: date_month;
  var date_day = way.start.getDate();
  date_day = (date_day < 10) ? `0${date_day}`: date_day;
  var date_hours = way.start.getHours();
  date_hours = (date_hours < 10) ? `0${date_hours}`: date_hours;
  var date_minutes = way.start.getMinutes();
  date_minutes = (date_minutes < 10) ? `0${date_minutes}`: date_minutes;
  var date_seconds = way.start.getSeconds();
  date_seconds = (date_seconds < 10) ? `0${date_seconds}`: date_seconds;
  way.date = `${date_year}-${date_month}-${date_day}---${date_hours}:${date_minutes}:${date_seconds}` ;
  way.id = `${way.date}---${way.pid}`;
  way.time.start = performance.now();
  process.chdir( way.root )

  //console.log(way.date)
  //console.log(way)
  //console.log(way.app_name_root)
  //console.log(way.user)
  //process.exit()


  // CACHE
    if (
      /^core.init/.test(way.cmd)
      || require('minimist')(process.argv.slice(2), {})['r']
      || require('minimist')(process.argv.slice(2), {})['v']
      || require('minimist')(process.argv.slice(2), {})['l']
      || require('minimist')(process.argv.slice(2), {})['d']
      ) {
      
      if (
        /^core.init/.test(way.cmd)
        || require('minimist')(process.argv.slice(2), {})['r']
        ) {
        await glob.sync(`${way.root}/.cache/**/*`, {
          ignore: [],
        }).map(file => {
          fs.rmSync(`${file}`, { recursive: true, force: true });
        });
        try {
          if (
            (require('minimist')(process.argv.slice(2), {})['v']
            || require('minimist')(process.argv.slice(2), {})['l']
            || require('minimist')(process.argv.slice(2), {})['d'])
            && !require('minimist')(process.argv.slice(2), {})['o']
            ) {
            console.log(color.bold.cyan('All cache cleared!'))
          }
        } catch (e) {
          // console.log(e)
        }
      } else {
        try {
          fs.unlinkSync(`${way.root}/.cache/core`);
          if (
            (require('minimist')(process.argv.slice(2), {})['v']
            || require('minimist')(process.argv.slice(2), {})['l']
            || require('minimist')(process.argv.slice(2), {})['d'])
            && !require('minimist')(process.argv.slice(2), {})['o']
            ) {
            console.log(color.bold.cyan('Cleared core cache!'))
          }
        } catch (e) {
          // console.log(e)
        }
      }

    }

    
    try {
      fs.mkdirSync(`${way.root}/.cache`);
    } catch (e) {}


    var cache_name = "core";
    if (fs.existsSync(`${way.root}/.cache/core`)) {
      var coreCache = fs.readFileSync(`${way.root}/.cache/core`, 'utf8');
      var coreCacheParsed = JSON.parse(coreCache, function(key, value) {
        if (typeof value === "string" &&
            value.startsWith("/Function(") &&
            value.endsWith(")/")) {
          value = value.substring(10, value.length - 2);
          //return (0, eval)("(" + value + ")");
          return new Function(
            'exports',
            'require',
            'module',
            '__filename',
            '__dirname',
            `return ${value}`
          )(exports,require,module,__filename,__dirname);
        }
        return value;
      });
      Object.assign(way, coreCacheParsed);
      way.cache = true;
    }





  var checkoriginalkeys = Object.keys(way);
  //console.log(checkoriginalkeys)
  


  // Carga librerias
    if (!way.cache) {
      try {
        require(`${way.root}/core/lib/tree`);
        way.map.lib[`tree`] = `${way.root}/core/lib/tree`;
      } catch (e) {
        console.log(`\x1b[31;1m%s\x1b[0m`, `Requiere función de librería "tree".`);
        process.exit();
      }
      try {
        require(`${way.root}/core/lib/getKeys`);
        way.map.lib[`getKeys`] = `${way.root}/core/lib/getKeys`;
      } catch (e) {
        console.log(`\x1b[31;1m%s\x1b[0m`, `Requiere función de librería "getKeys".`);
        process.exit();
      }
      try {
        require(`${way.root}/core/lib/getLib`);
        way.map.lib[`getLib`] = `${way.root}/core/lib/getLib`;
      } catch (e) {
        console.log(`\x1b[31;1m%s\x1b[0m`, `Requiere función de librería "getLib".`);
        process.exit();
      }
      try {
        require(`${way.root}/core/lib/exit`);
        way.map.lib[`exit`] = `${way.root}/core/lib/exit`;
      } catch (e) {
        console.log(`\x1b[31;1m%s\x1b[0m`, `Requiere función de librería "exit".`);
        process.exit();
      }
      var currentnumloaded = Object.keys(way.map.lib).length;
      var sourcestype = [ "core", "custom" ];
      for (var source = 0; source < sourcestype.length; source++) {
        //console.log('#########################')
        if (sourcestype[source] == 'core') {
          child_dir = "lib"
        }
        if (sourcestype[source] == 'custom') {
          child_dir = "app"
        }
        //process.exit()
        var lib = way.lib.getLib(`${way.root}/${sourcestype[source]}/${child_dir}`);
        //console.log(`LIB (${sourcestype[source]}):`,lib)
        //process.exit()
        var libkeys = Object.keys(lib);
        //console.log(libkeys)
        if (libkeys.length < currentnumloaded) {
          var currentnumloaded = way.lib.getKeys(way.lib).length;
          //console.log(currentnumloaded)
        }
        for (var l = 0; l < libkeys.length; l++) {
          var libname = libkeys[l];
          var libpath = lib[libname];
          //console.log()
          //console.log(libname, libpath);
          var libtree = libpath.replace(way.root, "").replace(/^\/(core|custom)\/(app|lib)/, "").split("/");
          //console.log(libtree)
          if (libtree.length > 1) {
            libtree.pop();
            for (var i = 0; i < libtree.length; i++) {
              if (eval(`typeof way.lib.${libtree[i]}`) == 'undefined') {
                //console.log(`way.lib.${libtree[i]} = {};`)
                eval(`way.lib.${libtree[i]} = {};`);
              }
            }
          }
          if (typeof way.map.lib[libname] == "undefined") {
            try {
              require(`${way.root}/${libpath}`);
              //console.log(`Cargado... ${libname} (${way.root}/${libpath})`)
            } catch (e) {
              console.log(`\x1b[37;2m%s\x1b[0m`, e.stack);
              way.lib.exit(`No se puede cargar "${libname}"`);
            }
            if (checkoriginalkeys.length !== Object.keys(way).length) {
              way.lib.exit(`No está permitido inyectar al objeto global. Revisa por favor "${libpath}"`);
            }
            var numlib = way.lib.getKeys(way.lib).length;
            //console.log(numlib, (numlib - currentnumloaded))
            if ((numlib - currentnumloaded) == 0) {
              way.lib.exit(`No añade función "${libname}" a librería. Revisa el fichero "${libpath}"`);
            }
            if ((numlib - currentnumloaded) != 1) {
              way.lib.exit(`Solo se permite añadir una función por fichero. Revisa el fichero "${libpath}"`);
            }
            libadded = way.lib.getKeys(way.lib)[numlib - 1];
            if (libadded != path.basename(libname)) {
              way.lib.exit(`El nombre de la función y el nombre del archivo debe de coincidir (${libname} != ${libadded}). Revisa el fichero "${libpath}"`);
            }

            //console.log(libname)
            //var key = libname;
            //var ktree = key.split(".");
            //if (ktree.length > 1) {
            //  console.log(ktree[0])
            //  var parent = `${libpath.split(ktree[0])[0]}${ktree[0]}`;
            //  console.log(parent)
            //}

            //way.map.lib[`${libname}`] = libpath;

            currentnumloaded++;
          }
        }
      }

      //console.log(way.map.lib);way.lib.exit();
      
    }






  // Requisitos de aplicación
    if (!way.cache) { 
      way.pkg = require('./package.json');
    }
    if (!require('semver').satisfies(process.version, way.pkg.engines.node)) {
      way.lib.exit(`Required node version ${way.pkg.engines.node} not satisfied with current version ${process.version}.`);
    } else {
      //way.lib.log({message: `Acepta "NodeJS" ${process.version}`});
    }


  // Establece mapa
    if (!way.cache) {
      way.lib.getMap()
    }
    //console.log('OK')
    //console.log(way.apps)
    //console.log(way.map.procKey)
    //console.log(way.map.configKey)
    //console.log(way.map.aliasKey)
    //way.lib.exit()


  // Inicia variables relativas a configuración
    /*
    if (way.cache) {
      way.config = {};
      way.reference = {
        config: {},
        map: {},
        replace: {},
        configFrom: {}
      };
    }
    */

    //way.lib.exit()

  // Carga configuración del core
    var stat = fs.statSync(`${way.map.config['core']}`);
    var cache_name = `config.core--${way.lib.getHash(stat.mtime.toString())}`;
    if (way.lib.checkCache(cache_name)) {
      // SI EN CACHÉ
      var data = JSON.parse(way.lib.getCache(cache_name));
    } else {
      // NO EN CACHÉ
      var data = way.lib.getConfigFromPath(way.map.config['core']);
      way.lib.setCache(cache_name, JSON.stringify(data));
    }
    way.config.core = data;















    








  // Determina nombre del procedimiento
    process.argv.slice(2).some( argv => {
      if (!/^\@/g.test(argv) && !/^-/g.test(argv)) {
        return way.proc.name = argv;
      }
    });
    if (!way.lib.check(way.map.config[way.proc.name])) {
      // Obtiene alias del nombre del procedimiento
      if (way.lib.check(way.proc.name)) {
        var output = await way.lib.getAlias({ data: way.proc.name });
        if (typeof output.data !== "undefined") {
          way.proc.name = output.data;
        } else {
          way.lib.exit(`No disponible procedimiento "${way.proc.name}"`);
        }
      } else {
        // No establecido nombre del procedimiento
        if (/^@/.test(process.argv.slice(2)[0])) {
          way.proc.name = "core.get";
          way.proc.forced = true;
        } else {
          way.proc.name = "core.help";
          way.proc.forced = true;
        }
      }
    }
    if (!way.lib.check(way.proc.name)) {
      way.lib.exit(`Not found procedure`);
    }
    way.proc.appconfig = `${way.map.config[way.proc.name].split('config')[0]}config`;
    way.proc.appname = way.proc.appconfig.replace(/^custom\/app\//,"").split("/")[0];
    a = way.proc.appconfig.split("/");
    x = a.pop()
    delete a[x]
    way.proc.approot = a.join("/");
    way.root_app = `${way.root}/${way.proc.approot}`;

    // console.log()
    // console.log(`way.proc.name: ${way.proc.name}`);
    // console.log(`way.proc.approot: ${way.proc.approot}`);
    // console.log(`way.root_app: ${way.root_app}`);
    // way.lib.exit()


  // Carga configuración del procedimiento
    await way.lib.loadConfig({ key: [way.proc.name] });
    procNameParsed = await way.lib.parseConfigKey({
      key: way.proc.name,
      force: true
    });
    way.proc.code = eval(`way.config${procNameParsed}`);
    if (way.lib.check(way.proc.code.allowed) && !way.proc.code.allowed && !way.proc.forced) {
      way.lib.exit(`No disponible procedimiento "${way.proc.name}"`)
    }



  // Establece opciones por defecto (core)
    Object.keys(way.config.core.opt).forEach( opt_name => {
      way.opt[opt_name] = way.config.core.opt[opt_name].default;
    });


  // Analiza argumentos
    way.args._ = "";
    var minimist_args = require('minimist')(process.argv.slice(2), {});
    //console.log(minimist_args)
    //console.log(Object.keys(minimist_args))

    var tmp_values = [];
    var app_args = [];
    var found_proc_name = false;
    process.argv.slice(2).forEach( argv => {

      //console.log();console.log(`ARGV: ${argv}`)

      // PROFILE
      if (/^\@[a-z.]*/g.test(argv)) {
        //console.log(`PROFILE!`)
        way.args['@'].push(argv.replace(/^\@/,""));
      }
      // COMPLEX OPTION
      else if (/^--[a-z.]*/g.test(argv)) {
        var opt_name = argv.replace(/^--/,"");
        //console.log(`COMPLEX OPTION! ${opt_name} ${app_args.length} ${found_proc_name}`)
        //if (app_args.length > 0) {
          way.args._ = (way.lib.check(way.args._)) ? `${way.args._} ${argv}` : `${argv}` ;
        //}
        try {
          if (way.lib.check(way.config.core.opt[opt_name])) {
            opt_source = `way.config.core.opt`;
          } else {
            if (way.lib.check(way.proc.code.task.require.opt[opt_name])) {
              opt_source = `way.proc.code.task.require.opt`;
            }
          }
        } catch (e) { 
          // console.log(e)
        }
        try {
          var opt_type = eval(`${opt_source}[opt_name].type`);
          var opt_type = String(opt_type).charAt(0).toLowerCase() + String(opt_type).slice(1);
          if (!app_args.length != 0 && typeof minimist_args[opt_name] != opt_type) {
            way.lib.exit(`Option "${opt_name}" is not "${opt_type}" (current value: ${minimist_args[opt_name]})`);
          }
          switch (opt_type) {
            case 'boolean':
              var value = true;
              break;
            case 'string':
              var value = minimist_args[opt_name];
              tmp_values.push(value);
              break;
            default:
              way.lib.exit(`Unsupported option type "${opt_type}"`);
          }
          way.opt[opt_name] = value;
        } catch (e) { 
          //console.log(e)
        }
      }
      // SIMPLE OPTION
      else if (/^-[a-z.]*/g.test(argv)) {
        var opt_name = argv.replace(/^-/,"");
        //console.log(`SIMPLE OPTION! ${opt_name} ${app_args.length} ${found_proc_name}`)
        if (found_proc_name) {
          way.args._ = (way.lib.check(way.args._)) ? `${way.args._} ${argv}` : `${argv}` ;
        }
        if (opt_name.split('').length > 1) {
          opt_name.split('').forEach( opt_name => {
            if (Object.keys(way.config.core.opt).includes(opt_name)) {
              if (way.config.core.opt[opt_name].type != 'Boolean') {
                way.lib.exit(`Unsupported "${opt_name}" option type: ${way.config.core.opt[opt_name].type}`);
              }
            }
            way.opt[opt_name] = true;
            way.optSig += `${opt_name}`;
          });
        } else {
          if (!Object.keys(way.config.core.opt).includes(opt_name)) {
            if (!found_proc_name) {
              way.lib.exit(`Unsupported "${opt_name}" option`);
            }
          } else {
            way.opt[opt_name] = true;
            way.optSig += `${opt_name}`;
          }
        }
      }
      // ARG
      else {
        var proc_name_without_app = Array.from(way.proc.name.split('.')).slice(1).join('.');
        if (way.proc.name == argv || `${proc_name_without_app}` == argv) {
          found_proc_name = true;
        }
        if (way.proc.name != argv && `${proc_name_without_app}` != argv && !tmp_values.includes(argv)) {
          app_args.push(argv);
          way.args._ = (way.lib.check(way.args._)) ? `${way.args._} ${argv}` : `${argv}` ;
        }
      }
    });
    var arg_nums = 0;
    app_args.forEach( argv => {
      way.args[`arg${arg_nums + 1}`] = argv;
      arg_nums++;
    });
    if (way.lib.check(way.optSig)) {
      way.optSig = `-${way.optSig}`;
    }

    //console.log(); console.log(`minimist_args`, minimist_args); console.log(`way.optSig`, way.optSig); console.log(`way.opt`, way.opt); console.log(`way.args`, way.args); console.log(); 
    //way.lib.exit()


    if (way.opt.d) {
      way.opt.r = true;
      way.opt.v = true;
      way.opt.y = true;
    }
    if (way.opt.v) {
      way.log.level = 1;
    }
    if (way.opt.l) {
      way.opt.v = true;
      way.log.level = 2;
    }
    if (way.proc.name == "core.get") {
      way.log.level = 1;
      way.opt.v = true;
    }
    if (way.proc.name == "core.help") {
      way.opt.v = true;
    }

    var arr = way.args['_'].split(' ');
    way.optAll = [];
    if (arr !== null && arr.length > 0) {
      way.optAll = arr.filter(e => {
        return e.match(/^-/);
      });
    }
    way.optAll = way.optAll.join(' ');
    //console.log(way.optAll)
    //way.lib.exit()

    //console.log(); console.log(`minimist_args`, minimist_args); console.log(`way.optSig`, way.optSig); console.log(`way.optAll`, way.optAll); console.log(`way.opt`, way.opt); console.log(`way.args`, way.args); console.log(); 
    //way.lib.exit()






  






    





  // Establece configuración a partir del fichero package.json de la APP
    if (!way.cache) {
      try {
        if (fs.existsSync(`${way.root}/${way.proc.approot}/package.json`)) {
          await way.lib.setConfig({
            key: `{}.lib.${way.proc.appname}.pkg`,
            data: require(`${way.root}/${way.proc.approot}/package.json`),
            save: false
          });
          //eval(`way.config.lib.csneak.pkg = ${JSON.stringify(way.proc.apppackage)}`);
        }
      } catch(err) {console.log(err)}
    }


  //if (argscore.length > 0) {
  //  way.lib.exit('No soportado establecer argumentos antes del nombre del procedimiento')
  //}

  


  // Carga ficheros de configuración de librería custom
    for (mapConfigKey of Object.keys(way.map.config)) {
      if ( /^app\..*\..*$/.test(mapConfigKey) && (mapConfigKey.split(".").length == 3) ) {

        //console.log(`${mapConfigKey} ${way.map.config[mapConfigKey]} ${mapConfigKey.split(".").length}`)

        if (fs.existsSync(way.map.config[mapConfigKey])) {
          var stat = fs.statSync(`${way.map.config[mapConfigKey]}`);
          var cache_name = `config.${mapConfigKey}--${way.lib.getHash(stat.mtime.toString())}`;
          if (way.lib.checkCache(cache_name)) {
            // SI EN CACHÉ
            // console.log('Carga desde cache:', mapConfigKey)
            var keys = mapConfigKey.split(".");
            var configKeyString = "way.config"
            for (var i = 0; i < keys.length; i++) {
              configKeyString = `${configKeyString}["${keys[i]}"]`
              if (eval(`typeof ${configKeyString}`) === "undefined") {
                eval(`${configKeyString} = {}`)
              }
            }
            Object.assign(eval(`${configKeyString}`), way.lib.getCache(cache_name));
          } else {
            // NO EN CACHÉ
            // console.log('Establece en cache:', mapConfigKey)
            await way.lib.loadConfig({ key:[mapConfigKey] });
            way.lib.setCache(cache_name, eval(`way.config.${mapConfigKey}`));
          }
        }
      }
    }








  // Determina si la ruta actual es raíz de perfil de configuración
    var configPwd = "";
    if (fs.existsSync(`${way.root}/.cache/out.pwd`)) {
      var pwd = way.lib.cast({
        data: fs.readFileSync(`${way.root}/.cache/out.pwd`, 'utf8')
      });
      var found = pwd.find(element => new RegExp(`^${way.pwd}:`,"g").test(element));
      if (way.lib.check(found)) {
        var found = found.split(":");
        if (way.lib.check(found[1])) {
          var configPwd = found[1];
        }
      }
    }

    




  
  



  // Establece referencias (way.reference)
    noConfig = true;
    try {

      var taskRequire = way.proc.code.task.require;


      // REQUIRE - CONFIG
      if (way.lib.check(taskRequire.config)) {
        noConfig = false;
        try {
          var nconf = 0;
          choices = [];
          way.batch = {};
          var filteredKeys = [];
          //console.log(taskRequire.config.length)
          way.reference.scope = {}
          for (var i = nconf; i < taskRequire.config.length; i++) {
            var configSignature = taskRequire.config[nconf];
            var rc              = configSignature.split(" ");
            //console.log(rc)
            if (rc.length > 1) {
              //var configType      = `^@${rc[0].replace(/^\(/,"").replace(/\)$/,"")}`;
              var configType      = `^@${rc[0]}`;
              var configReference = rc[1];
            } else {
              var configType      = `^@`;
              var configReference = rc[0];
            }

            //console.log('--------------',configReference,'--------------')
            //console.log(way.args['@'])

            var scope = "";
            if (way.lib.check(way.args['@'][nconf])) {

              var configKey = `@${way.args['@'][nconf]}`;
                
              // DETERMINA SI SE SOLICITA AMBITO DE EJECUCIÓN DE PROPIEDAD
              var configkey_splited = configKey.split(/\.\./);
              //console.log(configKey, configkey_splited)
              if (configkey_splited.length > 1) {
                var configKey = configkey_splited[0];
                scope = configkey_splited[1];
              }

              if (/\*/.test(configKey)) {
                if (taskRequire.config.length != 1) {
                  way.lib.exit(`Procedimiento "${way.proc.name}" no soporta ambito de ejecución por lotes (Solo permitido si requiere una sola configuración)`);
                }
                way.envBatch.status = true;
                for (wmc of way.map.configKey) {
                  //console.log(new RegExp(`^${configKey.replace("*",".*")}`,"g"), wmc)
                  if (new RegExp(`^${configKey.replace("*",".*")}`,"g").test(wmc)) {
                    //choices.push(wmc);
                    if (typeof way.reference.config[configReference] === "undefined") {
                      way.reference.config[configReference] = [];
                    }
                    way.reference.config[configReference].push(wmc)
                  }
                }
                if (JSON.stringify(way.reference.config) == "{}") {
                  way.lib.exit(`No disponible configuración que cumpla patrón "${configKey.replace("*",".*")}"`)
                }
              } else {

                //console.log(way.map.configKey)
                //console.log(configKey)
                
                if (way.map.configKey.includes(configKey)) {
                  if (rc.length > 1) {
                    var re = new RegExp(configType,"g");
                    if (re.test(configKey)) {
                      way.reference.config[configReference] = configKey;
                    } else {
                      way.lib.exit(`Procedimiento "${way.proc.name}" requiere configuración del tipo "${configType}" en ambito de ejecución "${configReference}"`);
                    }
                  } else {
                    //choices.push(configKey);
                    way.reference.config[configReference] = configKey;
                  }
                } else {

                  // COMPRUEBA Y OBTIENE ALIAS
                    if (typeof configKey !== "undefined") {
                      var output = await way.lib.getAlias({ data: configKey });
                      if (typeof output.data !== "undefined") {
                        way.reference.config[configReference] = output.data;
                      }
                    }
                  
                }
              }
            } else {

              if (way.lib.check(configPwd)) {
                way.reference.config[configReference] = configPwd;
                //way.args['@'].push(configPwd)
              } else {
                //
                // BUSCA DIRECTORIO OCULTO CON NOMBRE DE LA APP, 
                // DE FORMA RECURSIVA RECORRIENDO EL ÁRBOL DE RUTAS DEL DIRECTORIO ACTUAL
                // INTENTA CARGAR AUTOMÁTICAMENTE LA CONFIGURACIÓN LOCAL
                // EJEMPLO: seidor/.dm CARGA @seidor.local
                //
                tree = way.pwd.split("/");
                var paths = [];
                var last = "";
                var tmp = "";
                for (var property in tree) {
                  if (tree[property] != "") {
                    tmp = `${last}/${tree[property]}`
                    last = tmp;
                    paths.push(tmp);
                  }
                }
                paths.reverse();
                var approot = "";
                for (property in paths) {
                  //console.log(`${paths[property]}/.${way.proc.appname}`)
                  if (fs.existsSync(`${paths[property]}/.${way.proc.appname}`)) 
                  {
                    approot = `${paths[property]}`
                    break;
                  } 
                }

                if (approot == os.homedir()) {
                  approot = "";
                }


                // Obtiene nombre de perfil
                var ask = true;

                if (approot != "") {
                  var configKey = `@${path.basename(approot)}.local`;
                  if (way.map.configKey.includes(configKey)) {
                    way.reference.config[configReference] = configKey;
                  }
                  if (taskRequire.config.length == 1) {
                    ask = false;
                  }
                  if (Object.keys(way.reference.config).length == taskRequire.config.length) {
                    ask = false;
                  }
                }

                if (ask) {
                  for (configKey of way.map.configKey) {
                    if (new RegExp(configType,"g").test(configKey)) {
                      filteredKeys.push(configKey);
                    }
                  }
                  if (!filteredKeys.length) {
                    way.lib.exit(`Configuración del tipo "${configType}" no disponible`)
                  }
                  var choices = [];
                  var choice = await way.lib.complete({
                    choices: filteredKeys,
                    message: `Selecciona "${configReference}"`
                  });
                  choices.push(choice);
                  way.reference.config[configReference] = choice;
                  filteredKeys = []
                }

                // Comprueba perfil
                if (way.map.configKey.includes(configKey) && rc.length > 1) {
                  var re = new RegExp(configType,"g");
                  if (!re.test(configKey)) {
                    way.lib.exit(`Procedimiento "${way.proc.name}" requiere configuración del tipo "${configType}" en ambito de ejecución "${configReference}"`);
                  }
                }

              }
            }

            //console.log(way.reference.config); console.log(configReference); way.lib.exit()

            if (way.lib.check(scope)) {
              way.reference.scope[configReference] = scope;
            }

            nconf++;
          }

          //console.log(way.reference.config)
          //way.lib.exit()

          if (choices.length > 0) {
            way.args['@'] = choices;
          }
        } catch (e) {
          way.lib.exit(e)
        }
        if (way.args['@'].length > way.proc.code.task.require.config.length) {
          way.lib.exit(`Procedimiento "${way.proc.name}" solo requiere ${way.proc.code.task.require.config.length} configuración/es`);
        }
        //if (way.args['@'].length != way.proc.code.task.require.config.length) {
        //  way.lib.exit(`Procedimiento "${way.proc.name}" requiere ${way.proc.code.task.require.config.length} configuración/es`)
        //}
      }      


    } catch (e) {}

    if (noConfig && way.args['@'].length > 0) {
      way.lib.exit(`Procedimiento "${way.proc.name}" no requiere configuración`);
    }

    



    
    //way.lib.log({ message: argv, type: 'pretty' })
    //way.lib.log({ message: way.args, type: 'pretty' })
    //way.lib.log({ message: way.opt, type: 'pretty' })
    //way.lib.exit()










  // Determina tareas a ejecutar
    try {
      if (!way.lib.check(way.proc.code.task.do)) {
        way.lib.exit(`Procedimiento "${way.proc.name}" no implementa propiedad "task.do"`);
      }
      var doTasks = way.proc.code.task.do;
    } catch (e) {
      way.lib.exit(`Procedimiento "${way.proc.name}" no implementa propiedad "task"`);
    }
  
    /*
      "applyWith" SOLO DEBE DE IMPLEMENTARSE EN EL FICHERO DE CONFIGURACIÓN DEL PROCEDIMIENTO.
      NO SE DEBE DE IMPLEMENTAR EN @
    */
    //console.log(way.lib.tree(doTasks));
    applyWith = [];
    for (a of way.lib.tree(doTasks)) {
      //if (/\.call/.test(a)) {
      //  var callname = eval(`way.proc.code.task.do${a.replace(/^\./,"")}`);
      //  console.log(`A:${a}`, callname)
      //}
      if (/\.applyWith/.test(a)) {
        var action = await way.lib.query({
          input: doTasks,
          select: `${a}`
        }).then((o) => { return o.data[0]; });
        applyWith.push(action);
      }
    }
    //way.lib.exit()
    //if (applyWith.length > 0) {
    //  console.log(applyWith)
    //}
    var noApplyFound = way.lib.removeEmptyFromArray(applyWith);
    var noApplyFound = way.lib.getArrayDiff({
      array1: way.opt.apply,
      array2: noApplyFound
    });
    if (noApplyFound.length > 0) {
      way.lib.exit(`Procedimiento "${way.proc.name}" no implementa \"applyWith\" con valor "${noApplyFound}"`)
    }


    var doTask = [];
    var numTaskToExecute = 0;
    for (d of doTasks) {
      /*
      if (!way.lib.check(d.call)) {
        way.lib.exit(`Procedimiento "${way.proc.name}" no implementa llamada (call) desde tarea "${numTaskToExecute}"`)
      }
      */
      //console.log()
      //console.log(doTask)
      //console.log(way.lib.check(doTask.applyWith))
      

      /*
        *****************
        IMPORTANTE: 
          - COMENTADO PARA SOPORTE LLAMADA: call
          - DEJAR PASAR TODAS LAS TAREAS, SE DETERMINA EJECUCIÓN EN FUNCIÓN "manageTask".
        *****************
      if (way.lib.check(d.applyWith)) {
        if (way.opt.apply.includes(d.applyWith)) {
          doTask.push(d);
          num++;
        }
      } else {
        doTask.push(d);
        num++;
      }
      */

      doTask.push(d);

      numTaskToExecute++;
    }
    
    if (!doTask.length) {
      way.lib.exit(`El procedimiento "${way.proc.name}" no aplica tareas`)
    } 
    //console.log('doTasks', doTask.length, doTask)






  // Carga configuración custom y de entorno
    if (way.map.configKey.includes('custom')) {
      await way.lib.loadConfig({key:['custom']});
    }
    if (way.map.configKey.includes('env')) {
      await way.lib.loadConfig({key:['env']});
    }
    



  way.out = null;
  way.hooked = {};
  way.var = {};






  //console.log(way.opt)
  //console.log(way.proc)
  //console.log(way.args)
  //console.log(way.map)
  //way.lib.exit()

  




  // Ejecución de procedimiento
    var iLog = {}

    if (JSON.stringify(way.reference.config) == "{}") {


      if (way.proc.name == 'core.make.app') {
        way.tmp.proc = {};
        way.tmp.proc.sig = `${way.app_name_root} ${way.args.arg1}.test`;
      }

      await way.lib.setArgsAndOpt({ argv: Object.assign({}, way.opt, way.args) });
      //console.log(way.args); console.log(way.opt);

      for (var i = 0; i < doTask.length; i++) {
        var manageTask = doTask[i];
        await way.lib.manageTask(manageTask);
      }
    } else {
      
      for (ref in way.reference.config) {

        //console.log(ref)

        if (way.reference.config[ref].constructor.name == "Array") { // AMBITO DE EJECUCIÓN POR LOTES

          way.envBatch.num = 0;

          for (envBatch of way.reference.config[ref]) { 
            way.envBatch.now = envBatch;
            
            //if (way.proc.name != "core.get") {
            //  console.log(`· ${color.bold(`${way.envBatch.now}`)}`);
            //}
            if (!way.opt.o) {
              //console.log(`${color.bold(`${way.envBatch.now}`)}`);
            }

            
            /*
            way.lib.log({
              message: `${color.red(way.envBatch.now)}`,
              type: 'pretty'
            })
            */


            var stat = fs.statSync(`${way.map.config[ envBatch ]}`);
            var cache_name = `env.${way.proc.name}.${ref}.${envBatch}.${way.lib.getHash(`env.${JSON.stringify(way.args)}`)}--${way.lib.getHash(stat.mtime.toString())}`;
            
            var has_error_flag = false;

            if (way.lib.checkCache(cache_name)) {
              // SI EN CACHÉ
              Object.assign(way, way.lib.getCache(cache_name));
            } else {

              // Evita fallo en herencia
              way.env._this = {}

              

              var configValue = await way.lib.loadConfig({
                key: [envBatch],
                force: true
              }).catch((o) => {
                return {};
              });



              way.env[ref] = configValue;
              way.lib.log({
                label: "env",
                message: way.env,
                type: "log"
              });
              // ESTABLECE VARIBLES DINÁMICAS (NAME,SCOPE)
                if (way.env[ref] != null) {
                  var configRefKey = await way.lib.parseConfigKey({
                    key:`${way.envBatch.now}`,
                    force: true
                  });


                  /*

                  //
                  // Implementado desde loadConfig
                  //

                  var map = way.envBatch.now.split("@");
                  var map = map[1].split(".");
                  // way.env[ref]._name = map[0];
                  // eval(`${configRefKey}["_name"] = "${map[0]}"`);
                  // way.env[ref]._env = map[1];
                  // eval(`${configRefKey}["_env"] = "${map[1]}"`);
                  way.env[ref]._env = map.slice(-1).toString();
                  eval(`${configRefKey}["_env"] = "${map.slice(-1).toString()}"`);
                  map.pop();
                  way.env[ref]._key = map.join(".").replace(/\./g,"");
                  eval(`${configRefKey}["_key"] = "${map.join(".").replace(/\./g,"")}"`);
                  var s = [];
                  for (var i = 0; i < map.length; i++) {
                    s[i] = map[i].charAt(0).toUpperCase() + map[i].slice(1);
                  }
                  way.env[ref]._keyname = s.join("");
                  eval(`${configRefKey}["_keyname"] = "${s.join("")}"`);
                  way.env[ref]._name = map.join(".");
                  eval(`${configRefKey}["_name"] = "${map.join(".")}"`);
                  way.env[ref]._fullname = way.envBatch.now;
                  eval(`${configRefKey}["_fullname"] = "${way.envBatch.now}"`);
                  way.env[ref]._path = way.map.config[`${way.envBatch.now}`];
                  eval(`${configRefKey}["_path"] = "${way.map.config[`${way.envBatch.now}`]}"`);
                  // console.log(eval(`${configRefKey}`))
                  // way.lib.exit()

                  */

                  if (JSON.stringify(way.reference.scope) != "{}") {
                    try {
                      if (way.lib.check(way.reference.scope[ref])) {
                        way.reference.scope[ref] = way.reference.scope[ref].replace(/\[/g,"\[\"").replace(/\]/g,"\"\]");
                        var parsedScope = await way.lib.parseConfigKey({
                          key:`${way.reference.scope[ref]}`,
                          force: true
                        });
                        //console.log(`way.env["${ref}"]${parsedScope}`)
                        var scopeValue = eval(`way.env["${ref}"]${parsedScope}`);
                        if (typeof scopeValue === "undefined") {
                          throw "Valor no definido";
                        }
                        way.env[ref]._scope = scopeValue;
                        if (scopeValue.constructor.name == "String") {
                          eval(`${configRefKey}["_scope"] = "${scopeValue}"`);
                        } else {
                          if (scopeValue.constructor.name == "Array" || scopeValue.constructor.name == "Object") {
                            eval(`${configRefKey}["_scope"] = ${JSON.stringify(scopeValue)}`);
                          } else {
                            eval(`${configRefKey}["_scope"] = ${scopeValue}`);
                          }
                        }
                      }
                    } catch (e) {
                      //way.lib.exit(`Fallo al obtener la propiedad "${way.reference.scope[ref]}" (ámbito) desde "${ref}" [${e}]`)
                      way.lib.log({
                        message: `Fallo al obtener la propiedad "${way.reference.scope[ref]}" (ámbito) desde "${ref}" [${e}]`,
                        type: `warn`
                      });
                      var has_error_flag = true;
                    }
                  }
                }
              
                way.env['_this'] = way.env[ref];
            
              // Establece cache
                if (!has_error_flag) {
                  var envCache = {};
                  envCache.env = way.env;
                  envCache.config = way.config;
                  envCache.reference = way.reference;
                  way.lib.setCache(cache_name, envCache);
                }
            }

            if (!has_error_flag) {

              await way.lib.checkRequiredTaskSettings();

              await way.lib.setArgsAndOpt({ argv: Object.assign({}, way.opt, way.args) });
              //console.log(way.args); console.log(way.opt);
              //way.lib.exit()
              

              for (var i = 0; i < doTask.length; i++) {
                var manageTask = doTask[i];
                //console.log('2 - MANAGE TASK', manageTask);
                
                if (way.proc.name == "get") {
                  if (way.lib.check(way.config.core.envconfig)) {
                    var envconfig = Object.keys(way.config.core.envconfig);
                    for (ec of envconfig) {
                      if (new RegExp(ec,"g").test(way.envBatch.now)) {
                        eval(`console.log(color.${way.config.core.envconfig[ec]}(' ${way.envBatch.now} '))`)
                        //way.lib.exit()
                      }
                    }
                  }
                }

                await way.lib.manageTask(manageTask);

              }
            }

            way.envBatch.num ++;
            //console.log(way.envBatch.num)
            
            /* Reinicia variables establecidas en entorno de ejecución */
            way.var = {}

            
          }

          
        
        } else { // AMBITO DE EJECUCIÓN EXPLICITO

          if (!way.reference.config[ref]) {
            way.lib.exit(`Required configuration profile to execute "${way.proc.name}" procedure`)
          }

          //console.log(way.reference.config[ref], way.map.config[ way.reference.config[ref] ])
          //way.lib.exit();

          var stat = fs.statSync(`${way.map.config[ way.reference.config[ref] ]}`);
          var cache_name = `env.${way.proc.name}.${ref}.${way.reference.config[ref]}.${way.lib.getHash(`env.${JSON.stringify(way.args)}`)}--${way.lib.getHash(stat.mtime.toString())}`;
          //console.log(cache_name)
          //way.lib.exit()
          if (way.lib.checkCache(cache_name)) {
            // SI EN CACHÉ
            Object.assign(way, way.lib.getCache(cache_name));
          } else {
            // NO EN CACHÉ

            //console.log(1)

            // Carga config
              var configValue = await way.lib.loadConfig({
                key: [way.reference.config[ref]],
                force: true
              }).catch((o) => {
                return {};
              });


            // Establece entorno
              way.env[ref] = configValue;
              way.lib.log({
                label: "env",
                message: way.env,
                type: "log"
              });

            // ESTABLECE VARIBLES DINÁMICAS (NAME,SCOPE)
              if (way.env[ref] != null) {
                var configRefKey = await way.lib.parseConfigKey({
                  key:`${way.reference.config[ref]}`,
                  force: true
                });


                if (JSON.stringify(way.reference.scope) != "{}") {
                  try {
                    if (way.lib.check(way.reference.scope[ref])) {
                      way.reference.scope[ref] = way.reference.scope[ref].replace(/\[/g,"\[\"").replace(/\]/g,"\"\]");
                      var parsedScope = await way.lib.parseConfigKey({
                        key:`${way.reference.scope[ref]}`,
                        force: true
                      });
                      //console.log()
                      //console.log(`way.env["${ref}"]${parsedScope}`)
                      var scopeValue = eval(`way.env["${ref}"]${parsedScope}`);
                      if (typeof scopeValue === "undefined") {
                        throw "Valor no definido";
                      }
                      way.env[ref]._scope = scopeValue;
                      if (scopeValue.constructor.name == "String") {
                        eval(`${configRefKey}["_scope"] = "${scopeValue}"`);
                      } else {
                        if (scopeValue.constructor.name == "Array" || scopeValue.constructor.name == "Object") {
                          eval(`${configRefKey}["_scope"] = ${JSON.stringify(scopeValue)}`);
                        } else {
                          eval(`${configRefKey}["_scope"] = ${scopeValue}`);
                        }
                      }
                    }
                  } catch (e) {
                    way.lib.exit(`Fallo al obtener la propiedad "${way.reference.scope[ref]}" (ámbito) desde "${ref}" [${e}]`)
                  }
                }

                way.env['_this'] = way.env[ref];

              }
            
          }

        }

      }


      if (!way.envBatch.status) {

        await way.lib.checkRequiredTaskSettings();
        
        await way.lib.setArgsAndOpt({ argv: Object.assign({}, way.opt, way.args) });

        for (var i = 0; i < doTask.length; i++) {

          var manageTask = doTask[i];

          if (way.proc.name == "get") {
            if (way.lib.check(way.config.core.envconfig)) {
              var envconfig = Object.keys(way.config.core.envconfig);
              for (ec of envconfig) {
                if (new RecgExp(ec,"g").test(way.env.conf._name)) {
                  eval(`console.log(color.${way.config.core.envconfig[ec]}(' ${way.env.conf._name} '))`)
                }
              }
            }
          }

          way.task.exclude = false;
          var o = await way.lib.manageTask(manageTask);
          if (typeof o !== "undefined") {
            process.stdout.write(`\n`)
            if (o.code > 1) {
              //way.lib.exit(`${o.message} (${o.code})`)
              way.lib.exit(`(code:${o.code})`)
            }
            process.exit(1);
          }


        }
        // Establece cache
          var envCache = {};
          envCache.env = way.env;
          envCache.config = way.config;
          envCache.reference = way.reference;
          way.lib.setCache(cache_name, envCache);
      }

      
    }


  // Pinta salida de core.get
    if (way.proc.name == "core.get") {
      if (typeof way.tmp.out !== "undefined" && way.tmp.out.length > 0 && way.opt.o) {
        process.stdout.write(JSON.stringify(way.tmp.out))
      } else {
        if (way.tmp.out.length > 0) {
          //way.lib.log({ message: way.tmp.out, type: 'console' });
          if (typeof way.tmp.out[0] !== 'undefined') {
            if (typeof way.tmp.out[0] === 'string') {
              var out = `\x1b[38;5;178m${way.tmp.out[0]}\x1b[0m`;
            } else {
              var out = await way.lib.getFlatObject({ data: way.tmp.out[0] }).join('\n');
            }
            console.log(out)
          }
          // // Pinta colores disponibles
          // for (let i = 0; i <= 200; i++) {
          //   console.log(`\x1b[38;5;${i}mColor ${i}\x1b[0m`);
          // }
        }
      }
    }


  // INFO  
    if (!way.opt.d && way.opt.l) {
      const { networkInterfaces } = require('os');
      const nets = networkInterfaces();
      const results = [];
      for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
          if (net.family === 'IPv4' && !net.internal) {
            results.push(net.address);
          }
        }
      }
      ips = results.join(" - ")
      var executionTime = way.lib.getPerformanceTask().toFixed(2);
      iLog['Source'] = `${os.hostname()} ${ips}`;
      iLog['Signature'] = `${way.exec}`;
      iLog['Execution'] = way.task.log;
      iLog['Performance'] = `${executionTime} seg. / ${(executionTime / 60).toFixed(2)} min. / ${(executionTime / 3600).toFixed(2)} h.`;
      way.lib.toCLI({ 
        data: { iLog },
        color: "gray",
        config: {
          columns: {
            "4": {
              width: 20,
              wrapWord: true
            }
          }
        }
      });
      if (way.lib.check(way.config.env)) {
        if (!way.lib.check(way.config.env.core.mail.from) || !way.lib.check(way.config.env.core.mail.to)) {
          way.lib.log({
            message: `Para el envio de notificaciones debes de configurar remitente y destinatario/s en el fichero de configuración de entorno (custom/config/env.yml)`,
            type: 'warn'
          });
        } else {
          await way.lib.mail({
            from: way.config.env.core.mail.from,
            to: way.config.env.core.mail.to,
            subject: `way ${way.proc.name}`,
            html: way.lib.toHTML({ 
              data: {
                iLog
              }
            }),
          }).then((o) => { 
            way.lib.log({
              message: `${o.data.message}`,
              type: 'log'
            });
          }).catch((o) => {
            way.lib.log({
              message: `${o.data.message}`,
              type: 'warn'
            });
          });
        }
      }
    }



  // CACHE
    if (!way.lib.checkCache('core') || way.opt.r) {
      var cacheCore     = {};
      cacheCore.pkg     = way.pkg;
      cacheCore.lib     = way.lib;
      cacheCore.map     = way.map;
      way.lib.setCache('core', cacheCore);
    }


  // Elimina ficheros temporales creados en tiempo de ejecución
    await require("glob").sync(`/tmp/way-${way.pid}*`, {
      dot: false,
      ignore: [
        '**/node_modules/**',
        '**/.git/**',
      ],
    }).map(path => {
      fs.rmSync(`${path}`, { recursive: false, force: true });
    });

    // Muestra tiempo de ejecución
    if (way.proc.name != "core.help" && way.proc.name != "core.get" && !way.opt.o) {
      var executionTime = way.lib.getPerformanceTask().toFixed(2);
      way.lib.log({ message:`${executionTime} sec. (${(executionTime / 60).toFixed(2)} min.)`, type: 'label'});
    }

    // Finaliza ejecución
    process.exit(0);

})();
