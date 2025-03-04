ARG APPSETTING_SERVICE_IMAGE
FROM $APPSETTING_SERVICE_IMAGE

# arg:
ARG APPSETTING_UID
ARG APPSETTING_GID
ARG APPSETTING_USER
ARG APPSETTING_DOCKER_GROUP_ID

# env:
ENV DEBIAN_FRONTEND="noninteractive" TZ="Europe/Madrid"

# packages:
RUN apt update
RUN apt install -y apt-transport-https
RUN apt install -y software-properties-common
RUN apt install -y ca-certificates
RUN update-ca-certificates
RUN apt install -y libnss3-tools
RUN apt install -y wget
RUN apt install -y sudo
RUN apt install -y curl
RUN apt install -y jq
RUN apt install -y perl
RUN apt install -y sshpass
RUN apt install -y rsync

# user:
RUN deluser --remove-home ubuntu
RUN addgroup $APPSETTING_USER
RUN useradd -m -u $APPSETTING_UID -g $APPSETTING_GID -s /bin/bash -d /home/$APPSETTING_USER $APPSETTING_USER
RUN usermod -aG www-data $APPSETTING_USER
RUN usermod -aG sudo $APPSETTING_USER
RUN echo "" >> /etc/sudoers
RUN echo "${APPSETTING_USER} ALL=NOPASSWD: ALL" >> /etc/sudoers
ADD ../templates/bashrc /home/$APPSETTING_USER/.bashrc

# user root:
ADD ../templates/bashrc.root /root/.bashrc

# docker:
RUN groupadd -g $APPSETTING_DOCKER_GROUP_ID docker
RUN usermod -aG docker $APPSETTING_USER
RUN apt install -y docker-compose-v2

# mkcert:
# RUN wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64
# RUN mv mkcert-v1.4.3-linux-amd64 /usr/bin/mkcert
# RUN chmod +x /usr/bin/mkcert
# RUN mkcert -install

# node:
RUN curl -sL https://deb.nodesource.com/setup_23.x | sudo bash -
RUN apt install -y nodejs
RUN node -v

RUN echo "Built on $(date)" > /build.log

STOPSIGNAL SIGQUIT

COPY ../entrypoint/docker-entrypoint.app.sh /docker-entrypoint.app.sh
RUN chmod +x /docker-entrypoint.app.sh
ENTRYPOINT [ "/docker-entrypoint.app.sh" ]

USER $APPSETTING_USER