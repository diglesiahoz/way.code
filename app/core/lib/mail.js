// REF: https://edigleyssonsilva.medium.com/how-to-send-emails-securely-using-gmail-and-nodejs-eef757525324
way.lib.mail = async function (_args) {
  var _args = way.lib.getArgs('mail', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        if (way.opt.m || _args.force) {
          if (way.lib.check(_args.data)) {
            var data = way.lib.toHTML({ 
              data: _args.data
            });
            _args.html = data;
          }
          if (!way.lib.check(_args.html) && !way.lib.check(_args.text)) {
            return reject('mail: No establecido cuerpo del mensaje');
          }
          var nodemailer = require('nodemailer');
          //console.log(_args.transporter)
          const transporter = nodemailer.createTransport(_args.transporter);
          //transporter.verify();
          transporter.sendMail({
            from: _args.from,
            to: _args.to,
            bcc: _args.bbc,
            subject: _args.subject,
            text: _args.text,
            html: _args.html
          }, function(error, info){
            if (error) {
              console.log(error.message.trim())
              reject({
                args: Object.assign({}, _args),
                attach: {},
                code: 1,
                data: {
                  message: `Fallo al enviar el email (${error.message.trim()})`
                },
              });
            } else {
              resolve({
                args: Object.assign({}, _args),
                attach: {},
                code: 0,
                data: {
                  message: _args.sentMessage
                }
              });
            }
          });
        } else {
          way.lib.log({
            message:`Excluye enviar e-mail. (Necesario establecer la opción global "-m")`, 
            type: "warning"
          });
          resolve({
            args: Object.assign({}, _args),
            attach: {},
            code: 0,
            data: {
              message: `Excluye enviar e-mail. (Necesario establecer la opción global "-m")`
            },
          });
        }
      })();
    }, 0);       
  });
}