way.lib.getTagFromString = async function (_args) {
  var _args = way.lib.getArgs('getTagFromString', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        var data = _args.data.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9]/g,'_').replace(/[\.]/g,'_').toLowerCase();
        if (_args.pipe != "") {
          way.lib.var({
            key: _args.pipe,
            value: data
          });
        }
        resolve({
          args: Object.assign({}, _args),
          attach: {},
          code: 0,
          data: data,
        });
      })();
    }, 0);
  });
}