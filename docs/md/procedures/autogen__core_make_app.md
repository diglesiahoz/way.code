# core.make.app

📂 `app/core/config/proc/core.make.app.yml`


### Código
```yml
help: Establece libreria personalizada
example:
  - '(({}.tmp.proc.sig)) --name myapp'
task:
  require:
    args:
      name:
        required: true
        type: String
        default: null
  do:
    - call: makeApp
      args:
        name: '(({}.args.name))'
    - call: log
      args:
        message: '(({}.out.data))'
        type: success
```