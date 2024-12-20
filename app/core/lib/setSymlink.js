way.lib.setSymlink = async function (_args) {
  var _args = way.lib.getArgs('setSymlink', _args);
  const Lnf = require("lnf");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        try {
          Lnf(_args.origin, _args.target, (err) => {});
          resolve()
        } catch (e) {
          way.lib.log(`Fallo al establecer el enlace simbólico "${_args.origin}"\n${e}`);
          reject();
        }
      })();
    }, 0);
  });
}