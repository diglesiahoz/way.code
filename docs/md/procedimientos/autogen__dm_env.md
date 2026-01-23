# dm.env

📂 `custom/app/dm/config/proc/env.yml`


### Código
```yml
help: Obtiene variables de entorno
example:
  - '(({}.tmp.proc.sig))'
task:
  require:
    config:
      - .*(\.local|\.dev|\.test|\.pre|\.prod) origin
    args: {}
    settings: {}
  do:
    - event: origin startup
    - call: exec
      args:
        cmd: >-
          docker exec --user (({}.user.username)) -it
          (({origin}.appsetting.service.www.host)) printenv | sort
        out: true
    - event: origin windup
```