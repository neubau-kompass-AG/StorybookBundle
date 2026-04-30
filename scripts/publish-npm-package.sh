#!/usr/bin/env bash
set -euo pipefail

PACKAGE_DIR="${1:?Package directory is required.}"
PACKAGE_NAME="$(node -p "require('./${PACKAGE_DIR}/package.json').name")"
PACKAGE_VERSION="$(node -p "require('./${PACKAGE_DIR}/package.json').version")"

if npm view "${PACKAGE_NAME}@${PACKAGE_VERSION}" version >/dev/null 2>&1; then
    echo "${PACKAGE_NAME}@${PACKAGE_VERSION} is already published; skipping."
    exit 0
fi

if [ -z "${NODE_AUTH_TOKEN:-}" ]; then
    echo "NODE_AUTH_TOKEN is not set. Configure the NPM_TOKEN GitHub secret before publishing."
    exit 1
fi

npm publish "${PACKAGE_DIR}" --access public --provenance
