way.lib.watch = async function (_args) {
  var _args = way.lib.getArgs('watch', _args);

  const path = require('path');
  const fs = require('fs');

  const projectRoot = path.dirname(way.root);
  const envFile = path.join(projectRoot, 'env', '.env');

  way.lib.log({
    message: `watch: envFile = ${envFile}`,
    type: 'label',
  });

  function getEnvDev() {
    if (way.lib.check(way.process.env.APPSETTING_DEV)) {
      return String(way.process.env.APPSETTING_DEV).toLowerCase() === 'true';
    }
    if (!fs.existsSync(envFile)) return false;
    const content = fs.readFileSync(envFile, 'utf8');
    const m = content.match(/APPSETTING_DEV\s*=\s*(true|false)/i);
    return m ? m[1].toLowerCase() === 'true' : false;
  }

  const envDev = getEnvDev();
  way.lib.log({
    message: `watch: APPSETTING_DEV = ${envDev}`,
    type: 'label',
  });

  if (!envDev) {
    way.lib.log({
      message: 'APPSETTING_DEV no está en true en env/.env. Salida.',
      type: 'warn',
    });
    way.lib.exit('watch solo se ejecuta en modo desarrollo (APPSETTING_DEV=true).');
  }

  const chokidar = require('chokidar');

  // Vigilar directorios (chokidar con usePolling suele funcionar mejor con rutas a carpetas)
  const watchDirs = [
    path.join(way.root, 'core', 'config', 'proc'),
    path.join(way.root, 'core', 'config', '@'),
    path.join(way.root, 'custom', 'config', 'proc'),
    path.join(way.root, 'custom', 'config', '@'),
    path.join(way.root, 'custom', 'docs'),
  ];
  // Añadir custom/app/*/config/proc y config/@ si existen
  try {
    const customAppDir = path.join(way.root, 'custom', 'app');
    if (fs.existsSync(customAppDir)) {
      const apps = fs.readdirSync(customAppDir, { withFileTypes: true });
      apps.forEach((d) => {
        if (d.isDirectory()) {
          watchDirs.push(path.join(customAppDir, d.name, 'config', 'proc'));
          watchDirs.push(path.join(customAppDir, d.name, 'config', '@'));
        }
      });
    }
  } catch (e) {}

  const existingDirs = watchDirs.filter((d) => fs.existsSync(d));
  way.lib.log({
    message: 'watch:',
    type: 'label',
  });
  existingDirs.forEach((d) => {
    way.lib.log({ message: `- ${d}`, type: 'label' });
  });
  if (existingDirs.length === 0) {
    way.lib.log({
      message: 'watch: ningún directorio existe, salida.',
      type: 'warn',
    });
    way.lib.exit('watch: no hay directorios config/proc o config/@ para vigilar.');
  }

  let debounceTimer = null;
  const debounceMs = 600;

  const inDocker = fs.existsSync('/.dockerenv');
  const chokidarOpts = {
    ignoreInitial: true,
    usePolling: true,
    interval: 800,
    binaryInterval: 800,
    ignored: /(^|[\/\\])\../,
  };

  way.lib.log({
    message: `watch: inDocker = ${inDocker}, usePolling = true, interval = ${chokidarOpts.interval}ms`,
    type: 'label',
  });

  async function runWayInit() {
    const nodePath = path.join(way.root, 'index.js');
    const cmd = `node ${nodePath} core.init -v`;
    way.lib.log({
      message: `watch: ejecutando way.lib.exec → ${cmd}`,
      type: 'label',
    });
    way.lib.log({
      message: `watch: cd = ${projectRoot}`,
      type: 'label',
    });
    const result = await way.lib.exec({
      cmd: cmd,
      cd: projectRoot,
      out: true,
    });
    way.lib.log({
      message: `watch: Ejecutado core.init!`,
      type: 'label',
    });
    if (result.code !== 0) {
      way.lib.log({
        message: `way core.init finalizó con código ${result.code}`,
        type: 'warn',
      });
    }
  }

  const onChange = (event, eventPath) => {

    if (
      !eventPath ||
      !/\.(yml|yaml|md)$/i.test(eventPath) ||
      /index\.md$/i.test(eventPath)
    ) return;

    way.lib.log({
      message: `watch: evento "${event}" → ${eventPath}`,
      type: 'label',
    });
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      way.lib.log({
        message: 'watch: debounce completado → ejecutando way core.init -v',
        type: 'label',
      });
      runWayInit();
    }, debounceMs);
  };

  const watcher = chokidar.watch(existingDirs, chokidarOpts);

  watcher
    .on('add', (p) => onChange('add', p))
    .on('change', (p) => onChange('change', p))
    .on('unlink', (p) => onChange('unlink', p))
    .on('ready', () => {
      way.lib.log({
        message: 'watch: En escucha...',
        type: 'label',
      });
      const watched = watcher.getWatched();
    })
    .on('error', (err) => {
      way.lib.log({
        message: `watch: error chokidar: ${err.message}`,
        type: 'warn',
      });
    });

  way.lib.log({
    message: 'Edita un .yml y la doc se regenerará automáticamente. Ctrl+C para salir.',
    type: 'label',
  });

  return new Promise(() => {});
};
