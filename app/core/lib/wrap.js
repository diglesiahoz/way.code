way.lib.wrap = function (_args) {
  var _args = way.lib.getArgs('wrap', _args);
  _args.data = _args.data.toString();
  return _args.data.substring(0, Math.min(_args.data.length, _args.max));
}
