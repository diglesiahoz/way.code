# dm.init

📂 `custom/app/dm/config/proc/init.yml`


### Código
```yml
help: Despliega código
example:
  - '(({}.tmp.proc.sig))'
task:
  require:
    config:
      - .*(\.local) origin
    opt: {}
  do:
    - event: origin startup
    - call: dm.init
      args:
        name: '(({origin}.appsetting.stack))'
        remove_all: false
        force: '(({}.opt.f))'
    - event: origin windup
```