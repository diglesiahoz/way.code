way.lib.getMap = function (dir, map) {
  if (!way.lib.check(dir)) {
    dir = dir || "./"
    var rel = "";
    var pat = `${way.root}/`;
    var files = [ "core", "custom" ];
  } else {
    var rel = dir.replace(/\/*$/,"/");
    var pat = `${way.root}/${dir.replace(/\/*$/,"/")}`;
    var files = require('fs').readdirSync(pat);
  }
  way.map = way.map || {};
  way.map.lib = way.map.lib || {}
  way.map.config = way.map.config || {}
  way.map.file = way.map.file || {}
  
  way.map.libKey = way.map.libKey || []
  way.map.configKey = way.map.configKey || []
  way.map.profileKey = way.map.profileKey || []
  way.map.aliasKey = way.map.aliasKey || {}
  way.map.aliasKeyRev = way.map.aliasKeyRev || {}
  way.map.fileKey = way.map.fileKey || []
  way.map.procKey = way.map.procKey || []

  var apps = require('fs').readdirSync(`${way.root}/custom/app`);
  apps.forEach(function(appname) {
    if (require('fs').statSync(`${way.root}/custom/app/${appname}`).isDirectory() && !way.apps.includes(appname) ) {
      way.apps.push(`${appname}`);
    }
  });
  var more_than_one_app = false;
  if (way.apps.length > 1) {
    more_than_one_app = true;
  }
  
  //process.exit()
  
  files.forEach(function(file) {
    //console.log(file)
    if (!/\/node_modules\//.test(pat)) {
      if (require('fs').statSync(pat + file).isDirectory()) {
        way.map = way.lib.getMap(`${rel}${file}/`, way.map);
      }
      else {
        if (/(core|custom)\//.test(rel)) {
          //var ext = file.split(".");
          //ext.shift();
          //ext = ext.join("");
          // LIB
          if (
            /^(core|custom)\/(lib|app)\/.*\.(js)$/.test(`${rel}${file}`) || 
            /^(core|custom)\/(lib|app)\/[a-z0-9\.]*\/lib\/.*\.(js)$/.test(`${rel}${file}`)
            ) {
            key = `${rel}${file}`.replace(/^(core|custom)\/(lib|app)\//,"").replace(/lib\//,"").replace(/\.js$/,"").replace(/\//g, ".");
            //console.log(`Namespace: ${rel}${file} ${key}`);
            if (way.lib.check(way.map.lib[key])){
              //way.lib.exit(`Ya implementada configuración "${key}". Revisa nombre desde "${rel}${file}"`);
            } else {
              way.map.lib[key] = `${rel}${file}`;
              way.map.libKey.push(key);
              //way.map.libKey.sort();
            }
          }
          // FILE
          if (
            /^(core|custom)\/file\//.test(`${rel}${file}`) || 
            /^(core|custom)\/(lib|app)\/[a-z0-9\.]*\/file\//.test(`${rel}${file}`)
            ) {
            if (!/^\./.test(file)) {
              key = `${rel}${file}`.replace(/^(core|custom)\//,"").replace(/^(file)\//,"").replace(/\/file/,"");
              //console.log(`Namespace: ${rel}${file} ${key}`);
              //key = key.replace(/\.[a-z]*$/,"").replace(/\//g, ".");
              key = key.replace(/\./,"_");
              key = key.replace(/\//g, ".");
              //console.log(`Namespace: file ${key}`);
              if (way.lib.check(way.map.file[key])){
                way.lib.exit(`Ya implementada clave "${key}" desde "${way.map.file[key]}". Revisa "${rel}${file}"`);
                //way.map.file[`${key}${ext}`] = `${rel}${file}`;
              } else {
                way.map.file[key] = `${rel}${file}`;
                way.map.fileKey.push(key);
                //way.map.fileKey.sort();
              }
            }
          }
          // CONFIG
          if (
            /^(core|custom)\/config\/.*\.(yml|yaml)$/.test(`${rel}${file}`) || 
            /^(core|custom)\/(lib|app)\/[a-z0-9\.]*\/config\/.*\.(yml|yaml)$/.test(`${rel}${file}`)
            ) {
            key = `${rel}${file}`.replace(/^(core|custom)\//,"").replace(/^(config)\//,"").replace(/\/config/,"").replace(/\.(yml|yaml)$/,"").replace(/\//g, ".")
            //console.log(`Namespace: ${rel}${file} ${key}`);
            var isproc = false;
            if (/^proc\./.test(key)) {
              key = key.replace(/proc\./, "");
              isproc = true;
            }
            if (/^(lib|app)\.[a-z]*\.proc\./.test(key)) {
              //key = key.replace(/^lib\.[a-z]*\.proc\./, "");
              key = key.replace(/^(lib|app)\./, "").replace(/\.proc/,"");
              isproc = true;
            }

            



            // SI EXISTE MÁS DE UNA APLICACIÓN CUSTOM Y EL NOMBRE DE LA APP (BASHRC) ES IGUAL QUE EL NOMBRE DE LA APP
            // ELIMINA PREFIJO DE APLICACIÓN EN NOMBRE DE PROCEDIMIENTO
            /*
            if (!more_than_one_app) {
              var appname_from_key = key.split(".")[0];
              console.log(way.apps, way.app_name_root, appname_from_key)
              if (way.apps.includes(appname_from_key) && (way.app_name_root == appname_from_key)) {
                var re = new RegExp(`${appname_from_key}\.`, "g");
                key = key.replace(re, "");
              }
            }
            */

            if (!/^app/.test(key) && !/app$/.test(key)) {
              // ELIMINA DUPLICADOS...
              //
              // NO ELIMINAR SIGUIENTE LINEA...
              //
              key = key.split(".").filter((item, index) => key.split(".").indexOf(item) === index).join(".");
            }

            //
            // GESTIONA PERFILES DESDE APLICACIÓN CUSTOM...
            //
            if (/^app.*@/.test(key)) {
              key = key.split(".").filter((item, index) => key.split(".").indexOf(item) === index).join(".");
              var re = new RegExp(`app\.`, "g");
              key = key.replace(re, "");
              //
              // ELIMINA PREFIJO DE AMBITO DE APLICACIÓN
              //
              // var re = new RegExp(`${way.app_name_root}\.`, "g");
              // key = key.replace(re, "");
              //
              var re = new RegExp(`[a-z]*\.@\.`, "g");
              if (re.test(key)) {
                var app_name = key.split(".")[0];
                key = key.replace(re, `@${app_name}\.`);
              }
              //console.log(key)
            } else {
              var re = new RegExp(`^@\.`, "g");
              key = key.replace(re, "@");
            }

            if (/proc\./.test(key)) {
              way.lib.log({ message:`Revisa clave de configuración (${key}) desde fichero ${rel}${file}`, type:"warning" });
            }

            if (way.lib.check(way.map.config[key])){
              way.lib.exit(`Ya implementada clave "${key}" desde "${way.map.config[key]}". Revisa "${rel}${file}"`);
            } else {

              
              if (/^@/.test(key)/* || /^[a-z]*\.@/.test(key) */) {
                //console.log(key)
                way.map.profileKey.push(`${key}`);
              }

              if (/^@\./.test(key) || /\.@\./.test(key)) {
                var a = key.split(".");
                if (/^@\./.test(key)) {
                  a.shift();
                  key = a.join(".")
                }
                if (/\.@\./.test(key)) {
                  key = `${key.replace(/\.@\./,".")}`;
                }
                way.map.config[`@${key}`] = `${rel}${file}`;
                //console.log(`@${key}`)
                way.map.configKey.push(`@${key}`);
              } else {
                way.map.config[key] = `${rel}${file}`;
                if (isproc) {
                  way.map.procKey.push(key);
                } else {
                  way.map.configKey.push(key);
                }
              }
              //way.map.configKey.sort();
            }



            // ESTABLECE ALIAS DE NOMBRES DE PROCEDIMIENTOS Y PERFILES DE CONFIGURACIÓN
            if (key.split('.')[0] != "core") {

              var keytoparse = key;

              if (/^@/.test(key)) {
                var keyparts = keytoparse.split('@');
                keytoparse = keyparts[1];
              }
              if (isproc || /^@/.test(key)) {
                var keyparts = keytoparse.split('.');
                var appname = keyparts[0];
                if (way.apps.includes(appname)) {
                  var aliaskey = keyparts.slice(1).join('.');
                  if (/^@/.test(key)) {
                    aliaskey = `@${aliaskey}`;
                  }
                }
              }

              if (typeof aliaskey !== "undefined") {
                if (typeof way.map.aliasKey[aliaskey] === "undefined") {
                  way.map.aliasKey[aliaskey] = [];
                }
                if (typeof way.map.aliasKeyRev[aliaskey] === "undefined") {
                  way.map.aliasKeyRev[key] = [];
                }
                way.map.aliasKey[aliaskey].push(key);
                way.map.aliasKeyRev[key].push(aliaskey);
              }
            }
            //console.log(way.map.aliasKey)


          }
          //console.log(way.map.procKey)
          //way.lib.exit()
        }
      }
    }
  });

  return way.map;
}