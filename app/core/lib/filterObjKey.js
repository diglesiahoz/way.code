way.lib.filterObjKey = function (data) {
  var expr = arguments[1] || /[0-9]/;
  const raw = (typeof data !== 'object') ? JSON.parse(data) : data;
  const filtered = Object.keys(raw).filter(key => expr.test(key)).reduce((obj, key) => {
    obj[key] = raw[key];
    return obj;
  }, {});
  return filtered;
}