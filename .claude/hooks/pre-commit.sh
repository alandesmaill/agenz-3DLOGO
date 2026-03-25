#!/bin/bash
# Pre-commit hook for Agenz Website
# Runs type check, lint, and tests before allowing a commit

set -e

echo "Running pre-commit checks..."

# TypeScript type check
echo "→ Type check..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "✗ TypeScript errors found. Commit aborted."
  exit 2
fi

# ESLint on staged .ts/.tsx files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$' || true)
if [ -n "$STAGED_FILES" ]; then
  echo "→ Linting staged files..."
  echo "$STAGED_FILES" | xargs npx eslint
  if [ $? -ne 0 ]; then
    echo "✗ ESLint errors found. Commit aborted."
    exit 2
  fi
fi

# Jest unit tests
echo "→ Running tests..."
npm test -- --silent --passWithNoTests
if [ $? -ne 0 ]; then
  echo "✗ Tests failed. Commit aborted."
  exit 2
fi

echo "✓ All pre-commit checks passed."
exit 0
