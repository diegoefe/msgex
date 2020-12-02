#!/usr/bin/env bash

# A POSIX variable
OPTIND=1         # Reset in case getopts has been used previously in the shell.
# Initialize our own variables:
force_error="false"
trans_id=""
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -t|--tid) trans_id=", \"transaction-id\":\"$2\""; shift ;;
        -e|--error) force_error="true" ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

json="{ \"payload\": {\"message\": \"ping\", \"force_error\": ${force_error} }${trans_id} }";

curl \
  -X PUT \
  -H 'Content-Type:application/json' \
  -d $"${json}" \
http://localhost:8088/message

