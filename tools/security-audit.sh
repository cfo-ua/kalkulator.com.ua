#!/bin/bash

# Security Audit Scanner for kalkulator.com.ua
# Automated detection of security vulnerabilities and code quality issues

set -e

echo "🔍 SECURITY AUDIT SCANNER"
echo "========================"
echo "Repository: kalkulator.com.ua"
echo "Date: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Counters
CRITICAL_COUNT=0
HIGH_COUNT=0
MEDIUM_COUNT=0
LOW_COUNT=0

# Function to report findings
report_finding() {
    local severity=$1
    local title=$2
    local description=$3
    local file_count=$4
    
    case $severity in
        "CRITICAL")
            echo -e "${RED}🔴 CRITICAL: $title${NC}"
            CRITICAL_COUNT=$((CRITICAL_COUNT + 1))
            ;;
        "HIGH")
            echo -e "${YELLOW}🟡 HIGH: $title${NC}"
            HIGH_COUNT=$((HIGH_COUNT + 1))
            ;;
        "MEDIUM")
            echo -e "${YELLOW}🟡 MEDIUM: $title${NC}"
            MEDIUM_COUNT=$((MEDIUM_COUNT + 1))
            ;;
        "LOW")
            echo -e "${GREEN}🟢 LOW: $title${NC}"
            LOW_COUNT=$((LOW_COUNT + 1))
            ;;
    esac
    
    echo "   Description: $description"
    if [ ! -z "$file_count" ]; then
        echo "   Affected files: $file_count"
    fi
    echo ""
}

echo "1️⃣ SCANNING FOR XSS VULNERABILITIES..."
echo "----------------------------------------"

# Check for innerHTML usage with potential user input
INNERHTML_COUNT=$(find . -name "*.js" -exec grep -l "innerHTML" {} \; | wc -l)
INNERHTML_INSTANCES=$(grep -r "innerHTML" assets/js/ en/js/ js/ 2>/dev/null | wc -l)
report_finding "CRITICAL" "Unsafe innerHTML Usage" "Found $INNERHTML_INSTANCES instances of innerHTML across $INNERHTML_COUNT files. High XSS risk." "$INNERHTML_COUNT files"

# Check for safe DOM methods usage
SAFE_DOM_COUNT=$(find . -name "*.js" -exec grep -l "textContent\|createTextNode" {} \; | wc -l)
if [ $SAFE_DOM_COUNT -lt $((INNERHTML_COUNT / 2)) ]; then
    report_finding "HIGH" "Insufficient Safe DOM Usage" "Only $SAFE_DOM_COUNT files use safe DOM methods vs $INNERHTML_COUNT using innerHTML" "$SAFE_DOM_COUNT files"
fi

echo "2️⃣ SCANNING FOR CODE EXECUTION RISKS..."
echo "----------------------------------------"

# Check for eval and Function constructor
EVAL_COUNT=$(find . -name "*.js" -exec grep -l "eval\|new Function" {} \; 2>/dev/null | wc -l)
if [ $EVAL_COUNT -gt 0 ]; then
    report_finding "CRITICAL" "Code Execution Risk" "Found eval() or Function() constructor usage" "$EVAL_COUNT files"
else
    report_finding "LOW" "No Code Execution Risk" "No eval() or Function() constructor found" "0 files"
fi

echo "3️⃣ SCANNING FOR EXTERNAL DEPENDENCIES..."
echo "----------------------------------------"

# Check for external API calls
EXTERNAL_API_COUNT=$(grep -r "https://.*\..*/" assets/js/ en/js/ js/ 2>/dev/null | grep -v "kalkulator.com.ua" | wc -l)
if [ $EXTERNAL_API_COUNT -gt 0 ]; then
    report_finding "HIGH" "External API Dependencies" "Found $EXTERNAL_API_COUNT external API calls without proper security validation" "$EXTERNAL_API_COUNT instances"
fi

# Check for CDN usage without integrity
CDN_COUNT=$(grep -r "cdn\." assets/js/ en/js/ js/ _layouts/ _includes/ 2>/dev/null | wc -l)
if [ $CDN_COUNT -gt 0 ]; then
    report_finding "MEDIUM" "CDN Without Integrity Checks" "Found $CDN_COUNT CDN references without integrity verification" "$CDN_COUNT instances"
fi

echo "4️⃣ SCANNING FOR DATA STORAGE ISSUES..."
echo "----------------------------------------"

# Check for localStorage usage
LOCALSTORAGE_COUNT=$(find . -name "*.js" -exec grep -l "localStorage\|sessionStorage" {} \; 2>/dev/null | wc -l)
if [ $LOCALSTORAGE_COUNT -gt 0 ]; then
    report_finding "MEDIUM" "Unencrypted Data Storage" "Found $LOCALSTORAGE_COUNT files storing data in browser without encryption" "$LOCALSTORAGE_COUNT files"
fi

echo "5️⃣ SCANNING FOR CRYPTOGRAPHIC ISSUES..."
echo "----------------------------------------"

# Check for weak random number generation
MATH_RANDOM_COUNT=$(find . -name "*.js" -exec grep -l "Math\.random" {} \; 2>/dev/null | wc -l)
CRYPTO_RANDOM_COUNT=$(find . -name "*.js" -exec grep -l "crypto\.getRandomValues\|window\.crypto" {} \; 2>/dev/null | wc -l)

if [ $MATH_RANDOM_COUNT -gt 0 ]; then
    report_finding "HIGH" "Weak Cryptographic Randomness" "Found $MATH_RANDOM_COUNT files using Math.random() instead of crypto.getRandomValues()" "$MATH_RANDOM_COUNT files"
fi

if [ $CRYPTO_RANDOM_COUNT -gt 0 ]; then
    report_finding "LOW" "Secure Randomness Found" "Found $CRYPTO_RANDOM_COUNT files using cryptographically secure randomness" "$CRYPTO_RANDOM_COUNT files"
fi

echo "6️⃣ SCANNING FOR PERFORMANCE ISSUES..."
echo "----------------------------------------"

# Check file sizes and count
JS_FILE_COUNT=$(find . -name "*.js" | wc -l)
LARGE_JS_FILES=$(find . -name "*.js" -size +50k | wc -l)
TOTAL_JS_SIZE=$(find . -name "*.js" -exec cat {} \; | wc -c)

report_finding "MEDIUM" "JavaScript Size Concerns" "Total JS size: $TOTAL_JS_SIZE bytes across $JS_FILE_COUNT files, $LARGE_JS_FILES files >50KB" "$JS_FILE_COUNT files"

echo "7️⃣ SCANNING FOR CONFIGURATION ISSUES..."
echo "----------------------------------------"

# Check for security headers
if [ -f ".htaccess" ]; then
    CSP_COUNT=$(grep -c "Content-Security-Policy" .htaccess 2>/dev/null || echo 0)
    if [ $CSP_COUNT -gt 0 ]; then
        report_finding "LOW" "Security Headers Present" "Found proper CSP configuration in .htaccess" "1 file"
    else
        report_finding "HIGH" "Missing Security Headers" "No Content-Security-Policy found in .htaccess" "1 file"
    fi
fi

# Check for package management
if [ ! -f "package.json" ]; then
    report_finding "MEDIUM" "No JavaScript Package Management" "No package.json found - dependencies managed manually" "0 files"
fi

echo "8️⃣ SCANNING FOR INPUT VALIDATION..."
echo "----------------------------------------"

# Check for input validation patterns
VALIDATION_COUNT=$(grep -r "validate\|sanitize\|escape" assets/js/ en/js/ js/ 2>/dev/null | wc -l)
if [ $VALIDATION_COUNT -lt 50 ]; then
    report_finding "HIGH" "Insufficient Input Validation" "Found only $VALIDATION_COUNT validation instances across $JS_FILE_COUNT JS files" "$VALIDATION_COUNT instances"
fi

echo "================================================"
echo "🔍 SECURITY AUDIT SUMMARY"
echo "================================================"

echo -e "${RED}🔴 CRITICAL Issues: $CRITICAL_COUNT${NC}"
echo -e "${YELLOW}🟡 HIGH Issues: $HIGH_COUNT${NC}"
echo -e "${YELLOW}🟡 MEDIUM Issues: $MEDIUM_COUNT${NC}"
echo -e "${GREEN}🟢 LOW Issues: $LOW_COUNT${NC}"

echo ""
echo "📊 RISK SCORE CALCULATION:"
RISK_SCORE=$((CRITICAL_COUNT * 10 + HIGH_COUNT * 5 + MEDIUM_COUNT * 2 + LOW_COUNT * 1))
echo "   Risk Score: $RISK_SCORE points"

if [ $RISK_SCORE -gt 50 ]; then
    echo -e "   ${RED}🚨 RISK LEVEL: CRITICAL - Immediate action required${NC}"
elif [ $RISK_SCORE -gt 25 ]; then
    echo -e "   ${YELLOW}⚠️  RISK LEVEL: HIGH - Action required within 1-2 weeks${NC}"
elif [ $RISK_SCORE -gt 10 ]; then
    echo -e "   ${YELLOW}⚠️  RISK LEVEL: MEDIUM - Action required within 1 month${NC}"
else
    echo -e "   ${GREEN}✅ RISK LEVEL: LOW - Regular maintenance required${NC}"
fi

echo ""
echo "📋 RECOMMENDED IMMEDIATE ACTIONS:"
if [ $CRITICAL_COUNT -gt 0 ]; then
    echo "   1. Address all CRITICAL issues immediately"
    echo "   2. Implement XSS protection across all calculators"
    echo "   3. Add input sanitization framework"
fi
if [ $HIGH_COUNT -gt 0 ]; then
    echo "   4. Secure external API calls and dependencies"
    echo "   5. Implement proper cryptographic randomness"
    echo "   6. Add comprehensive input validation"
fi

echo ""
echo "💡 NEXT STEPS:"
echo "   1. Review TECH_AUDIT_REPORT.md for detailed analysis"
echo "   2. Implement security fixes based on priority"
echo "   3. Set up continuous security monitoring"
echo "   4. Schedule regular security audits"

echo ""
echo "🏁 Audit completed at $(date)"
echo "================================================"

# Exit with appropriate code based on findings
if [ $CRITICAL_COUNT -gt 0 ]; then
    exit 2  # Critical issues found
elif [ $HIGH_COUNT -gt 0 ]; then
    exit 1  # High issues found  
else
    exit 0  # Success
fi