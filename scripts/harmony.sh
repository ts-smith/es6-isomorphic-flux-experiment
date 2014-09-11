#! /bin/bash

if [ $1 == 'show' ]; then
   echo $(node --v8-options | grep harm | awk '{print $1}' | xargs)
else
   node $(node --v8-options | grep harm | awk '{print $1}' | xargs) "${@:1}"
fi

