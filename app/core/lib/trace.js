way.lib.trace = function (){
  var obj = {};
  Error.captureStackTrace(obj, way.lib.trace);
  var trace = obj.stack.split("\n");
  delete trace[0];
  trace = trace.filter(item => item);
  for (var i = 0; i < trace.length; i++) {
    trace[i] = trace[i].split(" ").pop().replace("(","").replace(")","");
  }
  return trace;
}
