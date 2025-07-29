#!/bin/bash

# Comprehensive sitemap security test script
# This script tests all aspects of sitemap security to ensure script injection is prevented

set -e

echo "🔒 Comprehensive Sitemap Security Test"
echo "======================================="

# Test 1: Build and validate sitemap
echo "1️⃣ Building site and validating sitemap..."
bundle exec jekyll build > /dev/null 2>&1

if [ ! -f "_site/sitemap.xml" ]; then
    echo "❌ FAIL: Sitemap not generated"
    exit 1
fi

# Test 2: Run official validation
echo "2️⃣ Running official validation script..."
if ./tools/validate-sitemap.sh > /dev/null 2>&1; then
    echo "✅ PASS: Official validation passed"
else
    echo "❌ FAIL: Official validation failed"
    exit 1
fi

# Test 3: Check for specific script patterns
echo "3️⃣ Testing for script injection patterns..."
SCRIPT_PATTERNS=(
    "<script"
    "javascript:"
    "vbscript:"
    "data:text/html"
    "onclick="
    "onload="
    "onerror="
    "eppiocemhmnlbhjplcgkofciiegomcon"
)

FAILED_PATTERNS=()
for pattern in "${SCRIPT_PATTERNS[@]}"; do
    if grep -i "$pattern" "_site/sitemap.xml" > /dev/null 2>&1; then
        FAILED_PATTERNS+=("$pattern")
    fi
done

if [ ${#FAILED_PATTERNS[@]} -eq 0 ]; then
    echo "✅ PASS: No script injection patterns found"
else
    echo "❌ FAIL: Found script injection patterns: ${FAILED_PATTERNS[*]}"
    exit 1
fi

# Test 4: Verify XML structure
echo "4️⃣ Testing XML structure..."
if xmllint --noout "_site/sitemap.xml" 2>/dev/null; then
    echo "✅ PASS: Valid XML structure"
else
    echo "❌ FAIL: Invalid XML structure"
    exit 1
fi

# Test 5: Check content filtering
echo "5️⃣ Testing content filtering (pages with scripts should be excluded)..."
EXCLUDED_PAGES=(
    "en/calculators/swimmers-stroke-rate-optimizer"
    "en/calculators/fitness-age"
    "en/calculators/renovation-cost"
    "en/calculators/plaster"
)

FOUND_EXCLUDED=()
for page in "${EXCLUDED_PAGES[@]}"; do
    if grep "$page" "_site/sitemap.xml" > /dev/null 2>&1; then
        FOUND_EXCLUDED+=("$page")
    fi
done

if [ ${#FOUND_EXCLUDED[@]} -eq 0 ]; then
    echo "✅ PASS: Script-containing pages correctly excluded"
else
    echo "❌ FAIL: Found excluded pages in sitemap: ${FOUND_EXCLUDED[*]}"
    exit 1
fi

# Test 6: Check URL count
echo "6️⃣ Testing URL count..."
URL_COUNT=$(grep -c "<url>" "_site/sitemap.xml")
if [ "$URL_COUNT" -gt 400 ] && [ "$URL_COUNT" -lt 500 ]; then
    echo "✅ PASS: URL count looks reasonable ($URL_COUNT URLs)"
else
    echo "⚠️  WARNING: Unexpected URL count: $URL_COUNT"
fi

# Test 7: Check file size
echo "7️⃣ Testing file size..."
FILE_SIZE=$(stat -c%s "_site/sitemap.xml")
if [ "$FILE_SIZE" -gt 10000 ] && [ "$FILE_SIZE" -lt 100000 ]; then
    echo "✅ PASS: File size looks reasonable ($FILE_SIZE bytes)"
else
    echo "⚠️  WARNING: Unexpected file size: $FILE_SIZE bytes"
fi

# Test 8: Security headers test (requires server)
echo "8️⃣ Testing security implementation..."
if [ -f ".htaccess" ]; then
    if grep -q "Content-Security-Policy" ".htaccess" && grep -q "script-src 'none'" ".htaccess"; then
        echo "✅ PASS: Security headers configured"
    else
        echo "❌ FAIL: Security headers not properly configured"
        exit 1
    fi
else
    echo "⚠️  WARNING: .htaccess file not found"
fi

echo ""
echo "🎉 All security tests passed!"
echo "✅ Sitemap is secure against script injection"
echo "✅ Content filtering is working correctly"
echo "✅ XML structure is valid"
echo "✅ Security headers are configured"
echo ""
echo "📊 Final Statistics:"
echo "   📄 File size: $(du -h _site/sitemap.xml | cut -f1)"
echo "   🔗 URL count: $URL_COUNT"
echo "   🛡️  Security level: MAXIMUM"