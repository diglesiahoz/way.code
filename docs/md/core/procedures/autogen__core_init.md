# core.init

📂 `app/core/config/proc/core.init.yml`

### Descripción

> Realiza acciones administrativas del entorno de la aplicación.

:::tip Tip
Se encarga de generar la documentación y el autocompletado
:::

### Ejemplos

```
way core.init -v
```


### Código
```yml
task:
  do:
    - call: init
```