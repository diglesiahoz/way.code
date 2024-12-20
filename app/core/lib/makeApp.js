way.lib.makeApp = async function (_args){
  var _args = way.lib.getArgs('makeApp', _args);
  const fs = require("fs");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        if (fs.existsSync(`${way.root}/custom/app/${_args.name}`)) {
          way.lib.log({ message:`La aplicación "${_args.name}" existe actualmente.`,  type: "warning" });
        }
        if (way.opt.f) {
          await way.lib.ask({
            message: `Desea eliminar la aplicación "${_args.name}"?`,
            exitIfNegative: true
          });
          fs.rmSync(`${way.root}/custom/app/${_args.name}`, { recursive: true, force: true });
          way.lib.log({ message:`Eliminada aplicación "${_args.name}"`,  type: "success" });
        }
        if (!fs.existsSync(`${way.root}/custom/app/${_args.name}`)) {
          if (!/^[a-z]*$/.test(_args.name)) {
            reject({ message:`Nombre incorrecto de aplicación "${_args.name}". Debe cumplir con el patrón [a-z]` });
          } else {
            for (d of _args.directory) {
              await way.lib.exec({
                cmd: `mkdir -p ${way.root}/custom/app/${_args.name}/${d}`
              }).then((o) => {}).catch((o) => {})
              await way.lib.exec({
                cmd: `touch ${way.root}/custom/app/${_args.name}/${d}/.gitkeep`
              }).then((o) => {}).catch((o) => {})
            }
            for (file of _args.file) {
              var cFile = await way.lib.getFile({ 
                key: file.origin, 
                data: { name: _args.name } 
              }).then((o) => { 
                return o.data; 
              }).catch((o) => {});
              try {
                fs.writeFileSync(`${way.root}/custom/app/${_args.name}/${file.target}`, cFile, 'utf8');
              } catch (e) {
                way.lib.log({ message:`No se ha podido crear "${file.target}"`, type:"warning"});
              }
            }

            resolve({
              args: Object.assign({}, _args),
              attach: {},
              code: 0,
              data: `Creada aplicación "${_args.name}" en "custom/app/${_args.name}"`,
            });

          }
        }
      })();
    }, 0); 
  });
}