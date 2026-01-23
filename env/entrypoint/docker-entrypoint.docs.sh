#!/bin/sh
set -e
printenv

# Instalar dependencias solo si no existen node_modules
if [ ! -d "node_modules" ]; then
  npm install
fi

if [ "$APPSETTING_DEV" = "true" ]
then
  # Hot-Reload
  npm start -- --host 0.0.0.0
else
  # Levanta docs con búsqueda indexada
  npm run build && npm run serve
fi
