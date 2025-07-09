# check=skip=InvalidDefaultArgInFrom

ARG APPSETTING_SERVICE_IMAGE
FROM $APPSETTING_SERVICE_IMAGE


ARG APPSETTING_USERNAME
ARG APPSETTING_UID
ARG APPSETTING_GID
ARG APPSETTING_DOCKER_GID

# user
USER root

# env:
ENV DEBIAN_FRONTEND="noninteractive" TZ="Europe/Madrid"

# packages:
RUN apt update
RUN apt install -y apt-transport-https
RUN apt install -y software-properties-common
RUN apt install -y ca-certificates
RUN update-ca-certificates
RUN apt install -y gnupg
RUN apt install -y lsb-release
RUN apt install -y libnss3-tools
RUN apt install -y wget
RUN apt install -y sudo
RUN apt install -y curl
RUN apt install -y jq
RUN apt install -y perl
RUN apt install -y sshpass
RUN apt install -y rsync
RUN apt install -y make
RUN rm -rf /var/lib/apt/lists/*

# node:
RUN curl -sL https://deb.nodesource.com/setup_23.x | sudo bash -
RUN apt install -y nodejs
RUN node -v

# docker:
RUN curl -sSL https://get.docker.com/ | sh

# docker group
RUN set -eux; \
    APPSETTING_DOCKER_GID=${APPSETTING_DOCKER_GID:-998}; \
    target_group_name=docker; \
    existing_gid_group=$(getent group "$APPSETTING_DOCKER_GID" | cut -d: -f1 || true); \
    existing_docker_group=$(getent group docker | cut -d: -f1 || true); \
    current_gid_of_docker=$(getent group docker | cut -d: -f3 || true); \
    \
    if [ "$existing_docker_group" = "docker" ]; then \
        if [ "$current_gid_of_docker" != "$APPSETTING_DOCKER_GID" ]; then \
            echo "Grupo 'docker' existe pero con GID incorrecto ($current_gid_of_docker)"; \
            if [ -z "$existing_gid_group" ]; then \
                echo "GID $APPSETTING_DOCKER_GID está libre, modificando GID del grupo 'docker'"; \
                groupmod -g "$APPSETTING_DOCKER_GID" docker; \
            else \
                echo "❌ GID $APPSETTING_DOCKER_GID está ocupado por '$existing_gid_group', no se puede cambiar GID de 'docker'"; \
                exit 1; \
            fi; \
        else \
            echo "Grupo 'docker' ya tiene el GID correcto"; \
        fi; \
    else \
        if [ -z "$existing_gid_group" ]; then \
            echo "Creando grupo 'docker' con GID $APPSETTING_DOCKER_GID"; \
            groupadd -g "$APPSETTING_DOCKER_GID" docker; \
        else \
            echo "❌ No se puede crear grupo 'docker': GID $APPSETTING_DOCKER_GID ocupado por '$existing_gid_group'"; \
            exit 1; \
        fi; \
    fi

# user:
RUN if ! getent group $APPSETTING_GID > /dev/null; then \
        groupadd -g $APPSETTING_GID $APPSETTING_USERNAME; \
    else \
        groupmod -n $APPSETTING_USERNAME $(getent group $APPSETTING_GID | cut -d: -f1); \
    fi && \
    existing_user=$(getent passwd $APPSETTING_UID | cut -d: -f1 || true) && \
    if [ -n "$existing_user" ] && [ "$existing_user" != "$APPSETTING_USERNAME" ]; then \
        echo "Eliminando usuario con UID $APPSETTING_UID: $existing_user"; \
        userdel -r "$existing_user" || true; \
    fi && \
    useradd -m -u $APPSETTING_UID -g $APPSETTING_USERNAME -G docker,www-data,sudo -s /bin/bash $APPSETTING_USERNAME && \
    echo "$APPSETTING_USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/$APPSETTING_USERNAME && \
    chmod 440 /etc/sudoers.d/$APPSETTING_USERNAME
ADD ../templates/bashrc /home/$APPSETTING_USERNAME/.bashrc

# root:
ADD ../templates/bashrc.root /root/.bashrc

RUN echo "Built on $(date)" > /build.log

STOPSIGNAL SIGQUIT

COPY ../entrypoint/docker-entrypoint.app.sh /docker-entrypoint.app.sh
RUN chmod +x /docker-entrypoint.app.sh
ENTRYPOINT [ "/docker-entrypoint.app.sh" ]