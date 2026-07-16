#!/usr/bin/env bash
set -euo pipefail
branches=(
  develop feature/project-structure feature/database-schema feature/backend-auth
  feature/backend-applications feature/backend-bidding feature/applicant-module
  feature/loan-officer-module feature/admin-module feature/document-upload
  feature/disbursement-proof feature/repayment-payment feature/notifications-logging
  test/integration-testing
)
git checkout main
git pull origin main
for branch in "${branches[@]}"; do
  git branch "$branch" 2>/dev/null || true
  git push -u origin "$branch"
done
git checkout develop
echo "Branches created and pushed. Current branch: develop"
