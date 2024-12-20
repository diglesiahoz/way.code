# way.code

> Marco para crear aplicaciones que te permitan automatizar tareas y procesos.

## Características

* Generación automática de documentación
* Escalable mediante aplicaciones personalizas

## Requisitos

* Docker
* Docker Compose

## Instalación

1. Clona proyecto e instala
```console
git clone https://github.com/diglesiahoz/way.code.git && \
cd way.code && \
make install
```
2. Modifica el valor de la variable ```APPSETTING_PROJECTS_PATH``` en ```./env/.env```
3. Levanta entorno (ctrl + x cuando muestre mensaje "Keep alive")
```console
source ~/.bashrc && \
make up && \
make logs
```
4. Establece configuración inicial y ejecuta
```console
way core.init && \
source ~/.bashrc && \
way
```

## Docs

#### Proc.

* [core.init](docs/auto_generated--proc--core.init.md)
* [core.make.app](docs/auto_generated--proc--core.make.app.md)
* [core.ssh](docs/auto_generated--proc--core.ssh.md)
## Recetas

* [Instalar aplicación desde repositorio](docs/auto_generated--proc--core.init--recipe1--instalar_aplicaci_n_desde_repositorio.md)
* [Instalar nueva aplicación](docs/auto_generated--proc--core.make.app--recipe1--instalar_nueva_aplicaci_n.md)