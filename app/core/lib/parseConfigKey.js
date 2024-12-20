way.lib.parseConfigKey = async function (_args) {
  var _args = way.lib.getArgs('parseConfigKey', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        if (/@/.test(_args.key)) {
          var tmp = _args.key.split("\"");
          var tmpSignature = "";
          if (tmp.length > 1) {
            var c = 0;
            for (tmpKey of tmp) {
              if (/\[$/.test(tmpKey)) {
                var tmp = tmpKey.replace(/\[$/g,'');
                var tmp = tmp.split(".");
                if (c == 0) {
                  tmp.shift();
                }
                tmpSignature = `${tmpSignature}["${tmp.join(".").replace(/\./g, "\"][\"")}"]`;
              } else  {
                if (!/\]$/.test(tmpKey)) {
                  tmpSignature = `${tmpSignature}["${tmpKey.replace(/^\]\./,'')}"]`;
                }
              }
            }
            tmpSignature = `way${tmpSignature}`;
            resolve(tmpSignature);
          } else {
            var tmp = _args.key.split(".");
            if (_args.force == false) {
              tmp.shift();
              resolve(`way["${tmp.join(".").replace(/\./g, "\"][\"")}"]`);
            } else {
              resolve(`way["config"]["${tmp.join(".").replace(/\./g, "\"][\"")}"]`);
            }
          }
        } else {
          if (_args.force == true) {
            var pout = "";
            var tmp = _args.key.split("\"");
            //console.log(tmp)
            var tmpSignature = "";
            if (tmp.length > 1) {
              for (tmpKey of tmp) {
                if (/\[/.test(tmpKey) || /\]/.test(tmpKey)) {
                  //console.log(1,tmpKey)
                  tmpSignature = `${tmpSignature}${tmpKey}`;
                } else {
                  if (tmpKey != "") {
                    //console.log(2,`"${tmpKey}"`)
                    tmpSignature = `${tmpSignature}${`"${tmpKey}"`}`;
                  }
                }
                //console.log(tmpSignature)
              }
              tmpSignature = `.${tmpSignature}`
              resolve(tmpSignature);
            } else {
              resolve(`["${tmp.join(".").replace(/\./g, "\"][\"")}"]`);
            }
          } else {
            resolve(_args.key);
          }
        }
      })();
    }, 0); 
  });
}

