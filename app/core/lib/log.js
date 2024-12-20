way.lib.log = function (_args) {
  var oargs = _args;
  var _args = way.lib.getArgs('log', _args);
  if (_args == null) {
    _args = oargs;
  }

  //if (!way.lib.check(_args.type)) {
  //  _args.type = "pretty"
  //}
  if (!way.lib.check(_args.label)) {
    _args.label = arguments[2] || '';
  }

  var figures = require('figures');
  var color = require('ansi-colors');
  var jclrz = require('json-colorz');

  
  
  if (typeof _args.message === 'string' && _args.type != '') {
    //console.log(_args.type)
    _args.message = _args.message.replace(/\n[\s]*/g, "\n  ");
  }
  if (typeof _args.message === 'string' && _args.type == '') {
    _args.message = _args.message.replace(/\n[\s]*/g, "\n");
  }

  var iLogMessage = null;

  switch (_args.type) {
    case 'console':
      if (way.opt.v){
        var iLogMessage = _args.message;
        console.log(_args.message);
      }
      break;
    case 'label':
      if (way.opt.v){
        var icon = figures.line;
        if (typeof _args.message === "string" || typeof _args.message === "number" || typeof _args.message === "boolean") {
          var iLogMessage = `${color.gray(icon)} ${color.gray(_args.message)}`;
          console.log(`${color.gray(icon)} ${color.gray(_args.message)}`);
        } else {
          if (way.lib.check(_args.label)) {
            console.log(`${color.gray(icon)} ${color.gray(_args.label)}`)
          } else {
            console.log(`${color.gray(icon)}`)
          }
          var maincolor = [ "white" ];
            jclrz.colors.attr  = maincolor
            jclrz.colors.str   = maincolor
            jclrz.colors.num   = maincolor
            jclrz.colors.bool  = maincolor
            jclrz.colors.quot  = maincolor
            jclrz.colors.punc  = maincolor
            jclrz.colors.brack = maincolor
            jclrz.colors.date  = maincolor
            jclrz.colors.regex = maincolor
            jclrz.colors.null =  maincolor
            jclrz.colors.undef = maincolor
            jclrz.colors.func  = maincolor
            jclrz(_args.message)
        }
      }
      break;
    case 'running':
      if (!way.opt.v){
        var icon = figures.line;
        if (typeof _args.message === "string" || typeof _args.message === "number" || typeof _args.message === "boolean") {
          var iLogMessage = `${color.gray(icon)} ${color.gray(_args.message)}`;
          process.stdout.write(`${color.gray(`${_args.message}...`)}`);
        } else {
          if (way.lib.check(_args.label)) {
            process.stdout.write(`${color.gray(`${_args.message}...`)}`)
          } else {
            process.stdout.write(`...`)
          }
          var maincolor = [ "white" ];
            jclrz.colors.attr  = maincolor
            jclrz.colors.str   = maincolor
            jclrz.colors.num   = maincolor
            jclrz.colors.bool  = maincolor
            jclrz.colors.quot  = maincolor
            jclrz.colors.punc  = maincolor
            jclrz.colors.brack = maincolor
            jclrz.colors.date  = maincolor
            jclrz.colors.regex = maincolor
            jclrz.colors.null =  maincolor
            jclrz.colors.undef = maincolor
            jclrz.colors.func  = maincolor
            jclrz(_args.message)
        }
      }
      break;
    case 'verbose':
      if (way.opt.v && way.log.level > 0) {
        if (typeof _args.message === "string" || typeof _args.message === "number" || typeof _args.message === "boolean") {
          // console.log(color.cyan("·"), color.cyan(_args.message))
          console.log(color.cyan(_args.message))
        } else {
          var maincolor = [ "cyan" ];
          jclrz.colors.attr  = maincolor
          jclrz.colors.str   = maincolor
          jclrz.colors.num   = maincolor
          jclrz.colors.bool  = maincolor
          jclrz.colors.quot  = maincolor
          jclrz.colors.punc  = maincolor
          jclrz.colors.brack = maincolor
          jclrz.colors.date  = maincolor
          jclrz.colors.regex = maincolor
          jclrz.colors.null =  maincolor
          jclrz.colors.undef = maincolor
          jclrz.colors.func  = maincolor
          jclrz(_args.message)
        }
      }
      break;
    case 'success':
      // if (!way.opt.v) {
      //   way.lib.clearLogRunning()
      // }
      var icon = figures.tick;
      if (typeof _args.message === "string" || typeof _args.message === "number" || typeof _args.message === "boolean") {
        var iLogMessage = `${color.greenBright(icon)} ${color.white.dim(_args.message)}`;
        //console.log(`${color.greenBright(icon)} ${color.white(_args.message)}`)
        console.log(`${color.bold.green("success")} ${color.white.dim(_args.message)}`)
        //var iLogMessage = `${color.bgGreen(" SUCC ")} ${color.white(_args.message)}`;
        //console.log(`${color.bgGreen(" SUCC ")} ${color.white(_args.message)}`)
      } else {
        //if (way.lib.check(_args.label)) {
        //  console.log(`${color.greenBright(icon)} ${color.dim(_args.label)}`)
        //} else {
        //  console.log(`${color.greenBright(icon)}`)
        //}
        var maincolor = [ "green" ];
          jclrz.colors.attr  = maincolor
          jclrz.colors.str   = maincolor
          jclrz.colors.num   = maincolor
          jclrz.colors.bool  = maincolor
          jclrz.colors.quot  = maincolor
          jclrz.colors.punc  = maincolor
          jclrz.colors.brack = maincolor
          jclrz.colors.date  = maincolor
          jclrz.colors.regex = maincolor
          jclrz.colors.null =  maincolor
          jclrz.colors.undef = maincolor
          jclrz.colors.func  = maincolor
          jclrz(_args.message)
      }
      break;      
    case 'warning':
      // if (!way.opt.v) {
      //   way.lib.clearLogRunning()
      // }
      var icon = figures.warning;
      if (typeof _args.message === "string" || typeof _args.message === "number" || typeof _args.message === "boolean") {
        var iLogMessage = `${color.yellow(icon)} ${color.yellow(_args.message)}`;
        //console.log(`${color.yellow(icon)} ${color.yellow(_args.message)}`)
        console.log(`${color.bold.yellow("warning")} ${color.white(_args.message)}`)
      } else {
        if (way.lib.check(_args.label)) {
          console.log(`${color.yellow(icon)} ${color.yellow(_args.label)}`)
          //console.log(`${color.yellow(icon)} ${color.yellow.italic(_args.label)}`)
        } else {
          //console.log(`${color.yellowBright(icon)}`)
        }
        //var maincolor = [ "brYellow" ];
        var maincolor = [ "yellow" ];
          jclrz.colors.attr  = maincolor
          jclrz.colors.str   = maincolor
          jclrz.colors.num   = maincolor
          jclrz.colors.bool  = maincolor
          jclrz.colors.quot  = maincolor
          jclrz.colors.punc  = maincolor
          jclrz.colors.brack = maincolor
          jclrz.colors.date  = maincolor
          jclrz.colors.regex = maincolor
          jclrz.colors.null =  maincolor
          jclrz.colors.undef = maincolor
          jclrz.colors.func  = maincolor
          jclrz(_args.message)
      }
      break;
    case 'error':
      var icon = figures.error;
      if (typeof _args.message === "string" || typeof _args.message === "number" || typeof _args.message === "boolean") {
        var iLogMessage = `${color.red(icon)} ${color.red(_args.message)}`;
        //console.log(`${color.yellow(icon)} ${color.yellow(_args.message)}`)
        console.log(`${color.bold.red("error")} ${color.white(_args.message)}`)
      } else {
        if (way.lib.check(_args.label)) {
          console.log(`${color.red(icon)} ${color.red(_args.label)}`)
        }
        //var maincolor = [ "brYellow" ];
        var maincolor = [ "red" ];
        jclrz.colors.attr  = maincolor
        jclrz.colors.str   = maincolor
        jclrz.colors.num   = maincolor
        jclrz.colors.bool  = maincolor
        jclrz.colors.quot  = maincolor
        jclrz.colors.punc  = maincolor
        jclrz.colors.brack = maincolor
        jclrz.colors.date  = maincolor
        jclrz.colors.regex = maincolor
        jclrz.colors.null =  maincolor
        jclrz.colors.undef = maincolor
        jclrz.colors.func  = maincolor
        jclrz(_args.message);
      }
      break;
    case 'pretty':
      var icon = figures.circleDouble;
      switch (typeof _args.message) {
        case "number":
        case "boolean":
        case "string":
          console.log(_args.message);
          break;
        default:
          if (way.lib.check(_args.label)) {
            console.log(`${color.white(icon)} ${color.blue(_args.label)}`);
          }
          //jclrz.params.colored = false
          //jclrz.display.func = true
          jclrz.colors.attr  = ['white'] // cyan
          jclrz.colors.str   = ['green']
          jclrz.colors.num   = ['green']
          jclrz.colors.bool  = ['yellow']
          jclrz.colors.quot  = ['green']
          jclrz.colors.punc  = ['white']
          jclrz.colors.brack = ['white']
          jclrz.colors.date  = ['green'] 
          jclrz.colors.regex = ['green'] 
          jclrz.colors.null =  ['green']
          jclrz.colors.undef = ['green']
          jclrz.colors.func  = ['cyan'] 
          jclrz(_args.message)
      }
      break;
    case 'out':
      return _args.message
      break;
    default:
      if (way.log.level > 2){
        var icon = figures.circleDouble;
        if (typeof _args.message === "string" || typeof _args.message === "number" || typeof _args.message === "boolean") {
          console.log(`${color.dim.white(icon)} ${color.dim.white(_args.message)}`)
        } else {
          if (way.lib.check(_args.label)) {
            console.log(`${color.dim.white(icon)} ${color.dim.white(_args.label)}`)
          } else {
            console.log(`${color.dim.white(icon)}`)
          }
          var maincolor = [ "white", "dim" ];
            jclrz.colors.attr  = maincolor
            jclrz.colors.str   = maincolor
            jclrz.colors.num   = maincolor
            jclrz.colors.bool  = maincolor
            jclrz.colors.quot  = maincolor
            jclrz.colors.punc  = maincolor
            jclrz.colors.brack = maincolor
            jclrz.colors.date  = maincolor
            jclrz.colors.regex = maincolor
            jclrz.colors.null =  maincolor
            jclrz.colors.undef = maincolor
            jclrz.colors.func  = maincolor
            jclrz(_args.message)
        }
      }
  }

  if (typeof way.task.logMessages !== "undefined" && (_args.type == "label" || _args.type == "success" || _args.type == "warning" || _args.type == "console")) {
    way.task.logMessages.push(iLogMessage);
  }
  
}