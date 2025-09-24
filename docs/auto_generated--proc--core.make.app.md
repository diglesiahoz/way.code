### core.make.app

> Permite establecer la configuración inicial de una aplicación personalizada

```yml
help: "Establece libreria personalizada"
example:
 - (({}.tmp.proc.sig)) --name myapp
task:
  require:
    args:
      name:
        required: true
        type: String
        default:
  do:
    -
      call: makeApp
      args:
        name: (({}.args.name))
    -
      call: log
      args:
        message: (({}.out.data))
        type: success
```
[```core/config/proc/core.make.app.yml```](../app/core/config/proc/core.make.app.yml)
