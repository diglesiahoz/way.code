way.lib.getArrayFilter = function (_args) {
  var _args = way.lib.getArgs('getArrayFilter', _args);
  var output = [];
  if (_args.array.length > 0) {
    for (v of _args.array) {
      if (new RegExp(_args.filter, "g").test(v)) {
        output.push(v);
      }
    }
  }
  return output;
}