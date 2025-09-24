way.lib.exit = function (data) {

  var color = require('ansi-colors');
  var figures = require('figures');

  var error = arguments[1] || '';

  if (typeof data === "undefined") {
    //console.log(color.redBright(`${figures.cross} Abortado!`));
    //console.log(color.yellow(`${figures.warning} Abortado! (exit)`));
    console.log(`${color.bold.red("exit")} ${color.white(`¡Abortado!`)}`)
  } else {
    //console.log(color.yellow(`${figures.warning} ${data} (exit)`));
    console.log(`${color.bold.red("exit")} ${color.white(data)}`)
  }
  //if (way.opt.l){
    if (typeof error !== "undefined") {
      var e = error.stack;
    } else {
      var e = new Error().stack;
    }
    if (typeof e === "undefined") {
      if (typeof way.opt !== "undefined") {
        if (way.log.level > 0) {
          console.log(color.dim.white(figures.circleDouble + ' StackTrace:'))
          for (t of way.lib.captureStackTrace()) {
            console.log(color.dim.white(`  - ${t}`))
          }
        }
      }
    } else {
      console.log(color.dim.white(figures.circleDouble + ' ' + e))
    }
  //}
  process.exit(1);
}