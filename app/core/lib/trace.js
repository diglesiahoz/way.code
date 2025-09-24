way.lib.trace = function (_args) {
  var _args = way.lib.getArgs('trace', _args);
  /*
  // Pinta colores disponibles
  for (let i = 0; i <= 255; i++) { console.log(`\x1b[38;5;${i}mColor ${i}\x1b[0m`); }; //way.lib.exit();
  */

  //console.log(_args);

  let out = null;
  let output = "";
  element_counter = 1;
  _args.forEach(element => {

    //console.log(element);

    if (element.out == 1) {
      out = element.out;
    }

    bold = (element.bold == true) ? `1;` : "" ;
    dim = (element.dim == true) ? `2;` : "" ;
    text_color = (element.text_color != null) ? `38;5;${element.text_color}` : "" ;
    bg_color = (element.bg_color != null) ? `;48;5;${element.bg_color}` : "" ;
    
    output += `\x1b[${bold}${dim}${text_color}${bg_color}m${element.data}\x1b[0m`;

    element_counter++;
  });

  if (out) {
    console.log(output);
  } else {
    return output;
  }

}