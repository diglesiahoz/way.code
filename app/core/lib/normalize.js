way.lib.normalize = function (_args){
  var _args = way.lib.getArgs('normalize', _args);
  return _args.string.replace(/\W/g,"").toLowerCase()
}