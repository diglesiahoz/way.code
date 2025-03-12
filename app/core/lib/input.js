way.lib.input = async function (_args) {
  var _args = way.lib.getArgs('input', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        const prompt = require('prompt-sync')();
        var exit = 0; 
        while (exit == 0) {
          way.lib.log({message: _args.message, type: 'console'});
          var input = "";
          var input = prompt();
          if (way.lib.check(input)) {
            exit = 1;
          } else {
            if (input == "") {
              exit = 1;
            }
          }
        }

        o = {}
        o.args = Object.assign({}, _args);
        o.attach = {};
        o.code = null,
        o.data = input;
        resolve(o);

      })();
    }, 0);       
  });
}