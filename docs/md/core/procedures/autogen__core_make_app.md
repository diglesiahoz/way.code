# core.make.app

📂 `app/core/config/proc/core.make.app.yml`

### Descripción

> Crea una nueva aplicación (biblioteca) personalizada en custom/app con la estructura
> estándar: config, config/@, config/proc, file, lib, docs (procedimientos, perfiles, recetas).

:::tip Tip
Muy útil para crear aplicaciones personalizadas.
:::

### Ejemplos

```
way core.make.app myapp -v
```


### Código
```yml
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