way.lib.removeDuplicateFromString = function (_args) {
  var _args = way.lib.getArgs('removeDuplicateFromString', _args);
  var array = _args.data.split(" ");
  array = array.filter((item, index) => array.indexOf(item) === index);
  _args.data = array.join(" ");
  if (_args.pipe != "") {
    way.lib.var({
      key: _args.pipe,
      value: _args.data
    });
  }
  return _args.data
}

