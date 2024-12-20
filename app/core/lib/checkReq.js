way.lib.checkReq = function (_args) {
  var _args = way.lib.getArgs('checkReq', _args);
  if (_args.data.constructor.name !== "Array") {
    way.lib.exit(`Comprobación de tarea espera un "array" (task::check)`);
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        var err = false;
        var checkstatus = [];
        for (var tc = 0; tc < _args.data.length; tc++) {
          var ocheck = _args.data[tc];
          var dcheck = await way.lib.decode({
            data: ocheck,
            //throwException: [ "simple", "global", "map" ]
          });
          var dcheckkeys = Object.keys(dcheck);
          if (dcheckkeys.includes("is") && dcheckkeys.includes("eval")) {
            try {
              var data = await way.lib.decode({
                data: ocheck.eval,
              });
              var evaluated = await way.lib.eval({
                cmd: data,
              });
            } 
            catch (e) {
              console.log(e)
              way.lib.exit(`Fallo al evaluar "${ocheck.eval}"`);
            }
            var okey = ocheck["eval"];
            var key = evaluated.data;
          } 
          else if (dcheckkeys.includes("is") && dcheckkeys.includes("exec")) {
            try {
              var data = await way.lib.decode({
                data: ocheck.exec,
              });
              var executed = await way.lib.exec({
                cmd: data,
                out: false
              });
            } 
            catch (e) {
              if (e.code != 1) {
                console.log(e)
                way.lib.exit(`Fallo al ejecutar "${ocheck.exec}"`);
              }
            }
            var okey = ocheck["exec"];
            if (!way.lib.check(executed)) {
              var key = "";
            } else {
              var key = executed.buffer;
            }
          }
          else if (dcheckkeys.includes("is") && dcheckkeys.includes("key")) {
            var okey = ocheck["key"];
            var key = dcheck["key"];
          }
          else {
            way.lib.exit(`Fallo de sintaxis en comprobación (check). Requiere como mínimo (eval+is, key+is)`);
          }
          
          var is = dcheck["is"];
          if (/^\/.*\/$/.test(is)) {
            var reg = new RegExp(`${is.replace(/^\//,"").replace(/\/$/,"")}`, "g");
            is = "RegExp";
          }

          switch (is) {
            case "Boolean":
            case "Number":
            case "Object":
            case "Array":
            case "String": 
              if (dcheckkeys.includes("value")) {
                way.lib.log({
                  message: `Revisa sintaxis en comprobación (check). Propiedad "is" con valor "${is}" no requiere propiedad "value"`,
                  type: "warning"
                });
              }
              var k = key;
              check = `(k.constructor.name == "${is}") ? true: false;`;
              //console.log(`(${key}.constructor.name == "${is}") ? true: false;`)
              break;
            case "empty": 
              if (dcheckkeys.includes("value")) {
                way.lib.log({
                  message: `Revisa sintaxis en comprobación (check). Propiedad "is" con valor "${is}" no requiere propiedad "value"`,
                  type: "warning"
                });
              } 
              var k = eval(JSON.stringify(`${await way.lib.decode({ data: key })}`))
              if (k == "") {
                check = `("") ? false: true;`;
              } else {
                if (k == "false") {
                  check = `("") ? false: true;`;
                } else {
                  check = `(!"") ? false: true;`;
                }
              }
              break;
            case "not empty":
              if (dcheckkeys.includes("value")) {
                way.lib.log({
                  message: `Revisa sintaxis en comprobación (check). Propiedad "is" con valor "${is}" no requiere propiedad "value"`,
                  type: "warning"
                });
              } 
              var k = eval(JSON.stringify(`${await way.lib.decode({ data: key })}`))
              if (k == "") {
                check = `("") ? true: false;`;
              } else {
                if (k == "false") {
                  check = `("") ? true: false;`;
                } else {
                  check = `(!"") ? true: false;`;
                }
              }
              break;
            case "equal": 
            case "not equal": 
              if (!dcheckkeys.includes("value")) {
                way.lib.exit(`Fallo de sintaxis en comprobación (check). Propiedad "is" requiere propiedad "value"`);
              } else {
                var value = dcheck["value"];
              }
              var k = key;
              if (is == "equal") {
                var op = "===";
              }
              if (is == "not equal") {
                var op = "!==";
              }
              if (value.constructor.name != "Boolean") {
                var value = JSON.stringify(value);
              }
              check = `(k ${op} ${value}) ? true: false;`;
              break;
            case true:
            case false:
              if (dcheckkeys.includes("value")) {
                way.lib.log({
                  message: `Revisa sintaxis en comprobación (check). Propiedad "is" con valor "${is}" no requiere propiedad "value"`,
                  type: "warning"
                });
              }
              if (key.constructor.name !== "Boolean") {
                key = JSON.stringify(key)
              }
              if (is == true) {
                check = `(${key} == true) ? true: false;`;
              } else {
                check = `(${key} == false) ? true: false;`;
              }
              break;
            case "decoded":
              //console.log(JSON.stringify(ocheck.key), JSON.stringify(dcheck.key))
              if ((JSON.stringify(ocheck.key) != JSON.stringify(dcheck.key))) {
                check = `(true == true) ? true: false;`;
              } else {
                check = `(true == false) ? true: false;`;
              }
              break;
            case "RegExp":
              if (typeof reg === "undefined") {
                var reg = new RegExp(ocheck.value, "g");
              }
              if (reg.test(key)) {
                check = `(true == true) ? true: false;`;
              } else {
                check = `(true == false) ? true: false;`;
              }
              break;
            case "set":
                check = `require("fs").existsSync('${ await way.lib.decode({ data: key }) }') ? true: false;`
                break;
            default:
              way.lib.exit(`Fallo de sintaxis en comprobación (check). No soportado "${is}" como valor de propiedad "is"`);
          }
          try {
            var scheck = eval(check);
            //console.log(`${is} ==> ${key} ==> ${check} ===`, scheck);
            if (!scheck) {
              way.lib.log({ message:`CHECK: ${check} ==> ${scheck}`});
              way.lib.log({ message:`No cumple condición...` });
              way.lib.log({ message:ocheck });
            } else {
              way.lib.log({ message:`CHECK: ${check} ==> ${scheck}`});
            }
            //if (!scheck) {
            //  way.lib.log({message:`No cumple requisito: ${ocheck.key}`, type:"warning"});
            //}
            checkstatus.push(scheck);
          } catch(e) {
            way.lib.log({ message:`Fallo de sintaxis en expresión "${ocheck}" (${e.message})`, type:"warning" });
            err = true;
          }
        }
        if (err) {
          way.lib.exit()
        }
        //return checkstatus;
        resolve(checkstatus);
      })();
    }, 0); 
  });
}