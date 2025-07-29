#!/bin/bash

# Sitemap validation script to prevent script injection
# This script should be run after Jekyll build to ensure sitemap is clean

set -e

SITEMAP_FILE="_site/sitemap.xml"
EXIT_CODE=0

echo "🔍 Validating sitemap.xml for security issues..."

# Check if sitemap exists
if [ ! -f "$SITEMAP_FILE" ]; then
    echo "❌ ERROR: Sitemap file not found at $SITEMAP_FILE"
    exit 1
fi

# Check for script tags (case insensitive)
echo "Checking for script tags..."
if grep -i "<script" "$SITEMAP_FILE" > /dev/null; then
    echo "❌ CRITICAL: Script tags found in sitemap:"
    grep -i "<script" "$SITEMAP_FILE" | head -5
    EXIT_CODE=1
else
    echo "✅ No script tags found"
fi

# Check for other suspicious HTML tags
echo "Checking for HTML tags..."
SUSPICIOUS_TAGS=("iframe" "object" "embed" "form" "input" "meta" "link" "style")
for tag in "${SUSPICIOUS_TAGS[@]}"; do
    if grep -i "<$tag" "$SITEMAP_FILE" > /dev/null; then
        echo "⚠️  WARNING: Found <$tag> tag in sitemap"
        grep -i "<$tag" "$SITEMAP_FILE" | head -3
        EXIT_CODE=1
    fi
done

# Check XML structure
echo "Validating XML structure..."
if command -v xmllint >/dev/null 2>&1; then
    if xmllint --noout "$SITEMAP_FILE" 2>/dev/null; then
        echo "✅ Valid XML structure"
    else
        echo "❌ Invalid XML structure"
        EXIT_CODE=1
    fi
else
    echo "⚠️  xmllint not available, skipping XML validation"
fi

# Check for proper XML declaration
if head -1 "$SITEMAP_FILE" | grep -q '<?xml version="1.0" encoding="UTF-8"?>'; then
    echo "✅ Proper XML declaration found"
else
    echo "❌ Missing or incorrect XML declaration"
    echo "First line: $(head -1 "$SITEMAP_FILE")"
    EXIT_CODE=1
fi

# Check for proper sitemap namespace
if grep -q 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' "$SITEMAP_FILE"; then
    echo "✅ Proper sitemap namespace found"
else
    echo "❌ Missing or incorrect sitemap namespace"
    EXIT_CODE=1
fi

# Statistical information
echo "📊 Sitemap statistics:"
echo "  Total lines: $(wc -l < "$SITEMAP_FILE")"
echo "  URL count: $(grep -c "<url>" "$SITEMAP_FILE" || echo "0")"
echo "  File size: $(du -h "$SITEMAP_FILE" | cut -f1)"

# Check for empty URLs
EMPTY_URLS=$(grep -c "<loc></loc>" "$SITEMAP_FILE" || true)
if [ "$EMPTY_URLS" -gt 0 ]; then
    echo "⚠️  WARNING: Found $EMPTY_URLS empty URL entries"
    EXIT_CODE=1
fi

# Final result
if [ $EXIT_CODE -eq 0 ]; then
    echo "🎉 Sitemap validation passed - sitemap is secure and valid!"
else
    echo "💥 Sitemap validation failed - please fix the issues above"
fi

exit $EXIT_CODE