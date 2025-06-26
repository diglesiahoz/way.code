### Cambiar el address pool por defecto de Docker

1. Establece fichero /etc/docker/daemon.json
```
echo '{
  "default-address-pools": [
    {
      "base": "172.80.0.0/16",
      "size": 24
    }
  ]
}' | sudo tee /etc/docker/daemon.json > /dev/null
```
2. Re-inicia servicio docker
```
sudo systemctl restart docker
```
