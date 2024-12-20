way.lib.getPerformanceTask = function (){
  const { PerformanceObserver, performance } = require('perf_hooks');
  way.time.end = performance.now()
  return (way.time.end - way.time.start) / 1000;
}