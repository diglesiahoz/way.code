# Uninstall docker
```
sudo systemctl stop docker && \
sudo systemctl disable docker && \
sudo systemctl disable docker.socket && \
sudo apt remove --purge docker-ce docker-ce-cli containerd.io docker-compose -y && \
sudo apt autoremove -y && \
sudo apt autoclean
```

# Remove Docker configuration data
```
sudo rm -rf /etc/docker && \
sudo rm -rf /usr/local/bin/docker
```

# Remove Docker data
```
sudo rm -rf /var/lib/docker && \
sudo rm -rf /var/lib/containerd
```

# Uninstall docker-desktop
```
sudo apt remove docker-desktop 2>/dev/null && \
sudo rm -r $HOME/.docker/desktop && \
sudo rm /usr/local/bin/com.docker.cli && \
sudo apt purge docker-desktop && \
sudo rm $HOME/.docker/config.json
```

# Remove Docker group
```
groupdel docker
```

# Install Docker
```
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose -y && \
sudo systemctl start docker && \
sudo systemctl enable docker && \
sudo systemctl enable docker.socket
```

# Verify Docker
```
docker run hello-world
```