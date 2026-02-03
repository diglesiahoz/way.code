# core.watch

📂 `app/core/config/proc/core.watch.yml`

### Descripción

> - Demonio que vigila cambios en ficheros de configuración (config/proc/*.yml y config/@/**/*.yml)
> - Si detecta cambios, ejecuta ``core.init`` para regenerar la documentación (makeDocs).
> - Solo se activa cuando env/.env tiene APPSETTING_DEV=true.

### Ejemplos

```
way core.watch
```


### Código
```yml
task:
  require: {}
  do:
    - call: watch
```