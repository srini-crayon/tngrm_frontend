#!/bin/sh
# Simple script to replace AWS credentials in file-preview/route.ts

FILE="app/api/file-preview/route.ts"

if [ -f "$FILE" ]; then
    # Use Python to do the replacement (works on Windows with Git Bash)
    python -c "
import sys
try:
    with open('$FILE', 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('AKIA36OR25C2GKXHDJP4', 'process.env.S3_ACCESS_KEY_ID || \"\"')
    content = content.replace('rPE7dcsPv63lRhTkUJwZ+7G7Gef43yu34ZEeydL', 'process.env.S3_SECRET_ACCESS_KEY || \"\"')
    with open('$FILE', 'w', encoding='utf-8') as f:
        f.write(content)
except:
    pass
" 2>/dev/null || python3 -c "
import sys
try:
    with open('$FILE', 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace('AKIA36OR25C2GKXHDJP4', 'process.env.S3_ACCESS_KEY_ID || \"\"')
    content = content.replace('rPE7dcsPv63lRhTkUJwZ+7G7Gef43yu34ZEeydL', 'process.env.S3_SECRET_ACCESS_KEY || \"\"')
    with open('$FILE', 'w', encoding='utf-8') as f:
        f.write(content)
except:
    pass
" 2>/dev/null || true
fi

