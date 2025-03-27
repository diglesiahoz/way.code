way.lib.exec = async function (_args) {

  var color = require('ansi-colors');
  var figures = require('figures');

  var _args = way.lib.getArgs('exec', _args);
  
  if ( (way.opt.v || way.log.level > 0) && _args.out == null) {
    _args.out = true;
  }
  
  if (_args.message != "") {
    way.lib.log({
      message:`${_args.message}`,
      type: "label"
    });
  }

  if (way.lib.check(_args.host) && (way.ip.includes(_args.host) || _args.host == "127.0.0.1")) {
    _args.host = "";
  }
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

  if (_args.pem != "") {
    _args.pem = `-i ${_args.pem}`
  }

  if (way.lib.check(_args.user) && way.lib.check(_args.host)) {
    if (way.lib.check(_args.pass)) {
      _args.cmd = `sshpass -p '${_args.pass}' ssh ${_args.user}@${_args.host} ${_args.default_options} '${settings}${_args.cmd}'`;
    } else {
      _args.cmd = `ssh -o LogLevel=QUIET ${_args.default_options} ${_args.pem} ${_args.user}@${_args.host} '${settings}${_args.cmd}'`;
    }
  } else {
    if (_args.watch) {
      _args.cmd = `${settings}watch -n 0.1 '${_args.cmd}'`;
    } else {
      _args.cmd = `${settings}${_args.cmd}`;
    }
  }

  if (!_args.show_warn) {
    _args.cmd = _args.cmd + " 2>&1"
  }
  
  way.lib.log({ message:`exec:: ${_args.cmd}` });

  if (way.opt.v && way.log.level > 0 || (way.opt.d && !_args.exclude_dryrun)) {
    var message_cdm = _args.cmd.replace(/^set -e pipefail; /g, '');
    message_cdm = message_cdm.trim();
    if (way.opt.d && !_args.exclude_dryrun) {
      console.log(color.dim.bold.cyan(`${figures.circleDotted}  [DRY-RUN] exec => (`), color.bold.cyan(message_cdm), color.dim.bold.cyan(`)`));
    } else {
      console.log(color.dim.bold.cyan(`${figures.circleFilled}  exec => (`), color.bold.cyan(message_cdm), color.dim.bold.cyan(`)`));
    }
    
  }

  var stdio = (_args.out) ? [ "inherit", "inherit", "inherit" ] : [ "inherit", "pipe", "pipe" ];

  return new Promise((resolve, reject) => {
    setTimeout(() => {

      if (way.opt.d && !_args.exclude_dryrun) {
        return resolve({
          code: 0,
          buffer: ""
        });
      }

      try { 

        var data = require('child_process').execSync(_args.cmd, { 
          stdio: stdio, 
          encoding: 'utf-8' 
        });

        if (_args.cast) {
          data = way.lib.cast({ data: data });
        }

        if (_args.pipe != "") {
          way.lib.var({
            key: _args.pipe,
            value: data
          });
        }
        
        var resolve_data = {
          code: 0,
          buffer: data
        };
        resolve(resolve_data);

      } catch (e) {
        reject(e);
      }

    }, _args.sleep);       
  });
}