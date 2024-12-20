way.lib.getRandomString = function (_args) {
  var _args = way.lib.getArgs('getRandomString', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let output = "";
        const randomArray = new Uint8Array(_args.length);
        crypto.getRandomValues(randomArray);
        randomArray.forEach((number) => {
          output += chars[number % chars.length];
        });
        
        if (_args.pipe != "") {
          way.lib.var({
            key: _args.pipe,
            value: output
          });
        }

        return resolve({
          args: Object.assign({}, _args),
          attach: {},
          code: 0,
          data: output,
        });

      })();
    }, 0); 
  });

  



}