way.lib.complete = async function (_args) {

  var _args = way.lib.getArgs('complete', _args);

  const { AutoComplete } = require('enquirer');

  // NO ELIMINAR, SOLUCIONA ISSUE QUE ALTERA EL ARRAY ORIGINAL
  var choices = JSON.parse(JSON.stringify(_args.choices));

  if (choices.constructor.name !== "Array") {
    way.lib.exit(`Fallo en argumentos desde "complete". Las opciones deben de ser un array.`)
  } else {
    if (!choices.length) {
      return null;
    }
  }
  var last = choices[choices.length - 1];
  if (last !== undefined && last['name'] === undefined && _args.continue) {
    choices.push('[continue]');
  }
  const prompt = new AutoComplete({
    message: _args.message,
    choices: choices,
    limit: _args.limit,
    initial: 0,
    multiple: _args.multiple
  });
  try {
    let choice = await prompt.run();
    if (choice == "[continue]") {
      choice = false;
    }
    if (choice) {
      if (_args.confirm) {
        var confirm = await way.lib.ask({
          message: `¿Aplicas "${choice}"?`,
          onlyResponse: true
        })
        if (!confirm) {
          choice = await way.lib.complete(_args);
        }
      }
      if (_args.pipe != "") {
        way.lib.var({
          key: _args.pipe,
          value: choice
        });
      }
    }
    return choice;
  } catch(err) {
    way.lib.log({ message:`Abortado!`, type:`warn` });
    process.exit();
  }
}