way.lib.getConfigAsTree = function (_args){
  var _args = way.lib.getArgs('getConfigAsTree', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        //console.log(_args)

        var configData = await way.lib.loadConfig({
          key: [_args.key],
          force: true
        }).catch((o) => {
          return {};
        });

        _args.filter_setting = _args.filter_setting.replace(/\*/g, '.*')
        // console.log(_args.filter_setting)

        // Ejemplo: 
        //
        // objectAsTree = way.lib.getObjectAsTree(configData, [
        //   '^env'
        // ]);
        //
        objectAsTree = way.lib.getObjectAsTree(configData, [`^${_args.filter_setting}`]);

        // console.log('objectAsTree', JSON.stringify(objectAsTree, null, 2))

        resolve({
          args: Object.assign({}, _args),
          attach: {},
          code: 0,
          data: objectAsTree,
        });

      })();
    }, 0); 
  });
}