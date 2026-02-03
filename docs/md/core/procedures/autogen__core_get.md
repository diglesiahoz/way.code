# core.get

📂 `app/core/config/proc/core.get.yml`


### Código
```yml
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