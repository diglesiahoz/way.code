way.lib.getFile = async function (_args) {
  var _args = way.lib.getArgs('getFile', _args);
  oKey = _args.key;
  //_args.key = `${way.proc.appconfig.replace(/^(core|custom)\//,"").replace(/config$/,"").replace(/\//g,".")}${_args.key}`;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        if (way.lib.check(way.map.file[_args.key])) {
          filepath = way.map.file[_args.key];
          //console.log(filepath)

          const fs = require('fs');
          var tmp = require('tmp');

          var fileContent = fs.readFileSync(filepath, 'utf8');
          if (!_args.decode && way.lib.check(_args.data)) {
            way.lib.log({
              message: `Revisa llamada a "getFile". No aplica propiedad "decode" al estar definido "data"`,
              type: "warning"
            })
          }
          if (way.lib.check(_args.data)) {
            _args.decode = true;
          } else {
            _args.data = {};
          }

          dataClone = way.lib.clone({ data: _args.data });

          var data = await way.lib.decode({
            data: fileContent,
            throwException: [ "simple", "global", "map" ],
            gData: dataClone,
            showWarn: false
          });
          
          var data = await way.lib.decode({
            data: data,
            throwException: [ "simple", "global", "map" ],
            gData: dataClone,
            showWarn: false
          });



          /*

          //way.lib.log({ message: dataClone, type: "console" })
          //console.log(way.lib.tree(dataClone))

          //console.log(eval(`dataClone.cookieByCategory[1].cookies[0].constructor.name`))
          //console.log(eval(`dataClone.cookieByCategory[1].cookies[0]`))

          if (_args.dataParse) {
            k = _args.key.split(".");
            k.pop();
            parentKey = k.join(".")
            //console.log(parentKey)

            //way.lib.exit()
            evaluated = {}

            //console.log(way.lib.tree(dataClone).filter(word => word.endsWith("]")).reverse())
            filter = way.lib.tree(dataClone).filter(word => word.endsWith("]"))
            //filter.reverse()
            filter.sort(function(a, b){
              // ASC  -> a.length - b.length
              // DESC -> b.length - a.length
              return b.length - a.length;
            });
            //console.log(filter)

            //way.lib.exit()

            //console.log(filter.reverse())
            for (f of filter) {
              try {
                //console.log();console.log(f)
                //console.log(eval(`dataClone${f}`))
                ftype = eval(`dataClone${f}.constructor.name`)
                
                
                if (ftype == "Object") {
                  //console.log();console.log(ftype, f)
                  data = eval(`dataClone${f}`)
                  incKey = `${parentKey}.${f.replace(/\[[0-9]*\]/g,"-").replace(/\./g,"").replace(/-$/g,"")}`
                  //console.log(incKey)
                  if (!way.lib.check(way.map.file[incKey])) {
                    way.lib.exit(`Detectado objeto. No encuentra plantilla "${incKey}"`)
                  }
                  var incFile = fs.readFileSync(way.map.file[incKey], 'utf8');
                  //console.log(way.lib.tree(data))
                  //way.lib.tree(dataClone).filter(word => word.endsWith("]"))
                  for (i of way.lib.tree(data)) {
                    if (Object.keys(evaluated).includes(`${f}${i}`)) {
                      eval(`dataClone${f}${i} = evaluated["${f}${i}"]`)
                      eval(`delete evaluated["${f}${i}"]`)
                      //console.log(`dataClone${f}${i}`)
                    } else {
                      //console.log('NO', i, `dataClone${f}${i}`)
                      //console.log('data',data)
                      //console.log(incFile)
                    }
                  }
                  //console.log(data)
                  for (i of Object.keys(data)) {
                    if (eval(`data.${i}.constructor.name`) == "Array") {
                      eval(`data.${i} = data.${i}.join("\\n")`)
                    }
                  }
                  var incFile = await way.lib.decode({
                    data: incFile,
                    //throwException: [ "simple", "global", "map" ],
                    //throwException: [],
                    gData: data,
                    showWarn: false
                  });
                  evaluated[`${f}`] = incFile;
                } else { }
              } catch (e) {
                way.lib.exit(e)
              }
            }

            for (key of Object.keys(dataClone)) {
              try {
                if (eval(`dataClone.${key}.constructor.name`) == "Array") {
                  //console.log(eval(`dataClone.${key}.constructor.name`), eval(`dataClone.${key}.length`), key, `dataClone.${key}`)
                  num = eval(`dataClone.${key}.length`);
                  allData = ""
                  for (var i = 0; i < num; i++) {
                    //console.log(`.${key}[${i}]`)
                    if (Object.keys(evaluated).includes(`.${key}[${i}]`)) {
                      allData += eval(`evaluated[".${key}[${i}]"]`);
                      eval(`delete evaluated[".${key}[${i}]"]`);
                    }
                  }
                  if (way.lib.check(allData)) {
                    eval(`dataClone.${key} = ${JSON.stringify(allData)}`)
                  }
                  //way.lib.exit()
                }
              } catch (e) {
                //eval(`dataClone.${key} = " "`)
              }
            }

            //console.log(dataClone)
          }

          //way.lib.log({ message: dataClone, type: "console" })

          var data = await way.lib.decode({
            data: fileContent,
            throwException: [ "simple", "global", "map" ],
            gData: dataClone,
            showWarn: false
          });
          
          var data = await way.lib.decode({
            data: data,
            throwException: [ "simple", "global", "map" ],
            gData: dataClone,
            showWarn: false
          });


          //data = data.replace(/\\/g, '\\\\')
          //console.log(way.lib.tree(dataClone))


          //way.lib.log({ message: dataClone, type: "console" })

          */


          const tmpobj = tmp.fileSync({ 
            mode: 0o644, 
            prefix: `way`,
          });
          try {
            fs.writeFileSync(tmpobj.name, data);
            //tmpobj.removeCallback();
          } catch(e) {
            return reject({message:`No ha podido crear el fichero temporal desde getFile`});
          }

          resolve({
            args: Object.assign({}, _args),
            attach: {
              file: tmpobj
            },
            code: 0,
            data: data,
          });

        } else {
          way.lib.log({
            message: `Fichero no encontrado: ${_args.key}`,
            type: "warning"
          })
          reject();
        }
      })();
    }, 0); 
  });
}