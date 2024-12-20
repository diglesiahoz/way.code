way.lib.clone = function (_args) {
  var _args = way.lib.getArgs('clone', _args);
  return JSON.parse(JSON.stringify(_args.data));
}