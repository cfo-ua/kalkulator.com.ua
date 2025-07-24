#!/bin/bash

# Script to delete all copilot branches from cfo-ua/kalkulator.com.ua repository
# This script should be run by someone with push access to the repository
# 
# Usage: ./cleanup_branches.sh
# 
# This will delete 95 copilot/fix-* branches that are no longer needed.
# Only the main branch will remain after cleanup.

set -e

echo "==============================================="
echo "Branch Cleanup Script for kalkulator.com.ua"
echo "==============================================="
echo ""
echo "This script will delete 95 copilot branches from the repository."
echo "Only the 'main' branch will remain after cleanup."
echo ""

# Verify we're in the right repository
if ! git remote -v | grep -q "cfo-ua/kalkulator.com.ua"; then
    echo "Error: This script must be run from the cfo-ua/kalkulator.com.ua repository!"
    exit 1
fi

# Count current copilot branches
branch_count=$(git ls-remote origin | grep "refs/heads/copilot" | wc -l)
echo "Found $branch_count copilot branches to delete."
echo ""

if [ "$branch_count" -eq 0 ]; then
    echo "No copilot branches found. Cleanup may have already been completed."
    exit 0
fi

# List branches to be deleted
echo "Branches to be deleted:"
git ls-remote origin | grep "refs/heads/copilot" | awk '{print $2}' | sed 's|refs/heads/||' | sort

echo ""
echo "WARNING: This action cannot be undone!"
read -p "Are you sure you want to delete all these branches? (y/N): " -r

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted by user."
    exit 1
fi

echo ""
echo "Deleting copilot branches..."

# Delete all copilot branches
deleted_count=0
failed_count=0

git ls-remote origin | grep "refs/heads/copilot" | awk '{print $2}' | sed 's|refs/heads/||' | while read branch; do
    echo -n "Deleting: $branch ... "
    if git push origin --delete "$branch" 2>/dev/null; then
        echo "✓ deleted"
        ((deleted_count++))
    else
        echo "✗ failed"
        ((failed_count++))
    fi
done

echo ""
echo "==============================================="
echo "Branch cleanup complete!"
echo "==============================================="
echo ""
echo "Remaining branches in repository:"
git ls-remote origin | grep "refs/heads/" | awk '{print $2}' | sed 's|refs/heads/||'
echo ""
echo "The repository now contains only the essential main branch."
echo "GitHub Pages deployment will continue working from the main branch."