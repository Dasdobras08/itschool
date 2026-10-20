#!/usr/bin/env bash
# Applies the migrations to a throwaway database and runs the RLS tests.
# Needs a Postgres you can reach with psql (PGHOST, PGUSER, PGPASSWORD...).
set -euo pipefail

DB="${TEST_DB:-itschool_test}"
export PGOPTIONS="${PGOPTIONS:-} -c client_min_messages=warning"
cd "$(dirname "$0")/.."

psql -v ON_ERROR_STOP=1 -q -d postgres -c "drop database if exists ${DB};" -c "create database ${DB};"

run() { psql -v ON_ERROR_STOP=1 -q -X -o /dev/null -d "${DB}" -f "$1"; }

run db-tests/00_auth_stub.sql
for migration in supabase/migrations/*.sql; do
  run "${migration}"
done
for test in db-tests/[1-9]*.sql; do
  echo "→ ${test}"
  run "${test}"
done

psql -q -d postgres -c "drop database ${DB};"
