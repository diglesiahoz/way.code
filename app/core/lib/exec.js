way.lib.exec = async function (_args) {

  var color = require('ansi-colors');
  var figures = require('figures');


  var _args = way.lib.getArgs('exec', _args);
  //console.log(_args)

  
  if ( (way.opt.v || way.log.level > 0) && _args.out == null) {
    _args.out = true;
  }

  var oCmd = _args.cmd;

  if (_args.nohup && _args.watch) {
    way.lib.exit(`way.lib.exec: No soportado combinar opciones "nohup" y "watch"`);
  }
  if (_args.out && _args.watch) {
    way.lib.exit(`way.lib.exec: No soportado combinar opciones "pipe" y "watch"`);
  }
  if (_args.watch && way.lib.check(_args.user) && way.lib.check(_args.host)) {
    way.lib.exit(`way.lib.exec: No soportado establecer "watch" combinado con "user" y "host"`);
  }

  /* DETERMINA SI ES UNA EJECUCIÓN LOCAL */
  if (way.lib.check(_args.host) && (way.ip.includes(_args.host) || _args.host == "127.0.0.1")) {
    _args.host = "";
  }
  /* 
  Si el usuario del sistema (way.user.username) es igual al valor del argumento "user" (_args.user) y no está establecido valor para el argumento "host", la aplicación entiende que debe de ejecutar el comando de forma local
  */
  if (_args.user == way.user.username && !way.lib.check(_args.host)) {
    _args.user = "";
  }

  if ((way.lib.check(_args.user) && !way.lib.check(_args.host)) || (!way.lib.check(_args.user) && way.lib.check(_args.host)) ) {
    way.lib.exit(`way.lib.exec: No se puede ejecutar comando en remoto. Revisa usuario y host.`);
  }
  _args.cmd = _args.cmd.replace(/'/g, "'\"'\"'");
  if (way.lib.check(_args.cmd)) {
    if (way.lib.check(_args.cd)) {
      var settings = `set -e pipefail; cd ${_args.cd}; `;
    } else {
      var settings = `set -e pipefail; `;
    }
  } else {
    if (way.lib.check(_args.cd)) {
      var settings = `cd ${_args.cd}; bash --login`;
    } else {
      var settings = ``;
    }
  }

  execPing = true;
  if (_args.ping) {
    if (way.lib.check(_args.user) && way.lib.check(_args.host)) {
      var ping = require('ping');
      let res = await ping.promise.probe(_args.host, {
          timeout: 1,
          //extra: ['-i', '2'],
      });
      execPing = res.alive;
    }
  }

  if (_args.pem != "") {
    _args.pem = `-i ${_args.pem}`
  }

  if (_args.nohup) {
    if (way.lib.check(_args.user) && way.lib.check(_args.host)) {
      _args.cmd = `ssh -o LogLevel=QUIET -t ${_args.pem} ${_args.user}@${_args.host} '${settings}nohup $(${_args.cmd}) &'`;
    } else {
      _args.cmd = `${settings}nohup $(${_args.cmd}) &`;
    }
  } else {
    if (way.lib.check(_args.user) && way.lib.check(_args.host)) {
      if (way.lib.check(_args.pass)) {
        _args.cmd = `sshpass -p '${_args.pass}' ssh ${_args.user}@${_args.host} -t '${settings}${_args.cmd}'`;
      } else {
        _args.cmd = `ssh -o LogLevel=QUIET -t ${_args.pem} ${_args.user}@${_args.host} '${settings}${_args.cmd}'`;
      }
    } else {
      if (_args.watch) {
        _args.cmd = `${settings}watch -n 0.1 '${_args.cmd}'`;
      } else {
        _args.cmd = `${settings}${_args.cmd}`;
      }
    }
  }

  if (_args.watch) {
    var stdio = "inherit";
  } else {
    /*
    if (_args.out) {
      var stdio = [ "inherit", "pipe", "pipe" ];
    } else {
      var stdio = [];
    } 
    */
    var stdio = [ "inherit", "pipe", "pipe" ];
  }

  if (!_args.show_warn) {
    _args.cmd = _args.cmd + " 2>&1"
  }

  //console.log(_args.cmd, stdio)
  //way.lib.exit()

  way.lib.log({ message:`exec:: ${_args.cmd}` });

  if (way.opt.v && way.log.level > 0 || way.opt.s) {
    var message_cdm = _args.cmd.replace(/^set -e pipefail; /g, '');
    message_cdm = message_cdm.trim();
    if (way.opt.s) {
      console.log(color.dim.bold.cyan(`${figures.circleDotted}  exec => (`), color.bold.cyan(message_cdm), color.dim.bold.cyan(`)`));
    } else {
      console.log(color.dim.bold.cyan(`${figures.circleFilled}  exec => (`), color.bold.cyan(message_cdm), color.dim.bold.cyan(`)`));
    }
    
  }

  if (_args.message != "") {
    way.lib.log({
      message:`${_args.message}`,
      type: "label"
    });
  }

  //console.log(_args.cmd)
  //way.lib.exit()


  return new Promise((resolve, reject) => {
    setTimeout(() => {

      if (way.opt.s) {
        return resolve({
          code: 0,
          buffer: ""
        });
      }

      if (!execPing) {
        way.lib.log({
          message: `Prueba a establecer "ping: false"`,
          type: `label`
        })
        return reject({
          message: `No puede conectar con "${_args.user}@${_args.host}" (Timeout)`
        });
      } else {
        if (_args.cmd == `cd ~; bash`) {
          if (way.lib.check(_args.label)) {
            return reject(`No se puede ejecutar "${_args.label}"`);
          } else {
            return reject();
          }
        }

        const spawn = require('child_process').spawn;
        if (_args.nohup) {
          const exec = spawn(_args.cmd, [], {
            detached: true, 
            stdio: 'ignore',
            shell: true
          });
          resolve(`Lanzado... (${oCmd})`)
        } else {
          var buffer = "";
          const exec = spawn(_args.cmd, [], {
            stdio: stdio,
            shell: true
          });
          if (!_args.watch) {
            exec.stdout.on('data', (data) => {
              if (_args.out) {
                process.stdout.write(data.toString('UTF-8'));
              }
              buffer += data;
            });
            exec.stderr.on('data', (data) => {
              if (_args.out) {
                process.stdout.write(data);
              }
              buffer += data;
            });
          }
          exec.on('exit', (code) => {
            if (code != 0) {
              var bufferOutput = buffer.toString('UTF-8').replace(/\r/g,'').replace(/\n$/,'').replace(/\\/g,'\\\\');

              if (_args.cast == true) {
                var bufferOutput = way.lib.cast({
                  data: bufferOutput
                });
              }

              if (_args.pipe != "") {
                way.lib.var({
                  key: _args.pipe,
                  value: bufferOutput
                });
              }
              if (_args.show_warn && code != 255) {
                reject({
                  code: code,
                  pid: exec.pid,
                  message: buffer.toString('UTF-8').replace(/\r/g,'').replace(/\n$/,'').replace(/\\/g,'\\\\')
                });
              }
            } else {

              var bufferOutput = buffer.toString('UTF-8').replace(/\r/g,'').replace(/\n$/,'');

              if (_args.cast == true) {
                var bufferOutput = way.lib.cast({
                  data: bufferOutput
                });
              }

              //console.log(bufferOutput)
              //way.lib.exit()

              if (_args.pipe != "") {
                way.lib.var({
                  key: _args.pipe,
                  value: bufferOutput
                });
              }

              resolve({
                code: code,
                pid: exec.pid,
                buffer: bufferOutput
              });
              
            }
          });
          exec.on('error', (code) => {
            reject({
              code: code,
              pid: exec.pid,
              buffer: buffer.toString('UTF-8').replace(/\r/g,'').replace(/\n$/,'').replace(/\\/g,'\\\\')
            });
          });
          process.on('SIGINT', process.exit);
          process.on('SIGTERM', process.exit);
        }
      }
    }, _args.sleep);       
  });
}