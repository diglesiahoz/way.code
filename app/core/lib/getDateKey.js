way.lib.getDateKey = function (_args) {
  var _args = way.lib.getArgs('getDateKey', _args);
  var dateFormat = require('dateformat');
  var now = new Date();
  return dateFormat(now, "yyyymmddHHMMss");
}