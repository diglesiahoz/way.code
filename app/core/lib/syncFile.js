way.lib.syncFile = async function (_args) {
  var _args = way.lib.getArgs('syncFile', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        var tmp = require('tmp');
        var fs = require('fs');
        var path = require('path');

        //console.log(_args)
       
        // Establece destino con nombre original si "_args.target" termina en "/"
        try {
          var original_file_name = path.basename(way.map.file[_args.origin]);
          if (_args.target.endsWith('/')) {
            _args.target = `${_args.target}${original_file_name}`;
          }
        } catch (e) {
          console.log('Actual mapa de ficheros', way.map.file)
          way.lib.exit(`No ha podido cargar el fichero "${_args.origin}"`)
        }

        var filecontent = await way.lib.getFile({
          key: _args.origin,
          data: _args.data
        }).then((o) => { 
          return o.data; 
        }).catch((o) => {});
        const tmpobj = tmp.fileSync({ 
          mode: 0o644, 
          prefix: `way`,
        });
        try {
          fs.writeFileSync(tmpobj.name, filecontent);
          //if (way.lib.check(_args.user) && !way.lib.check(_args.host)) {
          //  return reject({message:`Necesario establecer la propiedad "host" en llamada "syncFile"`});
          //}
          //if (!way.lib.check(_args.user) && way.lib.check(_args.host)) {
          //  return reject({message:`Necesario establecer la propiedad "user" en llamada "syncFile"`});
          //}
          /* DETERMINA SI ES UNA EJECUCIÓN LOCAL */
          if (way.lib.check(_args.host) && (way.ip.includes(_args.host) || _args.host == "127.0.0.1")) {
            _args.host = "";
          }
          //console.log(_args)
          if (_args.sudo) {
            var isudo = "sudo";
          } else {
            var isudo = "";
          }
          //way.lib.exit()
          if (way.lib.check(_args.user) && way.lib.check(_args.host)) {
            if (_args.backup) {
              var cmd = `ssh ${_args.user}@${_args.host} 'if [ -f ${_args.target} ];then ${isudo} cp ${_args.target} ${_args.target}.original; fi;'; ${isudo} rsync -avzc --progress ${tmpobj.name} ${_args.user}@${_args.host}:${_args.target}`
            } else {
              var cmd = `${isudo} rsync -avzc --progress ${tmpobj.name} ${_args.user}@${_args.host}:${_args.target}`
            }
          } else {
            if (_args.backup) {
              var cmd = `if [ -f ${_args.target} ];then ${isudo} cp ${_args.target} ${_args.target}.original; fi; ${isudo} rsync -avzc --progress ${tmpobj.name} ${_args.target}`
            } else {
              var cmd = `${isudo} rsync -avzc --progress ${tmpobj.name} ${_args.target}`
            }
          }
          if (way.lib.check(_args.chown)) {
            if (way.lib.check(_args.user) && way.lib.check(_args.host)) {
              var cmd = cmd + ` && ssh ${_args.user}@${_args.host} chown ${_args.chown} ${_args.target}`
            } else {
              var cmd = cmd + ` && chown ${_args.chown} ${_args.target}`
            }
          }
          //cmd = `${isudo} ${cmd}`;
          way.lib.log({ message:cmd, type:"log" });
          way.lib.log({
            message:`(exec) ${cmd}`,
            type: "verbose"
          });
          
          //console.log(cmd);
          //way.lib.exit()

          var o = await way.lib.exec({ cmd: cmd }).then((o) => { return o }).catch((o) => {});

          //tmpobj.removeCallback();
          if (o.code != 0) {
            reject({message:`No ha podido sincronizar el fichero: ${tmpobj.name} \n${o.buffer}`});
          } else {
            // Sincronizado...
            if (way.lib.check(_args.execCmd) && way.lib.check(_args.execPipe)) {
              // Ejecuta...
              var o = await way.lib.exec({ 
                cmd: `${_args.execCmd}; rm ${_args.target} 2>/dev/null`, 
                user: _args.user,
                host: _args.host,
                out: _args.execPipe 
              }).then((o) => { 
                return o 
              }).catch((o) => {});
              //console.log(o)
            }
            resolve();
            //resolve({message:`Sincronizado fichero: ${_args.origin}`});
          }
        } catch(e) {
          reject({message:`No ha podido sincronizar el fichero (${e})`});
        }
      })();
    }, 0); 
  });
}