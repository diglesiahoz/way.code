# core.help

📂 `app/core/config/proc/core.help.yml`


### Código
```yml
allowed: false
task:
  require: {}
  do:
    - check:
        data:
          - eval: 'require(''fs'').existsSync(''(({}.root))/.cache/out.help'')'
            is: true
        'false':
          - call: exec
            args:
              cmd: '(({}.exec)) core.init'
              out: true
    - call: eval
      args:
        cmd: 'require(''fs'').readFileSync(''(({}.root))/.cache/out.help'').toString();'
        out: false
    - call: log
      args:
        message: '(({}.out.data))'
        type: console
```