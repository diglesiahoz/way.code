# WAY


### Requisitos

        - npm >= 8.3.1
        - node >=16


###### Instalación Node 

        cd ~
        curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
        sudo apt -y install nodejs
        node -v


### Instalación

        cd WAY_ROOT

        echo -e 'export WAY_APP_NAME_ROOT="way"'
        echo -e 'alias ${WAY_APP_NAME_ROOT}="~/.nvm/versions/node/v16.14.0/bin/node /home/diglesia/project/_app/${WAY_APP_NAME_ROOT}/index.js"; [ -f /home/diglesia/project/_app/${WAY_APP_NAME_ROOT}/complete.sh ] && source /home/diglesia/project/_app/${WAY_APP_NAME_ROOT}/complete.sh'
        echo -e 'alias ${WAY_APP_NAME_ROOT}.dir="cd /home/diglesia/project/_app/${WAY_APP_NAME_ROOT}"'

        npm install
        node index.js init
        source ~/.bashrc


### Recetas JS

##### Buscar patrón en valores de array

```js
var found = pwd.find(element => new RegExp(`^${way.pwd}:`,"g").test(element));
```


### Recetas (way)

#### Ejemplos comandos linux (textos)

```yml
-
  call: exec
  args:
    cd: (({origin}.project.root))
    cmd: echo "$(sed "1d" .ddev/.gitignore)" > .ddev/.gitignore
-
  call: exec
  args:
    cd: (({origin}.project.root))
    cmd: echo "$(sed "s/^\/.gitignore/#\/.gitignore/" .ddev/.gitignore)" > .ddev/.gitignore
```

##### Ejemplo de función API

```js
way.lib.azure.getRawOptionsFromObject = async function (_args) {
  var _args = way.lib.getArgs('azure.getRawOptionsFromObject', _args);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      (async function() {
        var raw = "";
        if (typeof _args.data !== "object") {
          _args.data = JSON.parse(_args.data);
        }
        for (const key in _args.data) {
          if (Object.hasOwnProperty.call(_args.data, key)) {
            if ( ! new RegExp(`^_`, "g").test(key) && ! _args.exclude.includes(key)) {
              var value = _args.data[key];
              switch (typeof value) {
                case "object":
                  raw += ` --${key} ${value.join(" ")}`
                  break;
                default:
                  raw += ` --${key} ${value}`
                  break;
              }
            }
          }
        }
        resolve({
          args: Object.assign({}, _args),
          attach: {},
          code: 0,
          data: raw,
        });
      })();
    }, 0);
  });
}
```

##### Establecer nombre de perfil en consola

```sh
\[$(tput bold)\]\[\033[38;5;40m\]\$(__wayPs1__)\[$(tput sgr0)\]
```


##### Establecer variable con salida de comando

```yml
- 
  call: exec
  args:
    cmd: head -n -10 (({origin}.vhost.path.www.public))/sites/(({origin}.vhost.site.folder))/settings.php | grep -Ev "\*" | grep -Ev "^#" | grep -Ev "^\/\/" | grep -Ev "^<\?php" | sed -r "/^\s*$/d"
    pipe: legacySettings
- 
  call: log
  args:
    message: (({}.var.legacySettings))
    type: pretty
```

##### Aplicar acción en tiempo de ejecución

```yml
- 
  check:
    data: 
      -
        eval: require('fs').existsSync("(({origin}.vhost.path.www.public))/site-empty.flag")
        is: true
    true:
      -
        call: apply
        args:
          value: new
```
##### Loop

```yml
-
  loop: (({origin}.actions))
  do:
    -
      call: log
      args:
        message: "Acción 1: (())"
        type: success
    -
      call: log
      args:
        message: "Acción 2: (())"
        type: success
```
```yml
-
  loop: (({origin}.azure.storage.containers))
  do:
    -
      call: log
      args:
        message: az storage container create --account-name (({origin}.azure.storage.account.name)) --name (({}._this.blob_container)) --public-access (({}._this.public-access))
        type: console
```
```yml
-
  loop: (({origin}.azure.database.mysql.db))
  do:
    -
      call: log
      args:
        message: config_db_(({}._this.COUNTER))
        type: console
```
##### Check
- Comprueba salida código JS

```yml
- 
  check:
    data: 
      -
        eval: require('fs').existsSync("(({origin}.vhost.path.www.public))/index.php")
        is: true
    true:
      -
        call: log
        args:
          message: Está el fichero
          type: success
    false:
      -
        call: log
        args:
          message: No está el fichero
          type: warning
```
- Comprueba salida código SH

```yml
- 
  check:
    data: 
      -
        exec: "[ -f (({origin}.vhost.path.www.public))/index.php ] && echo 1 || echo 0"
        is: true
    true:
      -
        call: log
        args:
          message: Está el fichero
          type: success
    false:
      -
        call: log
        args:
          message: No está el fichero
          type: warning
```

##### Ejemplo de perfil de configuración

```yml
_pwd: /home/diglesia/proyectos/drupal/hr/www

vhost:
  name: local-hr.opentrends.net
  alias: local-hr.opentrends.net
  site:
    folder: default
    uri: https://((vhost.alias))
  path:
    root: /home/diglesia/proyectos/drupal/hr
    private: ((vhost.path.root))/private
    log: ((vhost.path.root))/log
    tmp: ((vhost.path.root))/tmp
    ssl: ((vhost.path.root))/ssl
    www: 
      root: ((vhost.path.root))/www
      public: ((vhost.path.www.root))/web
      site: ((vhost.path.www.public))/sites/((vhost.site.folder))
  php:
    release: "8.1"

mysql:
  db:
    host: 127.0.0.1
    port: 3306
    prefix: ""
    name: db_hr
    user: diglesia
    pass: diglesia
    url: "mysql://((mysql.db.user)):((mysql.db.pass))@((mysql.db.host))/((mysql.db.name))"
    default:
      options: --no-autocommit --single-transaction --opt -Q --no-tablespaces
      dump_path: ((vhost.path.private))
      ignore_table:
        - drupal_cache_bootstrap 
        - drupal_cache_config 
        - drupal_cache_container 
        - drupal_cache_data 
        - drupal_cache_default 
        - drupal_cache_discovery 
        - drupal_cache_discovery_migration 
        - drupal_cache_dynamic_page_cache 
        - drupal_cache_entity 
        - drupal_cache_menu 
        - drupal_cache_migrate 
        - drupal_cache_page 
        - drupal_cache_render 
        - drupal_cache_rules 
        - drupal_cachetags 
        - drupal_cache_toolbar
        - drupal_watchdog
        - drupal_search_total

hook:
  call: {}
  event:
    drupal.install:
      init:
        - 
          label: Establece paquetes requeridos
          call: var
          args:
            key: composer.run
            value:
              - require drupal/permissions_filter
              - require drupal/admin_toolbar
              - require drupal/environment_indicator
        - 
          label: Establece comandos drush
          call: var
          args:
            key: drush.run
            value:
              - config-set system.performance css.preprocess 0
              - config-set system.performance js.preprocess 0
              - pm:enable permissions_filter
              - pm:enable admin_toolbar
              - pm:enable admin_toolbar_tools
              - pm:enable environment_indicator
```

##### Hooks que implementan instalación de Drupal 

- Instalación básica

```yml
hook:
  call: {}
  event:
    drupal.install:
      init:
        - 
          label: Establece paquetes requeridos
          call: var
          args:
            key: composer.run
            value:
              - require drupal/admin_toolbar
              - require drupal/devel
              - require drupal/devel_kint_extras
              - require drupal/environment_indicator
              - require drupal/gin:^3.0@alpha
              - require drupal/honeypot
              - require drupal/paragraphs
              - require drupal/pathauto
              - require drupal/permissions_filter
              - require drupal/redirect
              - require drupal/twig_tweak
        - 
          label: Establece comandos drush
          call: var
          args:
            key: drush.run
            value:
              - config:set system.performance css.preprocess 0
              - config:set system.performance js.preprocess 0
              - pm:enable admin_toolbar
              - pm:enable admin_toolbar_search
              - pm:enable admin_toolbar_tools
              - pm:enable devel_kint_extras
              - pm:enable environment_indicator
              - pm:enable honeypot
              - pm:enable paragraphs
              - pm:enable pathauto
              - pm:enable permissions_filter
              - pm:enable redirect
              - pm:enable twig_tweak
              - config:set devel.settings devel_dumper kint
              - config:set honeypot.settings protect_all_forms true -y
              - config:set honeypot.settings element_name myaddress -y
              - theme:enable gin
              - pm:enable gin_toolbar
              - config-set system.theme admin gin
              - config-set gin.settings enable_darkmode 1
              - config-set gin.settings classic_toolbar \"horizontal\"
              - config:set gin.settings preset_accent_color neutral
              - config:set gin.settings preset_focus_color dark
```

- Instalación avanzada

```yml
hook:
  call: {}
  event:
    drupal.install:
      init:
        - 
          label: Establece comandos composer
          call: var
          args:
            key: composer.run
            value:
              - require drupal/permissions_filter
              - require drupal/admin_toolbar
              - require drupal/environment_indicator
              - require drupal/gin_toolbar:^1.0@beta
              - require drupal/gin:^3.0@alpha
              - require drupal/gin_login:^1.0
        - 
          label: Establece comandos drush
          call: var
          args:
            key: drush.run
            value:
              - config-set system.performance css.preprocess 0
              - config-set system.performance js.preprocess 0
              - pm:enable permissions_filter
              - pm:enable admin_toolbar
              - pm:enable admin_toolbar_tools
              - pm:enable environment_indicator
              - pm:enable gin_toolbar
              - pm:enable gin_login
              - theme:enable gin
              - config-set system.theme admin gin -y
              - config-set system.theme default gin -y
              - config-set gin.settings enable_darkmode 0 -y
              - config-set gin.settings classic_toolbar horizontal
              - config-set system.site page.front \"/user/login?destination=/admin/content\"
```


- Instalación sub-tema (Drupy: https://www.drupal.org/project/drupy)

```yml
hook:
  call: {}
  event:
    drupal.install:
      init:
        - 
          label: Establece paquetes requeridos
          call: var
          args:
            key: composer.run
            value:
              - require drupal/drupy
        - 
          label: Establece comandos drush
          call: var
          args:
            key: drush.run
            value:
              - theme:enable (({}.env._this._name))_theme
              - config-set system.theme default (({}.env._this._name))_theme -y
      after.composer.run:
        - 
          call: exec
          args: 
            cmd: cp -r web/themes/contrib/drupy/ web/themes/custom/(({}.env._this._name))_theme
            cd: ((vhost.path.www.root))
        - 
          call: exec
          args: 
            cmd: find . -type f -print0 | xargs -0 sed -i "s/drupy/(({}.env._this._name))_theme/g"
            cd: ((vhost.path.www.root))/web/themes/custom/(({}.env._this._name))_theme
        - 
          call: exec
          args: 
            cmd: find . -type f -print0 | xargs -0 sed -i "s/Drupy/(({}.env._this._name))_theme/g"
            cd: ((vhost.path.www.root))/web/themes/custom/(({}.env._this._name))_theme
        - 
          call: exec
          args: 
            cmd: for file in $(find . -type f -name "*drupy*"); do echo $file; mv $file $(echo $file | sed -e "s/drupy/(({}.env._this._name))_theme/g"); done
            cd: ((vhost.path.www.root))/web/themes/custom/(({}.env._this._name))_theme
        - 
          call: exec
          args: 
            cmd: npm install
            cd: ((vhost.path.www.root))/web/themes/custom/(({}.env._this._name))_theme
        - 
          call: exec
          args: 
            cmd: npm run build:dev
            cd: ((vhost.path.www.root))/web/themes/custom/(({}.env._this._name))_theme
        - 
          call: log
          args: 
            message: "Establecido sub-tema"
            type: success
```

- Instalación sub-tema (Radix: https://www.drupal.org/project/radix)

```yml
hook:
  call: {}
  event:
    drupal.install:
      init:
        - 
          label: Establece paquetes requeridos
          call: var
          args:
            key: composer.run
            value:
              - require drupal/radix
              - require drupal/components
        - 
          label: Establece comandos drush
          call: var
          args:
            key: drush.run
            value:
              - pm:enable components
              - theme:enable radix
              - --include=./web/themes/contrib/radix radix:create \"(({}.env._this._name))_theme\"
              - theme:enable (({}.env._this._name))_theme
              - config-set system.theme default (({}.env._this._name))_theme -y
      after.drush.run:
        - 
          call: log
          args: 
            message: "Establecido sub-tema"
            type: success
        - 
          call: log
          args: 
            message: "Para compilar el tema, recuerda ejecutar...\n- cd ((vhost.path.www.root))/web/themes/custom/(({}.env._this._name))_theme\n- nvm install $(cat .nvmrc)\n- npm install\n- npm run dev"
            type: success
```

- Ejecutar acciones personalizadas una vez re-instalado Drupal

```yml
hook:
  call: {}
  event:
    drupal.reinstall:
      complete:
        - 
          label: Importa contenido por defecto
          call: exec
          args: 
            cmd: vendor/bin/drush stool:import ((vhost.path.www.root))/migration/output/data --update
            cd: ((vhost.path.www.root))
```

##### Instalar drupal 

```sh
way @drupaltest.local apache.manage.vhost -y
way @drupaltest.local mysql.add.database
way @drupaltest.local drupal.install -y
```

##### Obtener nombre de proyecto

```sh
way @*.prod$.._name
```

##### Comprobar validez de certificados

```sh
way @*.prod$ check.certificate
```

Para ello debe de establecer los dominios a comprobar en hook...
```yml
hook:
  call: {}
  event:
    check.certificate:
      init:
        - 
          call: var
          args:
            key: domain.run
            value:
              - bongtouchoftaste.se
              - www.bongtouchoftaste.se
              - touchoftaste.se
      complete: {}
```

##### Establecer permisos por rol (Drupal)

```yml
drupal:
  config:
    role:
      -
        role-name: seo
        role-perm:
          - 'access administration pages'
          - 'access content overview'
          - 'access contextual links'
          - 'access toolbar'
          - 'administer redirect settings'
          - 'administer redirects'
          - 'administer url aliases'
          - 'create url aliases'
          - 'view the administration theme'
      -
        role-name: editor
        role-perm:
          - 'access administration pages'
          - 'access content overview'
          - 'access taxonomy overview'
          - 'access toolbar'
          - 'administer nodes'
          - 'create advanced_page content'
          - 'create header_view_pages content'
          - 'create home_slider content'
          - 'create page content'
          - 'create products content'
          - 'create recipe content'
          - 'create static_pages content'
          - 'create terms in brand'
          - 'create terms in claims'
          - 'create terms in product_family'
          - 'create terms in recipe_family'
          - 'create terms in services'
          - 'create terms in tags'
          - 'create terms in type_of_dish'
          - 'create webform'
          - 'create webform content'
          - 'delete advanced_page revisions'
          - 'delete any advanced_page content'
          - 'delete any header_view_pages content'
          - 'delete any home_slider content'
          - 'delete any page content'
          - 'delete any products content'
          - 'delete any recipe content'
          - 'delete any static_pages content'
          - 'delete any webform content'
          - 'delete header_view_pages revisions'
          - 'delete home_slider revisions'
          - 'delete own advanced_page content'
          - 'delete own header_view_pages content'
          - 'delete own home_slider content'
          - 'delete own page content'
          - 'delete own products content'
          - 'delete own recipe content'
          - 'delete own static_pages content'
          - 'delete own webform'
          - 'delete own webform content'
          - 'delete page revisions'
          - 'delete products revisions'
          - 'delete recipe revisions'
          - 'delete static_pages revisions'
          - 'delete terms in brand'
          - 'delete terms in claims'
          - 'delete terms in product_family'
          - 'delete terms in recipe_family'
          - 'delete terms in services'
          - 'delete terms in tags'
          - 'delete terms in type_of_dish'
          - 'delete webform revisions'
          - 'edit any advanced_page content'
          - 'edit any header_view_pages content'
          - 'edit any home_slider content'
          - 'edit any page content'
          - 'edit any products content'
          - 'edit any recipe content'
          - 'edit any static_pages content'
          - 'edit any webform content'
          - 'edit own advanced_page content'
          - 'edit own header_view_pages content'
          - 'edit own home_slider content'
          - 'edit own page content'
          - 'edit own products content'
          - 'edit own recipe content'
          - 'edit own static_pages content'
          - 'edit own webform'
          - 'edit own webform content'
          - 'edit terms in brand'
          - 'edit terms in claims'
          - 'edit terms in product_family'
          - 'edit terms in recipe_family'
          - 'edit terms in services'
          - 'edit terms in tags'
          - 'edit terms in type_of_dish'
          - 'revert advanced_page revisions'
          - 'revert header_view_pages revisions'
          - 'revert home_slider revisions'
          - 'revert page revisions'
          - 'revert products revisions'
          - 'revert recipe revisions'
          - 'revert static_pages revisions'
          - 'revert webform revisions'
          - 'use admin toolbar search'
          - 'view advanced_page revisions'
          - 'view any webform submission'
          - 'view header_view_pages revisions'
          - 'view home_slider revisions'
          - 'view own unpublished content'
          - 'view page revisions'
          - 'view products revisions'
          - 'view recipe revisions'
          - 'view static_pages revisions'
          - 'view the administration theme'
          - 'view webform revisions'

```

##### Instalar Drupal dockerizado

```yml

# @testdrupal.local

_pwd: /home/diglesia/proyectos/drupal/(({}.env._this._key))

project:
  key: (({}.env._this._key))
  root: ((_pwd))
  core-version: 10
  project-type: drupal((project.core-version))
  docroot: web
  php-version: 8.2
  webserver-type: nginx-fpm
  http-port: 8080 # Alternativa puerto: 80 (Establecido así para poder funcionar con Apache)
  https-port: 8443 # Alternativa puerto: 443 (Establecido así para poder funcionar con Apache)
  additional-hostnames: []
  database: mariadb:10.4
  composer-version: 2
  nodejs-version: 16
  environment:
    - "APPSETTING_DEV=true"
    - "APPSETTING_ENV=local"
    - "APPSETTING_ERROR_LEVEL=verbose"
    - "APPSETTING_FILE_CONFIG_PATH=sites/default/data/sync"
    - "APPSETTING_FILE_PUBLIC_PATH=sites/default/files"
    - "APPSETTING_FILE_PRIVATE_PATH=../private"
    - "APPSETTING_FILE_TEMP_PATH=/tmp"
  account:
    name: opentrends 
    pass: galileo
  git:
    remote: https://gitlab.opentrends.net/diglesia/test-drupal.git

hook:
  call: {}
  event:
    project.new.drupal:
      startup: {}
      windup: {}
```

```sh
way @testdrupal.local project.new.drupal -y
```
