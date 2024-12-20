way.lib.getArrayMerge = function (_args) {
  var _args = way.lib.getArgs('getArrayMerge', _args);
  var arrayMerged = [];
  Array.prototype.push.apply(arrayMerged, _args.array1);
  Array.prototype.push.apply(arrayMerged, _args.array2);
  return way.lib.removeDuplicateFromArray(arrayMerged);
}