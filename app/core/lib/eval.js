way.lib.eval = async function (_args) {
  
  var _args = way.lib.getArgs('eval', _args);
  var o = {};
  o.attach = {};
  o.code = null,
  o.args = Object.assign({}, _args);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        o.code = 0;
        o.data = eval(`${_args.cmd}`);
        if (_args.out == true) {
          console.log(o.data)
        }
        resolve(o);
      } catch (e) {
        o.code = 1;
        o.data = e.toString();
        reject(o);
      }
    }, _args.sleep);       
  });
  
}