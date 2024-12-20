way.lib.getConfigKeysOBSOLETO = function () {
//  prockeys = [];
//  procfailkeys = [];
//  if (way.lib.check(way.map.config) && typeof way.map.config === 'object') {
//    var mkeys = Object.keys(way.map.config);
//    //console.log(mkeys)
//    for (var m = 0; m < mkeys.length; m++) {
//      var n = mkeys[m];
//      if (/\/proc\//.test(way.map.config[n])) {
//        //console.log(way.map.config[n])
//        var c = way.lib.getConfigFromPath(way.map.config[n]);
//        var inc = true;
//        if (way.lib.check(c) && c.hasOwnProperty("task") && way.lib.check(c['task'])) {
//          if (typeof c['task'] == 'object' && !Array.isArray(c['task'])) {
//            var t = Object.keys(c['task']);
//            if (t.includes('default')) {
//              var isdefault = true;
//              t.splice(t.indexOf('default'), 1);
//              t.unshift("default");
//            } else {
//              var isdefault = false;
//              var incdefault = true;
//            }
//            for (var k = 0; k < t.length; k++) {
//              inc = true;
//              if (way.lib.check(c['task'][t[k]])) {
//                if (way.lib.check(c['task'][t[k]]['do'])) {
//                  var a = Object.keys(c['task'][t[k]]['do']);
//                  for (var p = 0; p < a.length; p++) {
//                    if (way.lib.check(c['task'][t[k]]['do'][p]) && (c['task'][t[k]]['do'][p].hasOwnProperty//('call') || c['task'][t[k]]['do'][p].hasOwnProperty('check'))) {
//                    /*
//                    if (way.lib.check(c['task'][t[k]]['do'][p]) && c['task'][t[//k]]['do'][p].hasOwnProperty('call')) {
//                      if (way.lib.check(c['task'][t[k]]['do'][p]['call'])) {
//                        var callname = c['task'][t[k]]['do'][p]['call'];
//                        //if (way.lib.check(callname) && way.lib.hasOwnProperty(callname)) {
//                        if (way.lib.check(callname)) {
//                          //console.log(`OK!!! ${n}::${t[k]}::${p}`)
//                        } else {
//                          //console.log(`no! ${n}::${t[k]}::${p}`)
//                          inc = false;
//                        }
//                      } else {
//                        //console.log('no! 6')
//                        inc = false;
//                      }
//                      */
//                    } else {
//                      //console.log(`no! 5`)
//                      inc = false;
//                    }
//                  }
//                } else {
//                  //console.log('no! 4')
//                  inc = false;
//                }
//                //console.log(`INC: ${inc}`)
//                if (inc) {
//                  if (t[k] == 'default') {
//                    if (t.length == 1) {
//                      //console.log(`añade: ${t.length} ${n}`)
//                      prockeys.push(`${n}`);
//                    }
//                    var incdefault = true;
//                  }
//                  //console.log(`INCdefault: ${incdefault}`)
//                  if (incdefault) {
//                    if (t.length == 1 && t[k] == 'default') {
//                      //console.log(`NO---${t.length} ${n}::${t[k]}`)
//                    } else {
//                      //console.log(`añade: ${t.length} ${n}::${t[k]}`)
//                      //prockeys.push(`${n}::${t[k]}`);
//                      prockeys.push(`${n}`);
//                    }
//                  }
//                } else {
//                  procfailkeys.push(`${n}`);
//                }
//              } else {
//                //console.log('no! 3')
//                inc = false;
//              }
//            }
//          } else {
//            //console.log('no! 2')
//            inc = false;
//          }
//        } else {
//          //console.log('no! 1')
//          inc = false;
//        }
//      }
//    }
//  }
//  var noprockeys = [];
//  for (key in way.map.config) {
//    if (!prockeys.includes(key) && !procfailkeys.includes(key)) {
//      if (/[0-9]*/.test(key)) {
//        var objKey = key.split(".");
//        for (i in objKey) {
//          if (/^[0-9]*$/.test(objKey[i])) {
//            objKey[i] = `[${objKey[i]}]`
//          }
//        }
//        key = objKey.join(".").replace(/\.\[/,"\[").replace(/\]\./,"\]");
//        //console.log(key);
//      }
//      noprockeys.push(key);
//    }
//  }
//  //console.log(way.config.lib.csneak.app.custom.tpnet.muycomputerprocom.scan["20210108144439"])
//  //way.lib.exit()
//  prockeys = way.lib.removeDuplicateFromArray(prockeys);
//  allkeys = prockeys.concat(noprockeys).sort();
//  return { all:allkeys, proc:prockeys, noproc:noprockeys, procfail:procfailkeys };
}