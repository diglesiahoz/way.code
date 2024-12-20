way.lib.removeEmptyFromArray = function (_args) {
  var _args = way.lib.getArgs('removeEmptyFromArray', _args);
  return _args.data.filter((item, index) => way.lib.check(item));
}

