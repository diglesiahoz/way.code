way.lib.isObjEmpty = function (obj) {
  if (typeof obj !== 'object') {
    return true;
  }
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}