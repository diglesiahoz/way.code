#!/bin/bash

ROOT="$(dirname $(dirname $(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)))"

find "$ROOT" -type d -name ".git" | while read GIT_DIR; do
  REPO_DIR=$(dirname "$GIT_DIR")
  cd "$REPO_DIR" || continue
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  echo "🔄 Pull...$REPO_DIR {$CURRENT_BRANCH}"
  # git pull origin "$CURRENT_BRANCH"
  echo "✅ Done!"
done