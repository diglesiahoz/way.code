#!/usr/bin/env bash

__((app))Complete__ ()
{
  COMPREPLY=()
  CUR_WORD="${COMP_WORDS[COMP_CWORD]}";
  FPREV_WORD="${COMP_WORDS[COMP_CWORD-2]}";
  PREV_WORD="${COMP_WORDS[COMP_CWORD-1]}";
  PROCNAME=""
  if [ -f ((root))/.cache/complete.way ]
  then
    CURRENT=''
    for i in "${COMP_WORDS[@]}"
    do
      CURRENT=$CURRENT" "$i
    done
    OUTPUT=$(cat ((root))/.cache/complete.way)
    IFS='
    ';for CUR in $(echo "$CURRENT" | xargs -n1)
    do
      OUTPUT=$(echo "$OUTPUT" | xargs -n1 | sed '/^'$(echo "$CUR" | sed -e 's/\[/\\[/' | sed -e 's/\]/\\]/')'$/ d')
      if [ "$CUR" = "--a" ] || [ "$CUR" = "-a" ]
      then
        if [ -f ((root))/.cache/complete.way.$FPREV_WORD.$CUR ]
        then
          OUTPUT=$(cat ((root))/.cache/complete.way.$FPREV_WORD.$CUR)
        fi
      else
        if [ -f ((root))/.cache/complete.way.$CUR ]
        then
          OUTPUT=$(cat ((root))/.cache/complete.way.$CUR)
        fi
      fi
    done
    COMPREPLY=( $( compgen -W "$(echo $OUTPUT | xargs -n1)" -- ${CUR_WORD} ) )
  fi
  return 0
}
#complete -o bashdefault -o nospace -F ((func))
complete -o bashdefault -F ((func))

__wayPs1__ ()
{
  if [ -f ((root))/.cache/out.pwd ]
  then
    LINE=$(cat ((root))/.cache/out.pwd | grep -E '^'$(pwd)':')
    if [ "$LINE" != "" ]
    then
      CONFIG=$(echo $LINE | awk -F: '{ print $2 }')
      echo " $CONFIG "
    fi
  fi
}