### Re-instalar Docker

1. Si instalaste Docker con Snap...
```
sudo snap disable docker && \
sudo snap remove --purge docker
```
2. Re-instalar Docker
```
sudo systemctl stop docker && \
sudo systemctl disable docker && \
sudo systemctl disable docker.socket && \
sudo apt remove --purge docker-ce docker-ce-cli containerd.io docker-compose -y && \
sudo apt autoremove -y && \
sudo apt autoclean && \
sudo rm -rf /etc/docker && \
sudo rm -rf /usr/local/bin/docker

sudo apt remove docker-desktop 2>/dev/null && \
sudo rm -r $HOME/.docker/desktop && \
sudo rm /usr/local/bin/com.docker.cli && \
sudo apt purge docker-desktop && \
sudo rm $HOME/.docker/config.json

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose -y && \
sudo systemctl start docker && \
sudo systemctl enable docker && \
sudo systemctl enable docker.socket
```
