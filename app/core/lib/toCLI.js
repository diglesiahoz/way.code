way.lib.toCLI = function (_args) {
  var _args = way.lib.getArgs('toCLI', _args);
  try {
    var color = require('ansi-colors');
    var {table, getBorderCharacters} = require('table');
    _args.config.border = getBorderCharacters(_args.type);
    var data = []
    var headers = [];
    counter = 0;
    for (key in _args.data) {
      if (/[0-9]*/.test(key) && key == counter.toString()) {
        var headers = headers.concat(Object.keys(_args.data[key]))
        if (headers.length == 0 || headers[0] == 0) {
          var headers = [];
          data.push([_args.data[key]]);
        }
      } else {
        var value = _args.data[key];
        switch (value.constructor.name) {
          case "Object":
          case "Array":
            var oData = data;
            var oKey = key;
            output = way.lib.toCLI({ 
              data: value,
              color: _args.color,
              recursive: true,
              config: _args.config
            });
            oData.push([eval(`color.${_args.color}(oKey)`), output.substring(0, output.length - 1)]);
            data = oData;
            break;
          default:
            data.push([eval(`color.${_args.color}(key)`), eval(`color.${_args.color}(value)`)]);
        }
      }
      counter++;
    }
    if (headers.length > 0) {
      headers = way.lib.removeDuplicateFromArray(headers);
      oHeaders = headers;
      var headers = headers.map( (e) => {
        return eval(`color.${_args.color}(e)`);
      });
      data.push(headers);
      for (o in _args.data) {
        var obj = _args.data[o];
        var dataRow = [];
        for (header of oHeaders) {
          if (way.lib.check(obj[header])) {
            var value = obj[header];
            switch (value.constructor.name) {
              case "Object":
              case "Array":
                var oDataRow = dataRow;
                output = way.lib.toCLI({ 
                  data: value,
                  recursive: true,
                  color: _args.color,
                  config: _args.config
                });
                dataRow.push([output.substring(0, output.length - 1)]);
                break;
              default:
                dataRow.push(obj[header]);
            }
          } else {
            dataRow.push(" ");
          }
        }
        data.push(dataRow);
      }
    }
    if (_args.recursive == false) {
      console.log(eval(`color.${_args.color}(table(data, _args.config))`));
    } else {
      return table(data, _args.config);
    }
  } catch (e) {
    way.lib.exit(`way.lib.toCLI: ${e.message}`);
  }
}


