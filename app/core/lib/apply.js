way.lib.apply = function (_args) {
  var _args = way.lib.getArgs('apply', _args);
  if (way.opt.apply.indexOf('new') == -1) {
    way.opt.apply.push(_args.value);
    way.lib.log({
      message: `Aplica "${_args.value}"`,
      type: "pretty"
    });
  }
}

