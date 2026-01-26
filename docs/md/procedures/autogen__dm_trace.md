# dm.trace

📂 `custom/app/dm/config/proc/trace.yml`


### Código
```yml
help: Obtiene información
example:
  - '(({}.tmp.proc.sig))'
task:
  require:
    config:
      - .*(\.local|\.dev|\.test|\.pre|\.stage|\.prod) origin
    args:
      type:
        required: false
        type: String
        default: null
  do:
    - event: origin startup
    - call: dm.makeTrace
      args:
        type: '(({}.args.type))'
    - event: origin windup
```