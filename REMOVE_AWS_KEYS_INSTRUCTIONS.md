# Remove AWS Credentials from Git History

GitHub Push Protection has detected AWS credentials in your git history:
- **Access Key ID**: `AKIA36OR25C2GKXHDJP4`
- **Secret Access Key**: `rPE7dcsPv63lRhTkUJwZ+7G7Gef43yu34ZEeydL`

These keys are **COMPROMISED** and must be rotated immediately in AWS IAM.

## Option 1: Using BFG Repo-Cleaner (Recommended)

BFG is the fastest and safest tool for removing sensitive data from git history.

### Steps:

1. **Download BFG Repo-Cleaner**:
   - Download from: https://rtyley.github.io/bfg-repo-cleaner/
   - Or install via Java: `java -jar bfg.jar`

2. **Create a replacements file** (`replacements.txt`):
   ```
   AKIA36OR25C2GKXHDJP4==>process.env.S3_ACCESS_KEY_ID || ""
   rPE7dcsPv63lRhTkUJwZ+7G7Gef43yu34ZEeydL==>process.env.S3_SECRET_ACCESS_KEY || ""
   ```

3. **Run BFG**:
   ```bash
   java -jar bfg.jar --replace-text replacements.txt
   ```

4. **Clean up and force push**:
   ```bash
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push origin --force --all
   ```

## Option 2: Using git filter-branch (Manual)

If BFG is not available, you can use git filter-branch:

```bash
# On Git Bash (not PowerShell)
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --force --index-filter \
  "git checkout HEAD -- 'app/api/file-preview/route.ts' && \
   python -c \"
import sys, re
with open('app/api/file-preview/route.ts', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('AKIA36OR25C2GKXHDJP4', 'process.env.S3_ACCESS_KEY_ID || \"\"')
content = content.replace('rPE7dcsPv63lRhTkUJwZ+7G7Gef43yu34ZEeydL', 'process.env.S3_SECRET_ACCESS_KEY || \"\"')
with open('app/api/file-preview/route.ts', 'w', encoding='utf-8') as f:
    f.write(content)
\" && git add 'app/api/file-preview/route.ts'" \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## Option 3: Use git filter-repo (Alternative)

1. Install git-filter-repo:
   ```bash
   pip install git-filter-repo
   ```

2. Create a Python script to replace credentials:
   ```python
   # replace_in_file.py
   import sys
   import re
   
   file_path = 'app/api/file-preview/route.ts'
   try:
       with open(file_path, 'r', encoding='utf-8') as f:
           content = f.read()
       content = content.replace('AKIA36OR25C2GKXHDJP4', 'process.env.S3_ACCESS_KEY_ID || ""')
       content = content.replace('rPE7dcsPv63lRhTkUJwZ+7G7Gef43yu34ZEeydL', 'process.env.S3_SECRET_ACCESS_KEY || ""')
       with open(file_path, 'w', encoding='utf-8') as f:
           f.write(content)
   except:
       pass
   ```

3. Run filter-repo:
   ```bash
   git filter-repo --path app/api/file-preview/route.ts --invert-paths
   git filter-repo --path app/api/file-preview/route.ts --to-subdirectory-filter app/api/file-preview
   # Then restore the file with replacements
   ```

## ⚠️ CRITICAL: Rotate AWS Credentials

**Before or immediately after removing from git history:**

1. Log into AWS Console → IAM
2. Find the Access Key: `AKIA36OR25C2GKXHDJP4`
3. **Delete** the access key immediately
4. Create a new access key
5. Update your environment variables with the new credentials

## After Cleaning History

1. Verify credentials are gone:
   ```bash
   git log --all --full-history -p | grep -i "AKIA36OR25C2GKXHDJP4"
   ```
   (Should return nothing)

2. Force push to remote (coordinate with your team first!):
   ```bash
   git push origin --force --all
   ```

3. **WARN YOUR TEAM** that history has been rewritten - they'll need to re-clone or rebase.

