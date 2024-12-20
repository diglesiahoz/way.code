way.lib.hook = function (hookname, hookvalue){
  var ohook = hookname;
  //if (/^\(@[a-z0-9\.]*\)\./.test(hookname)) {
  if (/^\([a-z0-9\.]*\)\./.test(hookname)) {
    //hookname = hookname.replace("(@","way.config.").replace(").",".");
    hookname = hookname.replace("(","way.config.").replace(").",".");
  } else {
    way.lib.exit(`Fallo en referencia a hook "${hookname}"`)
  }
  hookname = hookname.replace(/^"/,""). replace(/"$/,"")
  try {
    var orighookvalue = eval(hookname);
    way.lib.log({ message:`Hook: ${ohook} ===> ${hookvalue}` });
  } catch(e) {
    way.lib.exit(`Hook no valido (${ohook})`);
  }

  if (typeof orighookvalue !== 'undefined') {
    try {
      // No comprueba el tipo de datos si no tiene valor
        if (orighookvalue != null && (typeof orighookvalue != typeof hookvalue)){
          way.lib.exit(`El tipo de dato no concuerda en el hook ${ohook} (${typeof orighookvalue}) ==> (${typeof hookvalue})`);
        }
      // En función del tipo de dato sobreescribe valor
        if (typeof hookvalue === 'string') {
          eval(hookname + '="' + hookvalue + '"')
        } else {
          eval(hookname + '=' + hookvalue)
        }
      // Guarda valor de hook
        if (typeof orighookvalue === 'string') {
          eval(`way.hooked["${ohook}"]="${orighookvalue}"`);
        } else {
          eval(`way.hooked["${ohook}"]=${orighookvalue}`);
        }
    } catch(err){
      way.lib.exit(`Fallo al efectuar (${ohook}) hook`, err)
    }
  } else {
    way.lib.exit(`No está permitido inyectar valores mediante hooks. Hook no definido (${hookname})`);
  }
}