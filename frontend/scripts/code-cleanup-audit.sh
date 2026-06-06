#!/bin/bash
# ============================================================
# PointDrop Frontend — Code Cleanup Audit Script
# Етап 6: Реліз-менеджмент та Code Freeze
# ============================================================
# Запуск: bash scripts/code-cleanup-audit.sh
# ============================================================

set -e

FRONTEND_SRC="$(dirname "$0")/../src"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}   PointDrop — Code Cleanup Audit (Stage 6)${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
echo ""

ISSUES=0

# --- 1. console.log ---
echo -e "${YELLOW}🔍 1. Пошук console.log...${NC}"
FOUND=$(grep -rn "console\.log" "$FRONTEND_SRC" --include="*.jsx" --include="*.js" | grep -v "\.spec\." | grep -v "/test/" || true)
if [ -n "$FOUND" ]; then
  echo -e "${RED}   ❌ Знайдено console.log:${NC}"
  echo "$FOUND" | sed 's/^/   /'
  ISSUES=$((ISSUES + $(echo "$FOUND" | wc -l)))
else
  echo -e "${GREEN}   ✅ console.log не знайдено${NC}"
fi
echo ""

# --- 2. console.error ---
echo -e "${YELLOW}🔍 2. Пошук console.error (крім ErrorBoundary DEV)...${NC}"
FOUND=$(grep -rn "console\.error" "$FRONTEND_SRC" --include="*.jsx" --include="*.js" | grep -v "\.spec\." | grep -v "/test/" | grep -v "ErrorBoundary" || true)
if [ -n "$FOUND" ]; then
  echo -e "${RED}   ❌ Знайдено console.error:${NC}"
  echo "$FOUND" | sed 's/^/   /'
  ISSUES=$((ISSUES + $(echo "$FOUND" | wc -l)))
else
  echo -e "${GREEN}   ✅ console.error не знайдено (окрім ErrorBoundary DEV)${NC}"
fi
echo ""

# --- 3. console.warn ---
echo -e "${YELLOW}🔍 3. Пошук console.warn...${NC}"
FOUND=$(grep -rn "console\.warn" "$FRONTEND_SRC" --include="*.jsx" --include="*.js" | grep -v "\.spec\." | grep -v "/test/" || true)
if [ -n "$FOUND" ]; then
  echo -e "${RED}   ❌ Знайдено console.warn:${NC}"
  echo "$FOUND" | sed 's/^/   /'
  ISSUES=$((ISSUES + $(echo "$FOUND" | wc -l)))
else
  echo -e "${GREEN}   ✅ console.warn не знайдено${NC}"
fi
echo ""

# --- 4. TODO / FIXME / HACK ---
echo -e "${YELLOW}🔍 4. Пошук TODO / FIXME / HACK...${NC}"
FOUND=$(grep -rniE "(TODO|FIXME|HACK|XXX)" "$FRONTEND_SRC" --include="*.jsx" --include="*.js" | grep -v "\.spec\." | grep -v "/test/" | grep -v "node_modules" || true)
if [ -n "$FOUND" ]; then
  echo -e "${RED}   ❌ Знайдено TODO/FIXME/HACK:${NC}"
  echo "$FOUND" | sed 's/^/   /'
  ISSUES=$((ISSUES + $(echo "$FOUND" | wc -l)))
else
  echo -e "${GREEN}   ✅ TODO/FIXME/HACK не знайдено${NC}"
fi
echo ""

# --- 5. Хардкоджені UUID ---
echo -e "${YELLOW}🔍 5. Пошук хардкоджених UUID (можливий mock data)...${NC}"
FOUND=$(grep -rnE "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}" "$FRONTEND_SRC" --include="*.jsx" --include="*.js" | grep -v "\.spec\." | grep -v "/test/" || true)
if [ -n "$FOUND" ]; then
  echo -e "${YELLOW}   ⚠️  Потенційні хардкоджені UUID (перевірте вручну):${NC}"
  echo "$FOUND" | sed 's/^/   /'
else
  echo -e "${GREEN}   ✅ Хардкоджені UUID не знайдено${NC}"
fi
echo ""

# --- 6. Mock JSON файли ---
echo -e "${YELLOW}🔍 6. Пошук .json файлів з mock-даними...${NC}"
FOUND=$(find "$FRONTEND_SRC" -name "*.json" -not -path "*/node_modules/*" | grep -v "package" || true)
if [ -n "$FOUND" ]; then
  echo -e "${YELLOW}   ⚠️  Знайдено JSON файли (перевірте чи не mock):${NC}"
  echo "$FOUND" | sed 's/^/   /'
else
  echo -e "${GREEN}   ✅ Mock JSON файлів не знайдено${NC}"
fi
echo ""

# --- 7. alert() ---
echo -e "${YELLOW}🔍 7. Пошук alert() (не для production)...${NC}"
FOUND=$(grep -rn "alert(" "$FRONTEND_SRC" --include="*.jsx" --include="*.js" | grep -v "\.spec\." | grep -v "/test/" || true)
if [ -n "$FOUND" ]; then
  echo -e "${RED}   ❌ Знайдено alert():${NC}"
  echo "$FOUND" | sed 's/^/   /'
  ISSUES=$((ISSUES + $(echo "$FOUND" | wc -l)))
else
  echo -e "${GREEN}   ✅ alert() не знайдено${NC}"
fi
echo ""

# --- Підсумок ---
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
if [ $ISSUES -gt 0 ]; then
  echo -e "${RED}   ❌ Знайдено $ISSUES проблем(и), що потребують виправлення${NC}"
else
  echo -e "${GREEN}   ✅ Код чистий — готовий до Code Freeze!${NC}"
fi
echo -e "${CYAN}════════════════════════════════════════════════════${NC}"
echo ""

exit $ISSUES
