#!/bin/bash
# Lint-on-save hook for Agenz Website
# Formats and fixes TypeScript/TSX files on save

FILE=$1

if [[ "$FILE" =~ \.(ts|tsx)$ ]]; then
  npx prettier --write "$FILE"
  npx eslint --fix --quiet "$FILE"
fi

exit 0
