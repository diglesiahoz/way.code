---
title: Instalar aplicación desde repositorio
sidebar_label: Instalar aplicación desde repositorio
sidebar_position: 1.0
slug: /recipes/instalar-aplicacion-desde-repositorio
tags: [core, instalación]
---

# Instalar aplicación desde repositorio

1. Modifica el fichero ```app/custom/config/custom.yml``` (Si no existe copia desde custom.example.yml)

2. Establece la configuración de la aplicación en la propiedad *apps*. Estableciendo el nombre de la aplicación y la url del repositorio.

```yml
apps:
  dm: https://github.com/diglesiahoz/way.code.app.dm.git
```

3. Guarda el fichero ```app/custom/config/custom.yml```

4. Ejecuta ```way core.init -v```