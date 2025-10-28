#!/bin/bash

ROOT="$(dirname $(dirname $(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)))"

[ ! -f $ROOT/env/.env ] && cp $ROOT/env/example.env $ROOT/env/.env

OUT=$(cat ~/.bashrc | awk '/# Manage from: way_code-app/,/# Manage end: way_code-app/ { next } 1')
echo "$OUT" > ~/.bashrc

cat >> ~/.bashrc<< EOF

# Manage from: way_code-app
export WAY_CODE_APP_NAME=way;
export WAY_CODE_APP_ROOT=$ROOT/app
alias \${WAY_CODE_APP_NAME}='function '\$WAY_CODE_APP_NAME'(){ 
  CMD="docker exec -it -u \$USER way_code-app /bin/bash -c \"export PWD=\$(pwd) && /usr/bin/node \${WAY_CODE_APP_ROOT} \$(echo \$* | xargs)\""
  if [ "\$(echo \$* | xargs -n1 | grep -E "^-[a-z]*(v|r|s){1}")" != "" ] && [ "\$(echo \$* | xargs -n1 | grep -E "^-[a-z]*(o){1}")" = "" ]
  then
    # https://codepoints.net/
    printf "%b" "\$(tput bold)\$(tput dim)\$(tput setaf 6)" "\u25C9  exec => ( " "\$(tput sgr0)" "\$(tput bold)\$(tput setaf 6)" "\$CMD" "\$(tput bold)\$(tput dim)\$(tput setaf 6)" " )" "\$(tput sgr0)\n"
  fi
  eval "\$CMD"; 
}; \$WAY_CODE_APP_NAME';
[ -f \${WAY_CODE_APP_ROOT}/complete.sh ] && source \${WAY_CODE_APP_ROOT}/complete.sh
alias \${WAY_CODE_APP_NAME}.env="docker exec -it -u \$USER way_code-app /bin/bash -c \"printenv | sort\""
alias \${WAY_CODE_APP_NAME}.code="cd \$(dirname \${WAY_CODE_APP_ROOT})"
alias \${WAY_CODE_APP_NAME}.up="cd \$(dirname \${WAY_CODE_APP_ROOT}) && make down && make up && cd - > /dev/null"
alias \${WAY_CODE_APP_NAME}.down="cd \$(dirname \${WAY_CODE_APP_ROOT}) && make down && cd - > /dev/null"
alias \${WAY_CODE_APP_NAME}.access="cd \$(dirname \${WAY_CODE_APP_ROOT}) && make access && cd - > /dev/null"
alias \${WAY_CODE_APP_NAME}.install="cd \$(dirname \${WAY_CODE_APP_ROOT}) && make install && source ~/.bashrc && cd - > /dev/null"
alias \${WAY_CODE_APP_NAME}.pull="cd \$(dirname \${WAY_CODE_APP_ROOT}) && make pull && cd - > /dev/null"
# Manage end: way_code-app

EOF

