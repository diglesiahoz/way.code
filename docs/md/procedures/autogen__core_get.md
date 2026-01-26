# core.get

📂 `core/config/proc/core.get.yml`


### Código
```yml
help: Obtiene información de ficheros de configuración
example:
  - '(({}.tmp.proc.sig))'
  - '(({}.tmp.proc.sig)) @*.local'
allowed: false
task:
  require:
    config:
      - conf
  do:
    - call: getConfigFromCLI
      args:
        config: '(({conf}))'
```