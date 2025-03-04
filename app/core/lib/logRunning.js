way.lib.logRunning = function (data) {
  if (way.opt.v) {
    way.lib.log({ message: `${data}...`, type: `label`})
  } else {
    way.lib.log({ message: data, type: `running`});
  }
}

