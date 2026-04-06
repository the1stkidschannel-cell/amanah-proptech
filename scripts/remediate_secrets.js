const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * AMANAH PROPTECH - EMERGENCY SECURITY REMEDIATION SCRIPT
 * 
 * This script audits the repository for the exposed GEMINI_API_KEY.
 * It searches all files (except node_modules) and the git history.
 */

const TARGET_KEY = "REDACTED_BY_AMANAH_SECURITY";
const REDACTED = "REDACTED_BY_AMANAH_SECURITY";

function searchFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (file === 'node_modules' || file === '.next' || file === '.git') continue;

        if (fs.statSync(fullPath).isDirectory()) {
            searchFiles(fullPath);
        } else {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(TARGET_KEY)) {
                console.warn(`[CRITICAL] Leak found in: ${fullPath}`);
                const sanitized = content.split(TARGET_KEY).join(REDACTED);
                fs.writeFileSync(fullPath, sanitized);
                console.log(`[FIXED] Redacted key in: ${fullPath}`);
            }
        }
    }
}

function auditGitHistory() {
    console.log("[SYSTEM] Auditing git history for key messages and diffs...");
    try {
        const result = execSync(`git log --all -S "${TARGET_KEY}"`).toString();
        if (result.trim()) {
            console.warn("[CRITICAL] Leak found in git commit history!");
            console.log(result);
        } else {
            console.log("[SAFE] No matches found in git commit history.");
        }
    } catch (e) {
        console.error("[ERROR] Git audit failed:", e.message);
    }
}

console.log("\n--- AMANAH SECURITY REMEDIATION ---");
console.log(`Searching for: ${TARGET_KEY.substring(0, 8)}...`);

try {
    searchFiles(process.cwd());
    auditGitHistory();
} catch (e) {
    console.error("[ERROR] Remediation failed:", e.message);
}

console.log("\n--- REMEDIATION COMPLETE ---");
console.log("> IMPORTANT: Please REVOKE your key in the Google Cloud Console.");
console.log("> If leaks were found in git history, use 'git filter-repo' to sanitize your remote.");
