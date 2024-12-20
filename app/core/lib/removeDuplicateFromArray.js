way.lib.removeDuplicateFromArray = function (_args) {
  var _args = way.lib.getArgs('removeDuplicateFromArray', _args);
  return _args.data.filter((item, index) => _args.data.indexOf(item) === index);
}

