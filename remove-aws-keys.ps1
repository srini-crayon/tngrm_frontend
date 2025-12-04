# PowerShell script to remove AWS credentials from git history
# Run this script in PowerShell

Write-Host "Removing AWS credentials from git history..." -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: This will rewrite git history!" -ForegroundColor Red
Write-Host "Make sure you have a backup and coordinate with your team." -ForegroundColor Red
Write-Host ""

$confirmation = Read-Host "Continue? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "Aborted." -ForegroundColor Yellow
    exit 1
}

# Set environment variable to suppress filter-branch warning
$env:FILTER_BRANCH_SQUELCH_WARNING = "1"

# Make sure the Python script is executable
if (Test-Path "sanitize_aws_keys.py") {
    Write-Host "Running git filter-branch with Python script..." -ForegroundColor Green
    
    # Run filter-branch using Git Bash if available, otherwise use git directly
    $gitCommand = @"
git filter-branch --force --tree-filter 'python sanitize_aws_keys.py || python3 sanitize_aws_keys.py || true' --prune-empty --tag-name-filter cat -- --all
"@
    
    # Try to execute via Git Bash if available
    $gitBashPath = "C:\Program Files\Git\bin\bash.exe"
    if (Test-Path $gitBashPath) {
        Write-Host "Using Git Bash..." -ForegroundColor Green
        & $gitBashPath -c $gitCommand
    } else {
        Write-Host "Git Bash not found. Trying direct execution..." -ForegroundColor Yellow
        # This might not work in PowerShell, but let's try
        Invoke-Expression $gitCommand
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Cleaning up backup refs..." -ForegroundColor Green
        git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
        
        Write-Host "Running garbage collection..." -ForegroundColor Green
        git reflog expire --expire=now --all
        git gc --prune=now --aggressive
        
        Write-Host ""
        Write-Host "✓ AWS credentials removed from git history!" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  CRITICAL NEXT STEPS:" -ForegroundColor Red
        Write-Host "1. Rotate the AWS credentials in AWS IAM:" -ForegroundColor Yellow
        Write-Host "   - Access Key ID: AKIA36OR25C2GKXHDJP4" -ForegroundColor Yellow
        Write-Host "   - Delete this key immediately!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "2. Verify credentials are gone:" -ForegroundColor Yellow
        Write-Host "   git log --all --full-history -p | Select-String 'AKIA36OR25C2GKXHDJP4'" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "3. Force push to remote (coordinate with team first!):" -ForegroundColor Yellow
        Write-Host "   git push origin --force --all" -ForegroundColor Yellow
    } else {
        Write-Host ""
        Write-Host "✗ Error running git filter-branch" -ForegroundColor Red
        Write-Host "Please see REMOVE_AWS_KEYS_INSTRUCTIONS.md for manual instructions." -ForegroundColor Yellow
    }
} else {
    Write-Host "Error: sanitize_aws_keys.py not found!" -ForegroundColor Red
    Write-Host "Please ensure sanitize_aws_keys.py is in the repository root." -ForegroundColor Yellow
    exit 1
}

