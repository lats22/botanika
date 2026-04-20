#!/bin/bash

# Dev/Prod Sync Validation Script for Botanika
# Compares local development files with VPS production

VPS_HOST="root@72.62.64.54"
VPS_PROJECT="/root/botanika"
LOCAL_PROJECT="$(cd "$(dirname "$0")/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
SYNC_COUNT=0
OUT_OF_SYNC_COUNT=0
MISSING_LOCAL=0
MISSING_VPS=0

echo ""
echo "🔍 Dev/Prod Sync Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Local:  $LOCAL_PROJECT"
echo "VPS:    $VPS_HOST:$VPS_PROJECT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to get local file checksum
get_local_checksum() {
    local file="$1"
    if [ -f "$file" ]; then
        if command -v md5sum &> /dev/null; then
            md5sum "$file" 2>/dev/null | awk '{print $1}'
        elif command -v md5 &> /dev/null; then
            md5 -q "$file" 2>/dev/null
        else
            # Fallback for Windows/Git Bash
            cat "$file" 2>/dev/null | md5sum | awk '{print $1}'
        fi
    else
        echo "FILE_NOT_FOUND"
    fi
}

# Function to get VPS file checksum
get_vps_checksum() {
    local file="$1"
    ssh -o ConnectTimeout=10 -o BatchMode=yes $VPS_HOST "md5sum '$VPS_PROJECT/$file' 2>/dev/null | awk '{print \$1}'" 2>/dev/null || echo "FILE_NOT_FOUND"
}

# Function to compare a file
compare_file() {
    local relative_path="$1"
    local display_name="$2"

    local local_checksum=$(get_local_checksum "$LOCAL_PROJECT/$relative_path")
    local vps_checksum=$(get_vps_checksum "$relative_path")

    if [ "$local_checksum" = "FILE_NOT_FOUND" ]; then
        echo -e "${YELLOW}⚠️  $display_name: MISSING LOCALLY${NC}"
        ((MISSING_LOCAL++))
        return
    fi

    if [ "$vps_checksum" = "FILE_NOT_FOUND" ] || [ -z "$vps_checksum" ]; then
        echo -e "${YELLOW}⚠️  $display_name: MISSING ON VPS${NC}"
        ((MISSING_VPS++))
        return
    fi

    if [ "$local_checksum" = "$vps_checksum" ]; then
        echo -e "${GREEN}✅ $display_name: In sync${NC}"
        ((SYNC_COUNT++))
    else
        echo -e "${RED}❌ $display_name: OUT OF SYNC${NC}"
        echo -e "   Local:  ${local_checksum:0:12}..."
        echo -e "   VPS:    ${vps_checksum:0:12}..."
        ((OUT_OF_SYNC_COUNT++))
    fi
}

# Function to compare JSON version
compare_json_version() {
    local relative_path="$1"
    local display_name="$2"

    local local_version=$(cat "$LOCAL_PROJECT/$relative_path" 2>/dev/null | grep '"version"' | head -1 | sed 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
    local vps_version=$(ssh -o ConnectTimeout=10 -o BatchMode=yes $VPS_HOST "cat '$VPS_PROJECT/$relative_path' 2>/dev/null | grep '\"version\"' | head -1 | sed 's/.*\"version\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/'" 2>/dev/null)

    if [ -z "$local_version" ]; then
        echo -e "${YELLOW}⚠️  $display_name: MISSING LOCALLY${NC}"
        ((MISSING_LOCAL++))
        return
    fi

    if [ -z "$vps_version" ]; then
        echo -e "${YELLOW}⚠️  $display_name: MISSING ON VPS${NC}"
        ((MISSING_VPS++))
        return
    fi

    if [ "$local_version" = "$vps_version" ]; then
        echo -e "${GREEN}✅ $display_name: In sync (v$local_version)${NC}"
        ((SYNC_COUNT++))
    else
        echo -e "${RED}❌ $display_name: VERSION MISMATCH${NC}"
        echo -e "   Local:  v$local_version"
        echo -e "   VPS:    v$vps_version"
        ((OUT_OF_SYNC_COUNT++))
    fi
}

# Test VPS connection
echo "Testing VPS connection..."
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes $VPS_HOST "echo 'connected'" &>/dev/null; then
    echo -e "${RED}❌ Cannot connect to VPS. Check SSH key and network.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ VPS connection established${NC}"
echo ""

# === Package.json Versions ===
echo "📦 Package Versions"
echo "─────────────────────────────────────────────────"
compare_json_version "frontend/package.json" "package.json (frontend)"
compare_json_version "backend/package.json" "package.json (backend)"
echo ""

# === Config Files ===
echo "⚙️  Config Files"
echo "─────────────────────────────────────────────────"
compare_file "docker-compose.yml" "docker-compose.yml"
compare_file "frontend/nginx.conf" "frontend/nginx.conf"
compare_file "frontend/index.html" "frontend/index.html"
echo ""

# === Backend Files ===
echo "🖥️  Backend Files"
echo "─────────────────────────────────────────────────"
compare_file "backend/server.js" "backend/server.js"
echo ""

# === Frontend Components (JSX) ===
echo "⚛️  Frontend Components (JSX)"
echo "─────────────────────────────────────────────────"
for file in "$LOCAL_PROJECT"/frontend/src/components/*.jsx; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        compare_file "frontend/src/components/$filename" "$filename"
    fi
done
echo ""

# === Frontend Styles (CSS) ===
echo "🎨 Frontend Styles (CSS)"
echo "─────────────────────────────────────────────────"
for file in "$LOCAL_PROJECT"/frontend/src/components/*.css; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        compare_file "frontend/src/components/$filename" "$filename"
    fi
done
echo ""

# === Summary ===
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
TOTAL=$((SYNC_COUNT + OUT_OF_SYNC_COUNT + MISSING_LOCAL + MISSING_VPS))
echo "📊 Summary"
echo "─────────────────────────────────────────────────"
echo -e "   ${GREEN}✅ In sync:       $SYNC_COUNT files${NC}"
echo -e "   ${RED}❌ Out of sync:   $OUT_OF_SYNC_COUNT files${NC}"
echo -e "   ${YELLOW}⚠️  Missing local: $MISSING_LOCAL files${NC}"
echo -e "   ${YELLOW}⚠️  Missing VPS:   $MISSING_VPS files${NC}"
echo "   ─────────────────────────────"
echo "   Total checked:  $TOTAL files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $OUT_OF_SYNC_COUNT -eq 0 ] && [ $MISSING_LOCAL -eq 0 ] && [ $MISSING_VPS -eq 0 ]; then
    echo -e "${GREEN}🎉 Result: All files are in sync!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Result: $((OUT_OF_SYNC_COUNT + MISSING_LOCAL + MISSING_VPS)) issues found${NC}"
    exit 1
fi
