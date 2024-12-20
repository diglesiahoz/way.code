way.lib.check = function (data) {
  /*
  if (typeof data === 'undefined'){
    return false
  } else {
    return (data !== '' && data !== null && data != "null") ? true : false;
  }
  */
  if (typeof data === 'object' && !Array.isArray(data) && data !== null && data.constructor === ({}).constructor) {
    for(var prop in data) {
      if(data.hasOwnProperty(prop)) {
        return true;
      }
    }
    return JSON.stringify(data) !== JSON.stringify({});
  } else {
    /*
    if (typeof data !== 'undefined' && data != '' && data !== null) {
      if (typeof type !== 'undefined' && typeof data !== type) {
        return false;
      }
      return true;
    }
    return false;
    */
    if (typeof data === 'undefined'){
      return false
    } else {
      return (data !== '' && data !== null && data != "null") ? true : false;
    }
  }
}