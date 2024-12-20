way.lib.getWrapHtmlFromString = function (_args){

  var _args = way.lib.getArgs('getWrapHtmlFromString', _args);

  _args.string = _args.string.toString();

  function getHtmlStyle(code) {
    var ostyle = "";
    switch (code) {
      case "1":
        ostyle = "font-weight:bold;";
        break;
      case "2":
        ostyle = "opacity:0.6;";
        break;
      case "3":
        ostyle = "font-style:italic;";
        break;
      case "4":
        ostyle = "text-decoration:underline;";
        break;
      case "9":
        ostyle = "text-decoration:line-through;";
        break;
      case "30":
      //case "90":
        ostyle = "color:black;";
        break;
      case "40":
      case "100":
        ostyle = "background:black;padding:2px;";
        break;
      case "31":
        ostyle = "color:#ba0000;";
        break;
      case "91":
        ostyle = "color:red;";
        break;
      case "41":
        ostyle = "background:#ba0000;padding:2px;";
        break;
      case "101":
        ostyle = "background:red;padding:2px;";
        break;
      case "32":
        ostyle = "color:#009700;";
        break;
      case "92":
        ostyle = "color:#00ca00;";
        break;
      case "42":
        ostyle = "background:#009700;padding:2px;";
        break;
      case "102":
        ostyle = "background:#00ca00;padding:2px;";
        break;
      case "33":
        ostyle = "color:#ca8e03;";
        break;
      case "93":
        ostyle = "color:#ffc900;";
        break;
      case "43":
        ostyle = "background:#ca8e03;padding:2px;";
        break;
      case "103":
        ostyle = "background:#ffc900;padding:2px;";
        break;
      case "34":
        ostyle = "color:#2073af;";
        break;
      case "94":
        ostyle = "color:#0094ff;";
        break;
      case "44":
        ostyle = "background:#2073af;padding:2px;";
        break;
      case "104":
        ostyle = "background:#0094ff;padding:2px;";
        break;
      case "35":
        ostyle = "color:#910d91;";
        break;
      case "95":
        ostyle = "color:magenta;";
        break;
      case "45":
        ostyle = "background:#910d91;padding:2px;";
        break;
      case "105":
        ostyle = "background:magenta;padding:2px;";
        break;
      case "36":
        ostyle = "color:#00b4b4;";
        break;
      case "96":
        ostyle = "color:cyan;";
        break;
      case "46":
        ostyle = "background:#00b4b4;padding:2px;";
        break;
      case "106":
        ostyle = "background:cyan;padding:2px;";
        break;
      case "37":
      case "97":
        //ostyle = "color:white;";
        ostyle = "color:none;";
        break;
      case "47":
      case "107":
        //ostyle = "background:white;padding:2px;";
        ostyle = "background:none;padding:2px;";
        break;
      //case "0":
      //case "22":
      //case "23":
      //case "24":
      //case "27":
      //case "28":
      //case "29":
      //case "39":
      //  //ostyle = "color:none;";
      //  ostyle = "\">";
      //  break;
      //case "49":
      //  ostyle = "background:none;";
      //  break;
      case "90":
        ostyle = "color:#9f9f9f;";
        break;
    }
    return ostyle;
  }
  let re = new RegExp(/[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/, 'g');
  ansicodes = _args.string.match(re);
  _args.string = _args.string.replace(/&/g,"&amp;");
  _args.string = _args.string.replace(/</g,"&lt;");
  _args.string = _args.string.replace(/>/g,"&gt;");
  _args.string = _args.string.replace(/"/g,"&quot;");
  _args.string = _args.string.replace(/\n/g,"</br>");
  if (way.lib.check(ansicodes) && ansicodes.length > 0) {
    var sOutput = [];
    vv = _args.string.split("</br>")
    for (l of vv) {
      sArr = l.split(/\x1B\[(0|22|23|24|27|28|29|39|49)m/);
      if (sArr.length > 1) {
        for (a of sArr) {
          var codes = a.match(new RegExp(/[0-99]*m/,"g"));
          if (codes !== null) {
            var wrap = "<span style=\"";
            for (c in codes) {
              var cColor = codes[c].replace("m","");
              if (cColor != "") {
                wrap += getHtmlStyle(cColor);
              }
            }
            wrap += `">${a.replace(re,"")}</span>`;
            sOutput.push(wrap);
          }
        }
      } else {
        sOutput.push(`<span>${l}</span>`);
      }
      sOutput.push(`</br>`);
    }
    return sOutput.join("");
  } else {
    return _args.string;
  }
}