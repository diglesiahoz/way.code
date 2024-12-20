way.lib.getConfigFromPath = function (filepath) {
  if (!way.lib.check(filepath)){
    way.lib.exit("No puede cargar la configuración desde \"" + filepath + "\"");
  }
  var data = {};
  try {
    data = require('js-yaml').safeLoad(require('fs').readFileSync(filepath, 'utf8'));
  } catch (e) {
    way.lib.exit(`Fallo de sintaxis en fichero de configuración "${filepath}"`, e);
  }
  return data;
}