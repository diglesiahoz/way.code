way.lib.captureStackTrace = function (){
  var obj = {};
  Error.captureStackTrace(obj, way.lib.captureStackTrace);
  var trace = obj.stack.split("\n");
  delete trace[0];
  trace = trace.filter(item => item);
  for (var i = 0; i < trace.length; i++) {
    trace[i] = trace[i].split(" ").pop().replace("(","").replace(")","");
  }
  trace = trace.slice(1);
  return trace;
}
