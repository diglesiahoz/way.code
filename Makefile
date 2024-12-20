UID = $(shell id -u)
GID = $(shell id -g)
USERNAME = $(USER)
TAG = way_code
DOCKER_GROUP_ID = $(shell getent group docker | cut -d: -f3)

up:
	cd ./env && export COMPOSE_PROJECT_NAME=$(TAG); export APPSETTING_UID=$(UID); export APPSETTING_GID=$(GID); export APPSETTING_USER=$(USERNAME); export APPSETTING_DOCKER_GROUP_ID=$(DOCKER_GROUP_ID); docker-compose up -d --build && echo && docker ps --filter name=^/$(TAG)-app
down:
	cd ./env && export COMPOSE_PROJECT_NAME=$(TAG); export APPSETTING_UID=$(UID); export APPSETTING_GID=$(GID); export APPSETTING_USER=$(USERNAME); export APPSETTING_DOCKER_GROUP_ID=$(DOCKER_GROUP_ID); docker compose down && docker ps --filter name=^/$(TAG)-app
bash:
	cd ./env && docker exec -it --user $(USERNAME) $(TAG)-app /bin/bash
logs:
	cd ./env && export COMPOSE_PROJECT_NAME=$(TAG); export APPSETTING_UID=$(UID); export APPSETTING_GID=$(GID); export APPSETTING_USER=$(USERNAME); export APPSETTING_DOCKER_GROUP_ID=$(DOCKER_GROUP_ID); docker compose logs -f -t
ps:
	cd ./env && docker ps --filter name=^/$(TAG)-app
install:
	$(shell ./env/sh/install.sh)