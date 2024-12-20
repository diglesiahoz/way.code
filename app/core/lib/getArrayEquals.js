way.lib.getArrayEquals = function (_args) {
  var _args = way.lib.getArgs('getArrayEquals', _args);
  return _args.array1.filter(x => _args.array2.includes(x))
}