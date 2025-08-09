#!/bin/bash

# Validate Calculator Pages in Sitemap
# This script ensures all calculator pages are included in the sitemap

echo "🔍 Validating Calculator Pages in Sitemap"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SITEMAP_FILE="_site/sitemap.xml"
ERROR_COUNT=0

# Check if sitemap exists
if [ ! -f "$SITEMAP_FILE" ]; then
    echo -e "${RED}❌ Sitemap file not found: $SITEMAP_FILE${NC}"
    echo "Please run 'bundle exec jekyll build' first."
    exit 1
fi

echo -e "${GREEN}✅ Sitemap file found${NC}"
echo ""

# Get all calculator markdown files
CALCULATOR_FILES=($(find calculators/ en/calculators/ -name "*.md" -type f 2>/dev/null))

if [ ${#CALCULATOR_FILES[@]} -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No calculator files found${NC}"
    exit 0
fi

echo "📊 Found ${#CALCULATOR_FILES[@]} calculator files to validate"
echo ""

# Check each calculator file
for file in "${CALCULATOR_FILES[@]}"; do
    # Get the expected URL from the file path
    if [[ $file == calculators/* ]]; then
        # Ukrainian calculator: calculators/filename.md -> /calculators/filename.html
        expected_url="calculators/$(basename "$file" .md).html"
    elif [[ $file == en/calculators/* ]]; then
        # English calculator: en/calculators/filename.md -> /en/calculators/filename/
        expected_url="en/calculators/$(basename "$file" .md)/"
    else
        continue
    fi
    
    # Check if URL is in sitemap
    if grep -q "$expected_url" "$SITEMAP_FILE"; then
        echo -e "${GREEN}✅${NC} $expected_url"
    else
        echo -e "${RED}❌ MISSING:${NC} $expected_url (source: $file)"
        ERROR_COUNT=$((ERROR_COUNT + 1))
    fi
done

echo ""
echo "📈 Summary:"
echo "  Total calculator files checked: ${#CALCULATOR_FILES[@]}"
echo "  Missing from sitemap: $ERROR_COUNT"

# Check for security filtering working
echo ""
echo "🔒 Security Validation:"

# Check that sitemap doesn't contain malicious patterns
if grep -qi "javascript:\|vbscript:" "$SITEMAP_FILE"; then
    echo -e "${RED}❌ Found javascript:/vbscript: patterns in sitemap${NC}"
    ERROR_COUNT=$((ERROR_COUNT + 1))
else
    echo -e "${GREEN}✅ No javascript:/vbscript: patterns found${NC}"
fi

if grep -qi '<script id=".*"/>' "$SITEMAP_FILE"; then
    echo -e "${RED}❌ Found script injection patterns in sitemap${NC}"
    ERROR_COUNT=$((ERROR_COUNT + 1))
else
    echo -e "${GREEN}✅ No script injection patterns found${NC}"
fi

if grep -qi '<script></script>' "$SITEMAP_FILE"; then
    echo -e "${RED}❌ Found empty script tags in sitemap${NC}"
    ERROR_COUNT=$((ERROR_COUNT + 1))
else
    echo -e "${GREEN}✅ No empty script tags found${NC}"
fi

# Final result
echo ""
if [ $ERROR_COUNT -eq 0 ]; then
    echo -e "${GREEN}🎉 All validation checks passed!${NC}"
    echo "All calculator pages are properly included in the sitemap."
    exit 0
else
    echo -e "${RED}💥 $ERROR_COUNT validation errors found!${NC}"
    echo "Some calculator pages are missing from the sitemap or security issues detected."
    exit 1
fi