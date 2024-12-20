way.lib.toHTML = function (_args) {
  var _args = way.lib.getArgs('toHTML', _args);
  try {
    var color = require('ansi-colors');
    var html = "<meta charset=\"UTF-8\">";
    if (!_args.recursive) {
      attach = `
        <style type="text/css">
          table {
            font-family: monospace;
            font-size: 1em;
          }
          th {
            padding: 5px;
            border: 1px solid #ddd;
            background: #eee;
            text-align: center;
            font-weight: normal;
          }
          tr {
            padding: 2px;
          }
          td {
            padding: 5px;
            border: 1px solid #ddd;
          }
          .key {
            background: #eee;
          }
        </style>
      `
      html += attach;
    }
    html += `<table>`;
    var headers = [];
    counter = 0;
    for (key in _args.data) {
      if (/[0-9]*/.test(key) && key == counter.toString()) {
        var headers = headers.concat(Object.keys(_args.data[key]));
        if (headers.length == 0 || headers[0] == 0) {
          var headers = [];
          html += `<tr><td>${way.lib.getWrapHtmlFromString(_args.data[key])}</td></tr>`
        }
      } else {
        var value = _args.data[key];
        switch (value.constructor.name) {
          case "Object":
          case "Array":
            var oKey = key;
            output = way.lib.toHTML({ 
              data: value,
              recursive: true
            });
            oKey = oKey.replace(/\n/g,"</br>");
            html += `<tr><td class="key">${oKey}</td><td>${output}</td></tr>`;
            break;
          default:
            key = key.replace(/\n/g,"</br>");
            html += `<tr><td class="key">${key}</td><td>${way.lib.getWrapHtmlFromString(value)}</td></tr>`;
        }
      }
      counter++;
    }
    if (headers.length > 0) {
      html += `<thead>`;
      headers = way.lib.removeDuplicateFromArray(headers);
      oHeaders = headers;
      var headers = headers.map( (e) => {
        e = e.replace(/\n/g,"</br>");
        return `<th>${way.lib.getWrapHtmlFromString(e)}</th>`;
      });
      html += headers.join("");
      html += `</thead>`;
      html += `<tbody>`;
      for (key in _args.data) {
        var obj = _args.data[key];
        html += `<tr>`;
        for (header of oHeaders) {
          if (way.lib.check(obj[header])) {
            var value = obj[header];
            switch (value.constructor.name) {
              case "Object":
              case "Array":
                output = way.lib.toHTML({ 
                  data: value,
                  recursive: true
                });
                html += `<td>${output}</td>`;
                break;
              default:
                html += `<td>${way.lib.getWrapHtmlFromString(value)}</td>`;
            }
          } else {
            html += `<td> </td>`;
          }
        }
        html += `</tr>`;
      }
      html += `</tbody>`;
    }
    html += `</table>`;
    return html;
  } catch (e) {
    way.lib.exit(`way.lib.toHTML: ${e.message}`);
  }
}


