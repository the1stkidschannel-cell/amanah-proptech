@echo off
TITLE AMANAH PROPTECH 500M SCALING ENGINE
color 0A
echo.
echo  ============================================================
echo  [AMANAH PROPTECH] AUTONOMOUS 500M SCALING ENGINE
echo  ============================================================
echo.
echo  WICHTIG: Stelle sicher, dass der Next.js Dev-Server laeuft!
echo  (In einem anderen Terminal: npm run dev)
echo.
echo  Wahl:
echo  [1] DRY-RUN   - Keine echten E-Mails (sicherer Test)
echo  [2] LIVE      - Echte E-Mails via Resend API
echo  [3] EINMALIG  - Ein Zyklus, dann beenden (Dry-Run)
echo  [4] BEENDEN
echo.
set /p choice="Deine Wahl (1/2/3/4): "

if "%choice%"=="1" goto dryrun
if "%choice%"=="2" goto live
if "%choice%"=="3" goto once
if "%choice%"=="4" goto end

:dryrun
echo.
echo  [DRY-RUN] Starte Engine im Testmodus...
echo  ============================================================
node scripts/autonomous_loop.js --dry-run
goto end

:live
echo.
echo  [LIVE] Starte autonome Engine...
echo  WARNUNG: Echte E-Mails werden gesendet!
echo  Sicherstellen: RESEND_API_KEY in .env.local gesetzt?
echo  ============================================================
node scripts/autonomous_loop.js
goto end

:once
echo.
echo  [EINMALIG] Fuehre einen Zyklus aus (Dry-Run)...
echo  ============================================================
node scripts/autonomous_loop.js --dry-run --once
goto end

:end
echo.
echo  Engine gestoppt.
pause
