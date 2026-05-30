# Troubleshooting Next.js Turbopack Compiler Crash on Windows

If you are developing this project on Windows using Next.js with **Turbopack** (`next dev --turbo`), you may occasionally experience a compilation lockup or crash. 

---

## 🔍 Symptoms
1. **Browser Overlay Error**:
   ```text
   An unexpected Turbopack error occurred. Please see the output of `next dev` for more details.
       at getServerError (file://.../.next/dev/static/chunks/node_modules_next_dist_...)
   ```
2. **Terminal Output**:
   * RocksDB compactions or database write conflicts.
   * `RocksDB error: Another write batch or compaction is already active on the database.`
   * Background compiler processes timing out during CSS compilation (Tailwind v4 with PostCSS).
3. **Port Conflicts**:
   * Terminal warns that port `3000` is already in use, or requests fail to load even when the dev server is restarted.

---

## 💡 Root Cause
Next.js's Rust-based Turbopack bundler spawns Node.js subprocesses to compile CSS via PostCSS. On Windows, the IPC channel between Rust and Node can occasionally hang or close abruptly. This leaves **orphaned Node background processes** holding an exclusive file system lock on the `.next` directory's RocksDB cache database and binding port `3000`.

---

## 🛠️ Step-by-Step Resolution

Follow these steps to clean the cache, terminate locked processes, and restart your development environment:

### Step 1: Terminate the Orphaned Process
You must kill the background Node process locking the port and `.next` folder.

**Using PowerShell (Recommended)**:
1. Find the PID of the process listening on port `3000`:
   ```powershell
   netstat -ano | findstr :3000
   ```
2. Terminate the process (replace `<PID>` with the ID from the last column, e.g. `2736`):
   ```powershell
   Stop-Process -Id <PID> -Force
   ```

**Using standard Windows Command Prompt (cmd)**:
```cmd
taskkill /F /IM node.exe
```

---

### Step 2: Delete the Stale Compiler Cache
Delete the `.next` folder to force a complete reset of the Turbopack RocksDB database.

**Using PowerShell**:
```powershell
Remove-Item -Recurse -Force .next
```

**Using Command Prompt or File Explorer**:
Simply delete the `.next` directory located in the project's root folder.

---

### Step 3: Run the Clean Startup
Start the development server with a clean state:
```bash
bun dev
# or
npm run dev
```

---

## ⚡ Quick Copy-Paste Recovery Script (PowerShell)
You can copy and execute this block in your PowerShell terminal to automate the entire recovery process with one click:

```powershell
# 1. Terminate orphaned processes on port 3000
$portCheck = netstat -ano | findstr :3000
if ($portCheck) {
    $pids = @()
    foreach ($line in $portCheck) {
        $parts = $line.Split(' ', [System.StringSplitOptions]::RemoveEmptyEntries)
        if ($parts.Length -ge 5) {
            $pid = $parts[$parts.Length - 1].Trim()
            if ($pid -match '^\d+$') { $pids += $pid }
        }
    }
    $uniquePids = $pids | Select-Object -Unique
    foreach ($pid in $uniquePids) {
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "Killing background process: $($proc.ProcessName) (PID: $pid)..." -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
}

# 2. Purge stale Turbopack caches
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Write-Host "Pristine state restored! Run dev server now." -ForegroundColor Green
} else {
    Write-Host "Cache already clear. Run dev server now." -ForegroundColor Green
}
```
