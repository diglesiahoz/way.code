way.lib.getLibArg = function (data) {
  //var args = data.toString().match(/function\s.*?\(([^)]*)\)/)[1];
  var args = data.toString().match(/function[\s]*\(([^)]*)\)/);
  if (args !== null) {
    args = args[1];
    return args.split(',').map(function(arg) {
      return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function(arg) {
      return arg;
    });
  }
}