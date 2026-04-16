@echo off
setlocal
set "ROOT=%~dp0.."
cd /d "%ROOT%"

rem After reboot the Next.js dev server is not running, so localhost fails.
rem This script is meant for the Windows Startup folder: start the server only
rem (no browser). Open http://localhost:3000 yourself when you want.

netstat -ano 2>nul | findstr ":3000" 2>nul | findstr "LISTENING" >nul
if not errorlevel 1 (
  exit /b 0
)

if not exist "node_modules\" (
  call npm install
  if errorlevel 1 exit /b 1
)

start /min "ERP Portfolio (Next.js)" cmd /k "cd /d %ROOT% && npm run dev"
endlocal
exit /b 0
