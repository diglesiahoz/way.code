way.lib.fetch = async function (_args){
  var _args = way.lib.getArgs('fetch', _args);
  /* Maneja límite de tiempo de espera */
    const AbortController = require("abort-controller")
    const controller = new AbortController();
    const timeout = setTimeout(() => { 
      controller.abort(); 
    }, _args.timeout);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (way.lib.check(_args.options) && way.lib.check(_args.options.rejectUnauthorized)) {
        var agent = new require("https").Agent({
          rejectUnauthorized: _args.options.rejectUnauthorized
        });
      }

      options         = {};
      options.signal  = controller.signal;
      options.agent   = agent;
      options.method  = _args.method;
      options.headers = _args.headers;

      //(_args.method == "POST") ? options.body = JSON.stringify(_args.data): undefined;
      var type = "";
      if (_args.method == "POST") {
        for (header in _args.headers) {
          if (header == "Content-Type") {
            if (/application\/x-www-form-urlencoded/.test(_args.headers[header])) {
              var type = 'URL_ENCODE';
            }
            if (/application.*json/.test(_args.headers[header])) {
              var type = 'JSON';
            }
          }
        }
        switch (type) {
          case 'URL_ENCODE':
            var output = "";
            for (key in _args.data) {
              output = `${output}&${key}=${_args.data[key]}`
            }
            options.body = output.substring(1);
            break;
          case 'JSON':
            options.body = JSON.stringify(_args.data);
            break;
          default:
            return reject({
              args: Object.assign({}, _args),
              attach: {},
              code: 0,
              data: {
                message: `No soportado tipo de contenido enviado en petición. Revisa cabecera "Content-Type"`
              },
            });
        }
      }

      // Obtiene "Authorization" desde usuario y password
      if (JSON.stringify(_args.login) != '{"user":"","pass":""}') {
        var authorization = Buffer.from(`${_args.login.user}:${_args.login.pass}`).toString('base64');
        options.headers["Authorization"] = `Basic ${authorization}`;
      }
      
      //console.log(_args);
      //console.log(options);

      require('node-fetch')(`${_args.base}${_args.end}`, options).then((response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json().then(data => {
            resolve({
              args: Object.assign({}, _args),
              attach: {},
              code: response.status,
              data: data,
            });
          });
        } else {
          resolve(response.status)
        }
      }).catch(error => {
        if (error.name === 'AbortError') {
          reject({
            args: Object.assign({}, _args),
            attach: {},
            code: 0,
            data: {
              message: `Timeout (${_args.timeout}) from fetch "${_args.base}${_args.end}"`
            },
          });
        } else {
          reject({message: error.message});
        }
      }).finally(() => {
        clearTimeout(timeout);
      });

    }, 0);       
  });
}