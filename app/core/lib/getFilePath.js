way.lib.getFilePath = function (_args) {
  var _args = way.lib.getArgs('getFilePath', _args);
  if (way.lib.check(way.map.file[_args.key])) {
    if (_args.absolute == true) {
      return `${way.root}/${way.map.file[_args.key]}`;
    } else {
      return way.map.file[_args.key];
    }
  } else {
    way.lib.exit(`Fichero no encontrado: ${_args.key}`);
  }
}