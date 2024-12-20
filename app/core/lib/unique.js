way.lib.unique = function (_args) {
  var _args = way.lib.getArgs('unique', _args);
  let unique = _args.data.reduce(function (a, b) {
    if (a.indexOf(b) < 0 && way.lib.check(b)) a.push(b);
    return a;
  }, []);
  return unique;
}