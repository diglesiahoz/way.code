way.lib.getLibConfig = function (callname) {
  var libConfig = undefined;
  var libArr = [];
  var libConfigCallKeys = [];
  if (way.lib.check(way.map.lib[callname])) {
    var callsource = way.map.lib[callname].split("/")[0];
    var calltree = way.map.lib[callname].replace(/^(core|custom)\/(lib|app)\//, "");
    if (/\/(lib|app)\//.test(calltree)) {
      var tree = calltree.replace(/\/(lib)/,"").split("/");
      tree.pop();
      if (callsource == "custom") {
        var calltreekey = `app.${tree.join(".")}`;
      } else {
        var calltreekey = `lib.${tree.join(".")}`;
      }
      try {
        var libArr = callname.split(".");
        var libConfigCallKeys = eval(`Object.keys(way.config.${calltreekey}.interface.${libArr[0]})`);
        var libConfig = eval(`way.config.${calltreekey}.interface.${callname}`);
      } catch(e) {}
    }
    if (!way.lib.check(libConfig)) {
      if (way.lib.check(libArr[1])) {
        if (!libConfigCallKeys.includes(libArr[1])) {
          way.lib.exit(`No definida interfaz "${libArr[0]}.${libArr[1]}" desde aplicación "${libArr[0]}"`);
        }
        libConfig = {}
      } else {
        if (way.config[callsource].interface == null || !Object.keys(way.config[callsource].interface).includes(callname)) {
          way.lib.exit(`No definida interfaz "${callname}" desde configuración "${callsource}"`);
        }
        libConfig = way.config[callsource].interface[callname];
      }
    }
    return libConfig;
  } else {
    way.lib.exit(`No definida llamada a librería "${callname}"`)
  }
}