#!/usr/bin/env bash

set -euo pipefail

source .buildkite/scripts/common/util.sh
source .buildkite/scripts/steps/code_coverage/util.sh
source .buildkite/scripts/steps/code_coverage/merge.sh

export CODE_COVERAGE=1
echo "--- Reading Kibana stats cluster creds from vault"
export USER_FROM_VAULT="$(retry 5 5 vault read -field=username secret/kibana-issues/prod/coverage/elasticsearch)"
export PASS_FROM_VAULT="$(retry 5 5 vault read -field=password secret/kibana-issues/prod/coverage/elasticsearch)"
export HOST_FROM_VAULT="$(retry 5 5 vault read -field=host secret/kibana-issues/prod/coverage/elasticsearch)"
export TIME_STAMP=$(date +"%Y-%m-%dT%H:%M:00Z")

echo "--- Download previous git sha"
.buildkite/scripts/steps/code_coverage/reporting/downloadPrevSha.sh

echo "--- Upload new git sha"
.buildkite/scripts/steps/code_coverage/reporting/uploadPrevSha.sh

.buildkite/scripts/bootstrap.sh

collectRan() {
  while read -r x; do
    ran=("${ran[@]}" "$(cat $x)")
  done <<<"$(find target/ran_files -maxdepth 1 -type f -name '*.txt')"
  echo "--- Collected Ran files: ${ran[*]}"
}

uniqueifyRanConfigs() {
  local xs=("$@")
  uniqRanConfigs=($(printf "%s\n" "${xs[@]}" | sort -u | tr '\n' ' '))
  echo "--- Uniq Ran files: ${uniqRanConfigs[*]}"
}

fetchArtifacts() {
  echo "--- Fetch coverage artifacts"

  local xs=("$@")
  for x in "${xs[@]}"; do
    buildkite-agent artifact download "target/kibana-coverage/${x}/*" .
  done
}

archiveReports() {
  echo "--- Archive and upload combined reports"

  local xs=("$@")
  for x in "${xs[@]}"; do
    collectAndUpload "target/kibana-coverage/jest/kibana-${x}-coverage.tar.gz" \
      "target/kibana-coverage/${x}-combined"
  done
}

finalReplace() {
  echo "--- Jest: Reset file paths prefix, merge coverage files, and generate the final combined report"
  replacePaths "$KIBANA_DIR/target/kibana-coverage/jest" "CC_REPLACEMENT_ANCHOR" "$KIBANA_DIR"
  yarn nyc report --nycrc-path src/dev/code_coverage/nyc_config/nyc.jest.config.js
  # TODO-TRE: If we ever turn ftr_configs back on, I'll need to handle them here as well
}

modularize() {
  buildkite-agent artifact download target/ran_files/* .

  if [ -d target/ran_files ]; then
    collectRan
    uniqueifyRanConfigs "${ran[@]}"
    fetchArtifacts "${uniqRanConfigs[@]}"
    .buildkite/scripts/steps/code_coverage/reporting/prokLinks.sh "${uniqRanConfigs[@]}"
    archiveReports "${uniqRanConfigs[@]}"
    .buildkite/scripts/steps/code_coverage/reporting/uploadStaticSite.sh "${uniqRanConfigs[@]}"
    .buildkite/scripts/steps/code_coverage/reporting/collectVcsInfo.sh
    finalReplace
    .buildkite/scripts/steps/code_coverage/reporting/ingestData.sh 'elastic+kibana+code-coverage' \
      ${BUILDKITE_BUILD_NUMBER} ${BUILDKITE_BUILD_URL} ${previousSha} \
      'src/dev/code_coverage/ingest_coverage/team_assignment/team_assignments.txt' "${uniqRanConfigs[@]}"
  else
    echo "--- Found zero configs that ran, cancelling ingestion."
    exit 11
  fi
}

modularize
echo "### unique ran configs: ${uniqRanConfigs[*]}"

# TODO-Tre: I'll eventually need to modularize this too
#echo "--- Functional: Reset file paths prefix, merge coverage files, and generate the final combined report"
# Functional: Reset file paths prefix to Kibana Dir of final worker
#set +e
#sed -ie "s|CC_REPLACEMENT_ANCHOR|${KIBANA_DIR}|g" target/kibana-coverage/functional/*.json
#echo "--- Begin Split and Merge for Functional"
#splitCoverage target/kibana-coverage/functional
#splitMerge
#set -e
