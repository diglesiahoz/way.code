way.lib.ask = async function (_args){

  var _args = way.lib.getArgs('ask', _args);

  const { Select } = require('enquirer');

  if (!way.opt.y) {
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
          way.lib.log({ message:'Abortado!', type:'warn' });
        } else {
          if (way.lib.check(_args.messageProgress)) {
            way.lib.log({ message:_args.messageProgress, type:'label' });
          }
        }
      }
      return (res == 'Si') ? true : false;
    } catch(err) {
      way.lib.log({ message:'Abortado!', type:'warn' });
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