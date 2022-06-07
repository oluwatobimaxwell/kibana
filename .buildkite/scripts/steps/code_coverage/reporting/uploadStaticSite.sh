#!/usr/bin/env bash

set -euo pipefail

echo "--- Upload coverage static site"

xs=("$@")
len=${#xs[@]}

uploadPrefix="gs://elastic-bekitzur-kibana-coverage-live/"
uploadPrefixWithTimeStamp="${uploadPrefix}${TIME_STAMP}/"

cat src/dev/code_coverage/www/index.html

for x in 'src/dev/code_coverage/www/index.html' 'src/dev/code_coverage/www/404.html'; do
  gsutil -m -q cp -r -a public-read -z js,css,html ${x} ${uploadPrefix}
done

for x in "${xs[@]}"; do
  gsutil -m -q cp -r -a public-read -z js,css,html "target/kibana-coverage/${x}-combined" ${uploadPrefixWithTimeStamp}
done
