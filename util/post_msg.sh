#!/usr/bin/env bash

force_error="false"
if [ ! -z "$1" ] && [[ $1 =~ ^(true|false)$ ]]; then
    force_error=$1
fi

payload="{\"message\": \"ping\", \"force_error\": ${force_error} }";

curl \
  -X PUT \
  -H 'Content-Type:application/json' \
  -d $"${payload}" \
http://localhost:8088/message

