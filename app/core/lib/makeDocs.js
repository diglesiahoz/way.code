const { config } = require('process');

way.lib.makeDocs = async function (_args) {
  var _args = way.lib.getArgs('makeDocs', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        const fs = require('fs');
        const glob = require("glob");
        const path = require('path');


        // INICIALIZA README's
        var readme = {};

        var sources  = ['core'].concat(way.apps);

        for (source of sources) {
          readme[source] = {};
          if (source == 'core') {
            readme[source]['target'] = `${path.dirname(way.root)}/README.md`;
          } else {
            readme[source]['target'] = `${way.root}/custom/app/${source}/README.md`;
          }
          readme[source]['parent_target'] = `${path.dirname(readme[source]['target'])}`;
          readme[source]['text'] = fs.readFileSync(`${readme[source]['target']}`, 'utf8').split("\n");
          //readme[source]['data'] = [];
          readme[source]['docsstart'] = [];
          readme[source]['docs'] = [];
          readme[source]['docs'].push(`## Docs`);
          // readme[source]['docsend'] = [];
          // readme[source]['docsend'].push('');
          readme[source]['recipes'] = [];
          readme[source]['recipes'].push(`## Recetas`);
          readme[source]['recipes'].push(``);
          var add_line = true;
          var is_end = false;

          readme[source]['text'].forEach( line => {
            var re = new RegExp(`^## Docs`)
            if (re.test(line)) {
              add_line = false;
            }
            if (add_line) {
              readme[source]['docsstart'].push(line)
            }
          });
          if (fs.lstatSync(`${readme[source]['parent_target']}/docs`).isDirectory()) {
            //fs.rmSync(`${readme[source]['parent_target']}/docs/*`, { recursive: false, force: true });
            await glob.sync(`${readme[source]['parent_target']}/docs/**/auto_generated*`, {
              dot: true,
              ignore: [
                '**/node_modules/**',
                '**/.git/**',
                '**/.gitkeep',
              ],
            }).map(path => {
              fs.rmSync(`${path}`, { recursive: false, force: true });
            });
          }
        }

        //way.lib.exit();
        //console.log(readme);
        //way.lib.exit();



        var readmedoc_blocks = {};
        readmedoc_blocks['Perfiles'] = {};
        readmedoc_blocks['Perfiles']['mapkey'] = 'profileKey';
        readmedoc_blocks['Procedimientos'] = {};
        readmedoc_blocks['Procedimientos']['mapkey'] = 'procKey';


        //console.log(way.map)
        //console.log(readmedoc_blocks)




        for (block_title in readmedoc_blocks) {
          var block_conf = readmedoc_blocks[block_title];

          //console.log('======================')
          //console.log(block_title, block_conf )

          var set_title = true;

          for (key of way.map[block_conf.mapkey]) {

            
            var source = key.replace(/^@/,'').split('.')[0];
            if (oldsource != source) {
              set_title = true;
            }
            var oldsource = source;

            var filepath = way.map.config[key];

            //console.log(source, filepath)

            if (typeof readme[source] !== "undefined") {

              if (set_title) {
                readme[source]['docs'].push('');
                readme[source]['docs'].push(`#### ${block_title}`);
                readme[source]['docs'].push('');
                set_title = false;
              }

              var file = `${way.root}/${filepath}`;
              var filedata = fs.readFileSync(`${file}`, 'utf8');
              var filelines = filedata.split("\n");
              var filename = path.basename(file);
              var fileext = filename.split('.')[filename.split('.').length - 1];
              var parentparts = `${filepath}`.split('/');
              parentparts.pop();
              parentparts = parentparts[parentparts.length - 1];
              if (/^@/.test(key)) {
                var filenamewithoutext = '@'+filename.replace(`\.${fileext}`, "");
              } else {
                var filenamewithoutext = filename.replace(`\.${fileext}`, "");
              }
              var targetfilename = `auto_generated--${parentparts}--${filenamewithoutext}.md`;
              var filetarget = `${readme[source]['parent_target']}/docs/${targetfilename}`;
              var filetargetrel = `docs/${targetfilename}`;

              //console.log(`Parse: ${source} -- ${key} -- ${filetarget}`)
              //way.lib.exit()

              var doc_start_mark = "";
              var doc_end_mark = "";
              switch (fileext) {
                case "js":
                  way.lib.exit('No soportado crear docs en ficheros JS')
                  break;
                case "yml":
                  doc_start_mark = `^# DOCS:$`;
                  doc_end_mark = `^# :DOCS$`;
                  doc_remove_pattern = /^# /g;
                  doc_code_pattern = `^#`;

                  recipe_start_mark = `^# RECIPE:.*:$`;
                  recipe_end_mark = `^# :RECIPE$`;
                  recipe_remove_pattern = /^# /g;
                  recipe_code_pattern = `^#`;
                  break;
              }

              //way.lib.exit()
              var data = {};
              data['docs'] = [];
              data['recipes'] = [];
              data['code'] = [];

              data['docs'].push(`### ${filenamewithoutext}`);
              data['docs'].push(``);
              

              var is_mark = false;
              var is_doc = false;
              var is_recipe = false;
              var recipe_counter = 0;
              var recipekey = null;
              filelines.forEach( line => {

                //console.log('---',is_recipe, is_mark, recipekey, line)

                // DOCS
                var line_reg = new RegExp(`${doc_start_mark}`);
                if (line_reg.test(line)) {
                  is_doc = true;
                  is_mark = true;
                }
                var line_reg = new RegExp(`${doc_end_mark}`);
                if (line_reg.test(line)) {
                  is_doc = false;
                  data['docs'].push('');
                }
                
                // RECIPES
                var line_reg = new RegExp(`${recipe_start_mark}`);
                if (line_reg.test(line)) {
                  recipe_counter ++;
                  is_recipe = true;

                  var recipe_title = line.split(':')[1];

                  recipekey = `${filenamewithoutext}--recipe${recipe_counter}`;
                  data['recipes'][recipekey] = {};
                  data['recipes'][recipekey]['title'] = recipe_title;
                  data['recipes'][recipekey]['target'] = `${readme[source]['parent_target']}/docs/auto_generated--${parentparts}--${recipekey}--`+recipe_title.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9]/g,'_').replace(/[\.]/g,'_').toLowerCase()+'.md';
                  data['recipes'][recipekey]['data'] = [];
                  data['recipes'][recipekey]['data'].push(`### ${recipe_title}`);
                  data['recipes'][recipekey]['data'].push(``);
                  
  
                  is_mark = true;
                }
                var line_reg = new RegExp(`${recipe_end_mark}`);
                if (line_reg.test(line)) {
                  is_recipe = false;
                  data['recipes'][recipekey]['data'].push('');
                }

                if ((is_doc || is_recipe) && !is_mark) { 
                  if (is_doc) { 
                    data['docs'].push(line.replace(doc_remove_pattern, ''));
                  } else {
                    data['recipes'][recipekey]['data'].push(line.replace(recipe_remove_pattern, ''));
                    
                  }
                }

                is_mark = false;

                var line_reg = new RegExp(doc_code_pattern);
                if (!line_reg.test(line)) {
                  if (line.trim().length !== 0) {
                    data['code'].push(line);
                  }
                }

                

              });
              

              //console.log(data['docs'])
              //way.lib.log({ message: data, type:'console' })
              //way.lib.exit()


              // Añade código sin comentarios...
              data['docs'].push('```'+fileext);
              for (l of data['code']) {
                data['docs'].push(l);
              }

              data['docs'].push('```');
              if (/^custom\/app\//.test(filepath)) {
                filepath = filepath.replace(`custom/app/${source}/`, '');
                data['docs'].push('[```'+filepath+'```](../'+filepath+')');
              } else {
                data['docs'].push('[```'+filepath+'```](../app/'+filepath+')');
              }
              data['docs'].push(``);

              

              
              // if (filenamewithoutext == 'core.make.app') { console.log(data['docs']); way.lib.exit() }

              //way.lib.exit()
              //console.log(filelines, data['code'], data['docs'], filetarget)

              // if (fs.existsSync(filetarget)){
              //   fs.rmSync(`${filetarget}`, { recursive: false, force: true });
              // }
              
              var skip = false;
              if (!/^@/.test(filenamewithoutext)) {
                if (/^core\./.test(filenamewithoutext)) {
                  var to_check = `${filenamewithoutext}`;
                } else {
                  var to_check = `${source}.${filenamewithoutext}`;
                }
                var config = eval(`way.config.${to_check}`);
                if (typeof config === "undefined") {
                  console.log(`way.config.${to_check}`, config, source)
                  console.log(way.config)
                  way.lib.exit()
                } else {
                  if (typeof config.allowed !== "undefined" && config.allowed === false) {
                    skip = true;
                  }
                }
              }

              if (!skip) {
                fs.writeFileSync(filetarget, `${data['docs'].join('\n')}`);
                readme[source]['docs'].push(`* [${filenamewithoutext}](${filetargetrel})`);
                way.lib.log({ message: `Generate doc: ${path.basename(filetarget)}`, type: `label`});
              }

              //console.log(data['recipes'])

              for (key in data['recipes']) {
                var title = data['recipes'][key]['title'];
                var target = data['recipes'][key]['target'];
                fs.writeFileSync(target, `${data['recipes'][key]['data'].join('\n')}`);
                way.lib.log({ message: `Generate recipe: ${path.basename(target)}`, type: `label`});
                readme[source]['recipes'].push(`* [${title}](docs/${path.basename(target)})`);
              }
                

            } else {
              
              way.lib.log({ message: `Skip doc: ${key}`, type: `label`});
            }

          }

        }
        

        for (source of sources) {
          /*
          if (source == "core") {
            readme[source]['docs'].push(``);
            readme[source]['docs'].push(`## Licencia`);
            readme[source]['docs'].push(`Way Code está disponible bajo la licencia MIT.`);
            readme[source]['docs'].push(`## Créditos`);
            readme[source]['docs'].push(`Creado por [Daniel de la Iglesia](https://github.com/diglesiahoz)`);
          }
          */
          readme[source]['data'] = [];
          readme[source]['data'] = readme[source]['data'].concat(readme[source]['docsstart'], readme[source]['docs'], readme[source]['recipes'], readme[source]['docsend']);
          //console.log(readme[source]['data']);
          //way.lib.exit()
          if (fs.existsSync(readme[source]['target'])){
            fs.rmSync(`${readme[source]['target']}`, { recursive: false, force: true });
          }
          fs.writeFileSync(readme[source]['target'], `${readme[source]['data'].join('\n')}`);
          way.lib.log({ message: `Generate doc: README.md (${source})`, type: `label`})
        }

        //way.lib.log({message: `Done!`, type: `success`});


        resolve({
          args: Object.assign({}, _args),
          attach: {},
          code: 0,
          data: {},
        });
        
      })();
    }, 0);       
  });
}
