# core.ssh

📂 `core/config/proc/core.ssh.yml`


### Código
```yml
help: Establece conexión SSH
example:
  - '(({}.tmp.proc.sig)) @seidor.dev'
  - '(({}.tmp.proc.sig)) @seidor.dev whoami'
task:
  require:
    config:
      - .* target
  do:
    - call: exec
      args:
        cmd: '(({}.args._))'
        out: true
```