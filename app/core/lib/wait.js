way.lib.wait = async function (_args){
  var _args = way.lib.getArgs('wait', _args);
  way.lib.log({ 
    message: `Esperando... ${_args.ms}ms`,
    type: "log"
  });
  return new Promise(function(resolve) { 
    setTimeout(resolve, _args.ms)
  });
}