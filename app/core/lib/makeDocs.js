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

        var sources  = ['core'].concat(way.apps);
        var sourcesConfig  = {};
        
        let autoGenTypes = [ "profiles", "procedures" ];

        for (const source of sources) {

          if (source == 'core') {
            docsOriginRelPath = `${path.dirname(way.root)}/docs/md`;
          } else {
            docsOriginRelPath = `${path.dirname(way.root)}/app/custom/app/${source}/docs`;
            docsTargetRelPath = `${path.dirname(way.root)}/docs/md/apps/${source}`;
            fs.removeSync(`${path.dirname(way.root)}/docs/md/apps/${source}`);
            way.lib.log({ message: `Removed: ${docsTargetRelPath}`, type: `label`});
          }

          sourcesConfig[source] = {};
          sourcesConfig[source]['path'] = docsOriginRelPath;
          sourcesConfig[source]['links'] = {};
          sourcesConfig[source]['links']['recipes'] = [];

          fs.mkdirSync(`${docsOriginRelPath}`, { recursive: true });

          // -- Elimina ficheros para generarlos de nuevo -- //
          for (const type of autoGenTypes) {

            sourcesConfig[source]['links'][type] = [];

            let dirToRemoveFiles = `${sourcesConfig[source]['path']}/${type}`;
            try {
              const files = fs.readdirSync(dirToRemoveFiles, { withFileTypes: true });
              for (const file of files) {
                const fullFilePath = path.join(dirToRemoveFiles, file.name);
                if (file.isFile() && file.name.startsWith('autogen__')) {
                  fs.unlinkSync(fullFilePath);
                }
              }
              way.lib.log({ message: `Auto-gen docs cleanup finished from: ${dirToRemoveFiles}`, type: `label`});
            } catch (e) { }
          }

        }
        //console.log(sourcesConfig)

        let autoGenString = `autogen__`;
        let prefix = autoGenString;

        var file_tree = way.map.config;

        for (const fileKey in file_tree) {
          if (file_tree.hasOwnProperty(fileKey)) { // buena práctica

            var fileRelPath = file_tree[fileKey]; 

            if (fileRelPath.startsWith('custom/app/')) {
              var filePathSource = fileRelPath.replace(/^custom\/app\//,'').split('/')[0];
              if (!way.lib.check(sourcesConfig[filePathSource])) {
                way.lib.exit(`Not found doc source`);
              }
            } else {
              var filePathSource = 'core';
            }
            var docsRoot = sourcesConfig[filePathSource]['path'];

            var filePath = `${path.dirname(way.root)}/app/${fileRelPath}`;

            if (
              /.*\/config\/proc\/.*/.test(fileRelPath) || 
              /.*\/config\/@\/.*/.test(fileRelPath)
              ) {

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

              if (/.*\/config\/proc\/.*/.test(fileRelPath)) {
                var sourceDirKey = `procedures`;
              }
              if (/.*\/config\/@\/.*/.test(fileRelPath)) {
                var sourceDirKey = `profiles`;
              }

              const dirPath = `${docsRoot}/${sourceDirKey}`;
              fs.mkdirSync(`${dirPath}`, { recursive: true });

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
              const targetFilePath = `${dirPath}/${fileName}`;

              fs.writeFileSync(targetFilePath, `# ${fileKey}\n${infoSource}\n${docsText}\n### Código\n\`\`\`yml\n${cleanYamlText.trim()}\n\`\`\``);
              way.lib.log({ message: `Created doc file: ${targetFilePath} (from: ${fileKey} ==> ${fileRelPath})`, type: `label`});
              
              // -- Excluye enlaces a perfiles personalizados --//
              if (!/^custom\/config\/@/.test(fileRelPath)) {
                let link = `- [${fileKey}](./${fileName})`;
                sourcesConfig[filePathSource]['links'][sourceDirKey].push(link)
              }

              prefix = autoGenString;
            }
          }
        }



        for (const source of sources) {
          if (source != 'core') {
            docsOriginRelPath = `${path.dirname(way.root)}/app/custom/app/${source}/docs`;
            docsTargetRelPath = `${path.dirname(way.root)}/docs/md/apps/${source}`;
            // Copia documentación de aplicación custom
            fs.copySync(
              docsOriginRelPath,
              docsTargetRelPath,
              { overwrite: true }
            );
            way.lib.log({ message: `Sync "${source}" app docs from "${docsOriginRelPath}" to "${docsTargetRelPath}"`, type: `label`});
          }
        }


        Object.keys(sourcesConfig).forEach(source => {
          // -- Enlaces a procedimientos y perfiles -- //
          Object.keys(sourcesConfig[source]['links']).forEach(type => {
            let targetFilePath = `${sourcesConfig[source]['path']}/${type}/index.md`;
            if (sourcesConfig[source]['links'][type].length > 0) {
              let indexContent = fs.readFileSync(targetFilePath, 'utf8');
              const startMarker = '<!-- AUTOGEN:START -->';
              const endMarker = '<!-- AUTOGEN:END -->';
              const regex = new RegExp(
                `${startMarker}[\\s\\S]*?${endMarker}`
              );
              indexContent = indexContent.replace(
                regex,
                `${startMarker}\n\n${sourcesConfig[source]['links'][type].join('\n')}\n\n${endMarker}`
              );
              fs.writeFileSync(targetFilePath, indexContent);
              way.lib.log({ message: `Links setted into "${targetFilePath}"`, type: `label`});
            }
          });
          // -- Enlaces a recetas -- //
          let dirToGetFiles = `${sourcesConfig[source]['path']}/recipes/`;
          const files = fs.readdirSync(dirToGetFiles, { withFileTypes: true });
          for (const file of files) {
            const fullFilePath = path.join(dirToGetFiles, file.name);
            if (file.isFile() && !file.name.startsWith('index') && !file.name.startsWith('_')) {
              const baseName = path.basename(file.name, path.extname(file.name));
              const fileContent = fs.readFileSync(fullFilePath, 'utf8');
              const { data } = matter(fileContent);
              let docTitle = data.title;
              if (!way.lib.check(docTitle)) {
                docTitle = baseName
              }
              const relativePath = fullFilePath
                .replace(docsRoot, '')
                .replace(/\\/g, '/');
              const link = `- [${docTitle}](./${file.name})`;
              sourcesConfig[source]['links']['recipes'].push(link);
            }
          }
          let targetFilePath = `${dirToGetFiles}/index.md`;
          let indexContent = fs.readFileSync(targetFilePath, 'utf8');
          const startMarker = '<!-- AUTOGEN:START -->';
          const endMarker = '<!-- AUTOGEN:END -->';
          const regex = new RegExp(
            `${startMarker}[\\s\\S]*?${endMarker}`
          );
          indexContent = indexContent.replace(
            regex,
            `${startMarker}\n\n${sourcesConfig[source]['links']['recipes'].join('\n')}\n\n${endMarker}`
          );
          fs.writeFileSync(targetFilePath, indexContent);
        });


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
