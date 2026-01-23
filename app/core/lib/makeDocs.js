const { config } = require('process');

way.lib.makeDocs = async function (_args) {
  var _args = way.lib.getArgs('makeDocs', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {

        const fs = require('fs');
        const glob = require("glob");
        const path = require('path');
        const yaml = require('js-yaml');
        const matter = require('gray-matter');

        // var sources  = ['core'].concat(way.apps);

        var docsRoot = `${path.dirname(way.root)}/docs/md`;
        // console.log(`Docs root: ${docs_root}`)

        // const apiDir = `${docsRoot}/api`;
        // fs.rmSync(`${apiDir}`, { recursive: true, force: true });

        let autoGenTypes = [ "perfiles", "procedimientos" ];

        // -- Elimina ficheros para generarlos de nuevo -- //
        for (const type of autoGenTypes) {
          let dirToRemoveFiles = `${docsRoot}/${type}`;
          const files = fs.readdirSync(dirToRemoveFiles, { withFileTypes: true });
          for (const file of files) {
            const fullFilePath = path.join(dirToRemoveFiles, file.name);
            if (file.isFile() && file.name.startsWith('autogen__')) {
              fs.unlinkSync(fullFilePath);
              // console.log('🗑️  Deleted:', fullFilePath);
            }
          }
        }

        way.lib.log({ message: `✅ Auto-gen docs cleanup finished`, type: `label`});

        //way.lib.exit()

        let autoGenString = `autogen__`;
        let prefix = autoGenString;

        let docsLinks = {};

        // console.log(way.map.config)

        var file_tree = way.map.config;
        
        for (const fileKey in file_tree) {
          if (file_tree.hasOwnProperty(fileKey)) { // buena práctica
            
            var fileRelPath = file_tree[fileKey]; 
            var filePath = `${path.dirname(way.root)}/app/${fileRelPath}`;

            if (
              // /^core.init/.test(fileKey) && 
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
              const infoSource = `\n📂 \`${fileRelPath}\`\n`;

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

              // Agrupamos los bloques por título, soportando subtítulo opcional (tipo:Subtitulo)
              const groupedBlocks = {};
              
              for (const block of docsBlocks) {
                // Dividimos título en tipo y subtítulo opcional
                const parts = block.sectionTitle.split(':');
                const type = parts[0].toLowerCase().trim();           // e.g., "danger"
                const subtitle = parts.slice(1).join(':').trim();     // e.g., "Muy importante"
              
                if (!groupedBlocks[type]) groupedBlocks[type] = [];
              
                // Guardamos tanto el body como el subtítulo
                groupedBlocks[type].push({ body: block.sectionBody, subtitle });
              }
              
              // ---------- Primero procesamos "description" ----------
              if (groupedBlocks['description']) {
                const bodies = groupedBlocks['description'];
                // Un solo blockquote con todos los cuerpos concatenados
                const combined = bodies.map(b => b.body.replace(/\n/g, '\n> ')).join('\n>\n> ');
                docsText += `### Descripción\n\n> ${combined}\n\n`;
              
                delete groupedBlocks['description'];
              }
              
              // ---------- Luego procesamos el resto de títulos ----------
              for (const [type, blocks] of Object.entries(groupedBlocks)) {
                if (type === 'example') {
                  // Code block para cada ejemplo
                  docsText += `### Ejemplos\n\n`;
                  for (const b of blocks) {
                    docsText += '```\n' + b.body + '\n```\n\n';
                  }
                } 
                else if (['tip','note','warning','danger'].includes(type)) {
                  // Admonition con subtítulo opcional
                  for (const b of blocks) {
                    const sub = b.subtitle ? b.subtitle : type.charAt(0).toUpperCase() + type.slice(1);
                    docsText += `:::${type} ${sub}\n${b.body}\n:::\n\n`;
                  }
                } 
                else {
                  // Normal para otros títulos
                  for (const b of blocks) {
                    const title = b.subtitle ? b.subtitle : type;
                    docsText += `### ${title}\n\n${b.body}\n\n`;
                  }
                }
              }
              
              // console.log(docsText);
              
              // console.log(fileRelPath)

              // console.log(path.dirname(fileRelPath).replace(/\//g, '.'))

              if (/.*\/config\/proc\/.*/.test(fileRelPath)) {
                var sourceDirKey = `procedimientos`;
              }
              if (/.*\/config\/@\/.*/.test(fileRelPath)) {
                var sourceDirKey = `perfiles`;
              }
              if (!way.lib.check(docsLinks[sourceDirKey])) {
                docsLinks[sourceDirKey] = [];
              }
              //console.log(sourceDirKey)
              
              const dirPath = `${docsRoot}/${sourceDirKey}`;
              fs.mkdirSync(`${dirPath}`, { recursive: true });


              // Añade prefijo para perfiles "custom" que deben de ser ignorados en repositorio

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
              //console.log(targetFilePath)
              fs.writeFileSync(targetFilePath, `# ${fileKey}\n${infoSource}\n${docsText}\n### Código\n\`\`\`yml\n${cleanYamlText.trim()}\n\`\`\``);
              way.lib.log({ message: `Created doc file: ${targetFilePath} (from: ${fileKey} ==> ${fileRelPath})`, type: `label`});

              let link = `- [${fileKey}](${targetFilePath.replace(docsRoot, "")})`;
              docsLinks[sourceDirKey].push(link);

              prefix = autoGenString;

            }
          }
        }

        // -- Establece menú en index.md de directorios autogestionados -- //
        for (const type of autoGenTypes) {
          let targetFilePath = `${docsRoot}/${type}/index.md`;
          let indexContent = fs.readFileSync(targetFilePath, 'utf8');
          const startMarker = '<!-- AUTOGEN:START -->';
          const endMarker = '<!-- AUTOGEN:END -->';
          const regex = new RegExp(
            `${startMarker}[\\s\\S]*?${endMarker}`
          );
          indexContent = indexContent.replace(
            regex,
            `${startMarker}\n\n${docsLinks[type].join('\n')}\n\n${endMarker}`
          );
          fs.writeFileSync(targetFilePath, indexContent);
        }

        // -- Establece menú en index.md de recetas -- //
        docsLinks['recetas'] = [];
        let dirToGetFiles = `${docsRoot}/recetas`;
        const files = fs.readdirSync(dirToGetFiles, { withFileTypes: true });
        for (const file of files) {
          const fullFilePath = path.join(dirToGetFiles, file.name);
          if (file.isFile() && !file.name.startsWith('index') && !file.name.startsWith('_')) {
            //fs.unlinkSync(fullFilePath);
            //console.log('File:', fullFilePath);
            const baseName = path.basename(file.name, path.extname(file.name));
            const fileContent = fs.readFileSync(fullFilePath, 'utf8');
            const { data } = matter(fileContent);
            let docTitle = data.title;
            if (!way.lib.check(docTitle)) {
              docTitle = baseName
            }

            const relativePath = fullFilePath
              .replace(docsRoot, '')       // ruta relativa
              .replace(/\\/g, '/')         // Windows -> /
              .replace(/\.md$/, '');       // quitar extensión .md

            const link = `- [${docTitle}](${relativePath})`;
            docsLinks['recetas'].push(link);
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
          `${startMarker}\n\n${docsLinks['recetas'].join('\n')}\n\n${endMarker}`
        );
        fs.writeFileSync(targetFilePath, indexContent);

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
