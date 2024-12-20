way.lib.bar = function (_args) {
  var _args = way.lib.getArgs('bar', _args);
  const cliProgress = require('cli-progress');
  _args.format = require('ansi-colors').dim.white(_args.format);
  return new cliProgress.SingleBar(_args, cliProgress.Presets.legacy);
}

