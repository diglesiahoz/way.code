way.lib.scapeBreakLines = function (string) {
  return string.replace(/\n/g, "\\n")
               .replace(/\r/g, "\\r")
  //return string.replace(/\\n/g, "\\n")
  //           .replace(/\\'/g, "\\'")
  //           .replace(/\\"/g, '\\"')
  //           .replace(/\\&/g, "\\&")
  //           .replace(/\\r/g, "\\r")
  //           .replace(/\\t/g, "\\t")
  //           .replace(/\\b/g, "\\b")
  //           .replace(/\\f/g, "\\f");
}