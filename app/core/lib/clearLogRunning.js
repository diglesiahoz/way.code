way.lib.clearLogRunning = function (_args) {
  var _args = way.lib.getArgs('clearLogRunning', _args);
  process.stdout.write("\r\x1b[K")
}

