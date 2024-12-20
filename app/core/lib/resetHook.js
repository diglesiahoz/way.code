way.lib.resetHook = function (hookname){
  var ohook = hookname;
  //hookname = hookname.replace("(@","way.config.").replace(").",".");
  hookname = hookname.replace("(","way.config.").replace(").",".");
  if (typeof way.hooked[ohook] !== 'undefined') {
    var hookvalue = way.hooked[ohook];
    way.lib.log({ message:`ResetHook: ${ohook} ==> ${hookvalue}` });
    try {
      if (typeof hookvalue === 'string') {
        eval(`${hookname}="${hookvalue}"`);
      } else {
        eval(`${hookname}=${hookvalue}`);
      }
      delete way.hooked[ohook];
    } catch(err){
      way.lib.exit(`Fallo al deshacer ${ohook} hook.`, err)
    }
  } else {
    way.lib.log({ message:`No se puede establecer el valor original desde "${ohook}"`, type:"warning" });
  }
}