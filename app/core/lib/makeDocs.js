const { config } = require('process');

way.lib.makeDocs = async function (_args) {
  var _args = way.lib.getArgs('makeDocs', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        const fs = require("fs-extra");
        const glob = require("glob");
        const path = require('path');
        const yaml = require('js-yaml');
        const matter = require('gray-matter');


        way.lib.log({ message: `MAKE DOCS...`, type: `label`});

        //var sources  = ['core','custom'].concat(way.apps);
        var sources  = ['core','custom'];
        var sourcesConfig  = {};
        
        let autoGenTypes = [ "profiles", "procedures" ];
        let autoGenPaths = [];


        for (const source of sources) {

          sourcesConfig[source] = {};

          docsOriginRelPath = `${path.dirname(way.root)}/docs/md/${source}`;
          if (source == 'core') {
            sourcesConfig[source]['scanPaths'] = [docsOriginRelPath];
          } else {
            sourcesConfig[source]['scanPaths'] = [];
          }
          sourcesConfig[source]['targetPath'] = docsOriginRelPath;
          sourcesConfig[source]['links'] = {};
          sourcesConfig[source]['recipes'] = [];
          sourcesConfig[source]['links']['recipes'] = [];

          autoGenPaths.push(sourcesConfig[source]['targetPath']);
          
          
          for (const type of autoGenTypes) {
            sourcesConfig[source]['links'][type] = [];
          }

          if (source == 'custom') {
            sourcesConfig[source]['apps'] = {};
            if (way.apps.length > 0) {
              for (const app of way.apps) {
                const originPath = `${path.dirname(way.root)}/app/custom/app/${app}/docs`;
                sourcesConfig[source]['apps'][app] = {};
                sourcesConfig[source]['apps'][app]['scanPaths'] = [originPath];
                sourcesConfig[source]['apps'][app]['targetPath'] = originPath;
                sourcesConfig[source]['apps'][app]['links'] = {};
                sourcesConfig[source]['apps'][app]['recipes'] = [];

                autoGenPaths.push(sourcesConfig[source]['apps'][app]['targetPath']);
                
                for (const type of autoGenTypes) {
                  sourcesConfig[source]['apps'][app]['links'][type] = [];
                }
                sourcesConfig[source]['apps'][app]['links']['recipes'] = [];
              }
            }
          } 

        }


        // -- Limpia docs auto-generados -- //
        for (const autoGenPath of autoGenPaths) {
          for (const autoGenType of autoGenTypes) {
            let p = `${autoGenPath}/${autoGenType}`;
            try {
              const files = fs.readdirSync(p, { withFileTypes: true });
              for (const file of files) {
                const fullFilePath = path.join(p, file.name);
                if (file.isFile() && file.name.startsWith('autogen__')) {
                  fs.unlinkSync(fullFilePath);
                }
              }
              way.lib.log({ message: `Cleanup auto-gen docs from: ${p}`, type: `label`});
            } catch (e) { 
              // way.lib.log({ message: `Skip cleanup auto-gen docs from: ${p}`, type: `label`});
            }
          }
        }
        for (const app_name of way.apps) {
          try {
            const files = fs.readdirSync(`${sourcesConfig['custom']['targetPath']}/apps`, { withFileTypes: true });
            for (const file of files) {
              if (file.isDirectory()) {
                const fullFilePath = path.join(file.parentPath, file.name);
                fs.removeSync(`${fullFilePath}`);
                way.lib.log({ message: `Cleanup app docs from: ${fullFilePath}`, type: `label`});
              }
            }
          } catch (e) {}
        }
        try {
          fs.removeSync(`${sourcesConfig['custom']['targetPath']}/recipes`);
          way.lib.log({ message: `Cleanup custom recipes: ${sourcesConfig['custom']['targetPath']}/recipes`, type: `label`});
        } catch (e) {}
        /* -- Fin limpieza -- */



        // -- Añade ruta de recetas custom --//
        sourcesConfig['custom']['scanPaths'].push(`${way.root}/custom/docs`);




        //way.lib.exit()
        //console.log(JSON.stringify(sourcesConfig, null, 2));
        //way.lib.exit()



        // -- Obtiene recetas y establece links de recetas -- //
        function normalizePaths(pathValue) {
          if (Array.isArray(pathValue)) return pathValue;
          if (typeof pathValue === 'string') return [pathValue];
          return [];
        }        
        function getLink(recipesPath, fileName) {
          const fullFilePath = path.join(recipesPath, fileName);
          const fileContent = fs.readFileSync(fullFilePath, 'utf8');
        
          const { data } = matter(fileContent);
        
          const title =
            way.lib.check(data?.title)
              ? data.title
              : path.basename(fileName, path.extname(fileName));
        
          return `- [${title}](./${fileName})`;
        }
        function getRecipeFiles(recipesPath) {
          if (!fs.existsSync(recipesPath)) return [];
        
          return fs
            .readdirSync(recipesPath, { withFileTypes: true })
            .filter(
              d =>
                d.isFile() &&
                d.name.endsWith('.md') &&
                d.name !== 'index.md'
            )
            .map(d => d.name);
        }
        function processRecipes(node) {
          if (!node.scanPaths || !node.recipes || !node.links?.recipes) return;
        
          const paths = normalizePaths(node.scanPaths);
        
          if (!paths.length) return;
        
          for (const basePath of paths) {
            const recipesPath = `${basePath}/recipes`;
            const files = getRecipeFiles(recipesPath);
        
            if (!files.length) {
              way.lib.log({
                message: `Not found recipes from: ${recipesPath}`,
                type: 'label'
              });
              continue;
            }
        
            for (const fileName of files) {
              node.recipes.push(fileName);
              node.links.recipes.push(
                getLink(recipesPath, fileName)
              );
            }
          }
        }        
        function walkSources(node) {
          if (typeof node !== 'object' || node === null) return;
        
          processRecipes(node);
        
          Object.values(node).forEach(child => {
            if (typeof child === 'object') {
              walkSources(child);
            }
          });
        }
        walkSources(sourcesConfig);

        


        //console.log(JSON.stringify(sourcesConfig, null, 2));
        //way.lib.exit()




        // -- Auto-gen -- //
        way.lib.log({ message: `Auto-gen docs...`, type: `label`});
        let autoGenString = `autogen__`;
        let prefix = autoGenString;
        var file_tree = way.map.config;
        for (const fileKey in file_tree) {
          if (file_tree.hasOwnProperty(fileKey)) {

            var fileRelPath = file_tree[fileKey]; 
            
            var filePathSource = fileRelPath.split('/')[0];
            
            var docsRoot = sourcesConfig[filePathSource]['targetPath'];
            if (fileRelPath.startsWith('custom/app')) {
              var app_name = fileRelPath.replace(/^custom\/app\//,'').split('/')[0];
              docsRoot = sourcesConfig[filePathSource]['apps'][app_name]['targetPath'];
            }

            var filePath = `${path.dirname(way.root)}/app/${fileRelPath}`;

            if ((/.*\/config\/proc\/.*/.test(fileRelPath) || /.*\/config\/@\/.*/.test(fileRelPath))) {

              if (/.*\/config\/proc\/.*/.test(fileRelPath)) {
                var sourceDirKey = `procedures`;
              }
              if (/.*\/config\/@\/.*/.test(fileRelPath)) {
                var sourceDirKey = `profiles`;
              }
              const targetDirPath = `${docsRoot}/${sourceDirKey}`;

              // Añade prefijo para profiles "custom" que deben de ser ignorados en repositorio
              if (/.*\/@\//.test(fileRelPath)) {
                if (/^custom\/config\/@/.test(fileRelPath)) {
                  prefix = `${prefix}custom__@`;
                } else {
                  prefix = `${prefix}@`;
                }
              }

              const fileName = prefix + fileKey
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '_')
                  .replace(/^_+|_+$/g, '') + '.md';
              const targetFilePath = `${targetDirPath}/${fileName}`;


              // way.lib.log({ message: `fileKey        ===> |${fileKey}|`, type: `label`});
              // way.lib.log({ message: `filePathSource ===> |${filePathSource}|`, type: `label`});
              // way.lib.log({ message: `fileRelPath    ===> |${fileRelPath}|`, type: `label`});
              // way.lib.log({ message: `docsRoot       ===> |${docsRoot}|`, type: `label`});
              // way.lib.log({ message: `targetDirPath  ===> |${targetDirPath}|`, type: `label`});
              // way.lib.log({ message: `targetFilePath ===> |${targetFilePath}|`, type: `label`});
              

              // Leemos el YAML como texto para capturar los comentarios
              const yamlContent = fs.readFileSync(filePath, 'utf8');

              // Parsear a objeto JS (automáticamente ignora comentarios)
              const data = yaml.load(yamlContent);

              // Convertir a YAML limpio (sin comentarios)
              const cleanYamlText = yaml.dump(data);

              // Establece origen
              const infoSource = `\n📂 \`app/${fileRelPath}\`\n`;

              // Expresión regular para capturar bloques DOCS
              const docsRegex = /# DOCS:(.+?)\n([\s\S]+?)# :DOCS/g;
              const docsBlocks = [];

              let match;
              while ((match = docsRegex.exec(yamlContent)) !== null) {
                const sectionTitle = match[1].trim().replace(/:$/, '');
                const sectionBody = match[2]
                  .split('\n')
                  .map(line => line.replace(/^# ?/, ''))
                  .join('\n')
                  .trim();
              
                docsBlocks.push({ sectionTitle, sectionBody });
              }

              let docsText = '';

              const groupedBlocks = {};
              
              for (const block of docsBlocks) {
                const parts = block.sectionTitle.split(':');
                const type = parts[0].toLowerCase().trim();
                const subtitle = parts.slice(1).join(':').trim();
                if (!groupedBlocks[type]) groupedBlocks[type] = [];
                groupedBlocks[type].push({ body: block.sectionBody, subtitle });
              }
              
              if (groupedBlocks['description']) {
                const bodies = groupedBlocks['description'];
                const combined = bodies.map(b => b.body.replace(/\n/g, '\n> ')).join('\n>\n> ');
                docsText += `### Descripción\n\n> ${combined}\n\n`;
                delete groupedBlocks['description'];
              }
              
              for (const [type, blocks] of Object.entries(groupedBlocks)) {
                if (type === 'example') {
                  docsText += `### Ejemplos\n\n`;
                  for (const b of blocks) {
                    docsText += '```\n' + b.body + '\n```\n\n';
                  }
                } 
                else if (['tip','note','warning','danger'].includes(type)) {
                  for (const b of blocks) {
                    const sub = b.subtitle ? b.subtitle : type.charAt(0).toUpperCase() + type.slice(1);
                    docsText += `:::${type} ${sub}\n${b.body}\n:::\n\n`;
                  }
                } 
                else {
                  for (const b of blocks) {
                    const title = b.subtitle ? b.subtitle : type;
                    docsText += `### ${title}\n\n${b.body}\n\n`;
                  }
                }
              }


              fs.writeFileSync(targetFilePath, `# ${fileKey}\n${infoSource}\n${docsText}\n### Código\n\`\`\`yml\n${cleanYamlText.trim()}\n\`\`\``);
              way.lib.log({ message: `Created doc: ${targetFilePath}`, type: `label`});
              
              // -- Excluye enlaces a perfiles personalizados --//
              if (!/^custom\/config\/@/.test(fileRelPath)) {
                let link = `- [${fileKey}](./${fileName})`;

                if (/^custom\/app/.test(fileRelPath)) {
                  var app_name = fileKey.split(".")[0].replace(/^@/, '');
                  sourcesConfig[filePathSource]['apps'][app_name]['links'][sourceDirKey].push(link);
                } else {
                  sourcesConfig[filePathSource]['links'][sourceDirKey].push(link);
                }
                
              }

              prefix = autoGenString;

              // way.lib.log({ message: `============`, type: `label`});

            }
          }
        }


        //console.log(JSON.stringify(sourcesConfig, null, 2));


        // -- Establece enlaces -- //
        function processLinks(node) {
          // 1. Si tiene links, los procesamos
          if (node.links && node.scanPaths) {
            Object.keys(node.links).forEach(type => {
              const links = node.links[type];
              if (!Array.isArray(links) || links.length === 0) return;
        
              const targetFilePath = `${node.scanPaths}/${type}/index.md`;
        
              let indexContent = fs.readFileSync(targetFilePath, 'utf8');
        
              const startMarker = '<!-- AUTOGEN:START -->';
              const endMarker = '<!-- AUTOGEN:END -->';
              const regex = new RegExp(
                `${startMarker}[\\s\\S]*?${endMarker}`
              );
        
              indexContent = indexContent.replace(
                regex,
                `${startMarker}\n\n${links.join('\n')}\n\n${endMarker}`
              );
        
              fs.writeFileSync(targetFilePath, indexContent);
        
              way.lib.log({
                message: `Links setted into "${targetFilePath}"`,
                type: 'label'
              });
            });
          }
          // 2. Recorremos hijos (recursivo)
          Object.values(node).forEach(value => {
            if (typeof value === 'object' && value !== null) {
              processLinks(value);
            }
          });
        }
        processLinks(sourcesConfig);


        // -- Sincroniza apps --//
        for (const source of sources) {
          if (way.lib.check(sourcesConfig[source]['apps'])) {
            for (const app_name in sourcesConfig[source]['apps']) {
              const originPath = sourcesConfig[source]['apps'][app_name]['targetPath'];
              const targetPath = `${sourcesConfig[source]['targetPath']}/apps/${app_name}`;
              // -- Sincroniza docs de aplicaciones personalizadas -- //
              fs.copySync(
                originPath,
                targetPath,
                {
                  overwrite: true,
                  filter: (src) => {
                    const name = path.basename(src);
                    return !name.startsWith('.');
                  }
                }
              );
              way.lib.log({ message: `Sync "${app_name}" app docs from "${originPath}" to "${targetPath}"`, type: `label`});
              // -- Elimina secciones sin docs en aplicaciones custom --//
              var toCheck = autoGenTypes;
              toCheck.push('recipes');
              var checked = [];
              var sectionsWithDocs = [];
              for (const type of toCheck) {
                let p = `${targetPath}/${type}`;
                if (!checked.includes(p)) {
                  const mdFiles = fs
                                  .readdirSync(p, { withFileTypes: true })
                                  .filter(f => f.isFile() && f.name.toLowerCase().endsWith('.md') && f.name.toLowerCase() !== 'index.md')
                                  .map(f => f.name);
                  if (mdFiles && !mdFiles.length) {
                    fs.removeSync(`${p}`);
                    way.lib.log({ message: `Removed empty directory from: ${p}`, type: `label`});
                  } else {
                    sectionsWithDocs.push(type)
                  }
                  checked.push(p);
                }
              }
              // -- Establece enlaces en landing app --//
              var appLinks = [];
              for (section of sectionsWithDocs) {
                switch (section) {
                  case 'procedures':
                    link = `- [Procedimientos](./${section})`;
                    break;
                  case 'profiles':
                    link = `- [Perfiles](./${section})`;
                    break;
                  case 'recipes':
                    link = `- [Recetas](./${section})`;
                    break;
                  default:
                    way.lib.exit(`Not found`);
                }
                appLinks.push(link);
              }
              const targetFilePath = `${originPath}/index.md`;
              let indexContent = fs.readFileSync(targetFilePath, 'utf8');
              const startMarker = '<!-- AUTOGEN:START -->';
              const endMarker = '<!-- AUTOGEN:END -->';
              const regex = new RegExp(
                `${startMarker}[\\s\\S]*?${endMarker}`
              );
              indexContent = indexContent.replace(
                regex,
                `${startMarker}\n\n${appLinks.join('\n')}\n\n${endMarker}`
              );
              fs.writeFileSync(targetFilePath, indexContent);
              way.lib.log({
                message: `Links setted into "${targetFilePath}"`,
                type: 'label'
              });
              // -- Sincroniza docs de aplicaciones personalizadas -- //
              fs.copySync(
                `${originPath}/index.md`,
                `${targetPath}/index.md`,
                {
                  overwrite: true,
                  filter: (src) => {
                    const name = path.basename(src);
                    return !name.startsWith('.');
                  }
                }
              );
              way.lib.log({ message: `Sync "${app_name}" app docs from "${originPath}/index.md" to "${targetPath}/index.md"`, type: `label`});
            }
          }
        }

        // -- Sincroniza recetas custom --//
        for (scanPath of sourcesConfig['custom']['scanPaths']) {
          const originPath = `${scanPath}/recipes`;
          const targetPath = `${sourcesConfig['custom']['targetPath']}/recipes`;
          if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath);
          }
          fs.copySync(
            originPath,
            targetPath,
            {
              overwrite: true,
              filter: (src) => {
                const name = path.basename(src);
                return !name.startsWith('.');
              }
            }
          );
          way.lib.log({ message: `Sync custom recipes from "${originPath}" to "${targetPath}"`, type: `label`});
        }
        //console.log(sourcesConfig['custom']['targetPath'])


        // -- Resuelve -- //
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
