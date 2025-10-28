way.lib.ask = async function (_args){

  var _args = way.lib.getArgs('ask', _args);

  const { Select } = require('enquirer');

  if (!way.opt.y) {
    if (way.lib.check(_args.color)) {
      _args.message = console.log(`${eval(`require('ansi-colors').${_args.color}('${_args.message}')`)}`);
    }
    const prompt = new Select({
      message: _args.message,
      choices: ['Si', 'No']
    });
    try {
      var res = await prompt.run();
      if (_args.exitIfNegative && res == 'No') {
        way.lib.exit(_args.exitMessage);
      }
      if (_args.onlyResponse === false) {
        if (res == 'No') {
          way.lib.log({ message:'Aborted!', type:'warn' });
        } else {
          if (way.lib.check(_args.messageProgress)) {
            way.lib.log({ message:_args.messageProgress, type:'label' });
          }
        }
      }
      return (res == 'Si') ? true : false;
    } catch(err) {
      way.lib.log({ message:'Aborted!', type:'warn' });
      process.exit();
    }
  } else {
    if (_args.onlyResponse === false) {
      if (way.lib.check(_args.messageProgress)) {
        way.lib.log({ message:_args.messageProgress, type:"label" });
      }
    }
    return true;
  }
}