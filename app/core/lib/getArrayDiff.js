way.lib.getArrayDiff = function (_args) {
  var _args = way.lib.getArgs('getArrayDiff', _args);
  return _args.array1.filter(x => !_args.array2.includes(x))
}