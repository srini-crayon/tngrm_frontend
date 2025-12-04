#!/usr/bin/env python3
"""
Script to replace AWS credentials in app/api/file-preview/route.ts
This script is used by git filter-branch to clean up git history.
"""
import sys
import os

FILE_PATH = "app/api/file-preview/route.ts"

OLD_ACCESS_KEY = "AKIA36OR25C2GKXHDJP4"
OLD_SECRET_KEY = "rPE7dcsPv63lRhTkUJwZ+7G7Gef43yu34ZEeydL"

NEW_ACCESS_KEY = 'process.env.S3_ACCESS_KEY_ID || ""'
NEW_SECRET_KEY = 'process.env.S3_SECRET_ACCESS_KEY || ""'

def main():
    if not os.path.exists(FILE_PATH):
        # File doesn't exist in this commit, skip
        return 0
    
    try:
        # Read the file
        with open(FILE_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if credentials are present
        if OLD_ACCESS_KEY in content or OLD_SECRET_KEY in content:
            # Replace credentials
            content = content.replace(OLD_ACCESS_KEY, NEW_ACCESS_KEY)
            content = content.replace(OLD_SECRET_KEY, NEW_SECRET_KEY)
            
            # Write back
            with open(FILE_PATH, 'w', encoding='utf-8') as f:
                f.write(content)
    except Exception as e:
        # Silently fail if there's an error (file might not exist in some commits)
        pass
    
    return 0

if __name__ == "__main__":
    sys.exit(main())

