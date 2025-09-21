### Cambiar el grupo de direcciones predeterminado de Docker

1. Crea backup de /etc/docker/daemon.json
```
sudo cp /etc/docker/daemon.json /etc/docker/daemon.json.backup 2>/dev/null
```
2. Establece fichero /etc/docker/daemon.json
```
echo '{
  "default-address-pools": [
    {
      "base": "172.80.0.0/16",
      "size": 24
    }
  ],
  "registry-mirrors": ["https://mirror.gcr.io"],
  "dns": ["8.8.8.8", "1.1.1.1"]
}' | sudo tee /etc/docker/daemon.json > /dev/null
```
3. Re-inicia servicio docker
```
sudo systemctl restart docker
```
