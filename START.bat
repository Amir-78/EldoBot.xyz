@echo off
title ELDOBOT â€” Auto-Offer Engine
color 0A
cls
echo.
echo  ===========================================
echo       ELDOBOT  ^|  Auto-Offer Engine
echo  ===========================================
echo.

REM --- Check if key already set ---
if not exist license.key goto ASKKEY
set /p CURKEY=<license.key
if "%CURKEY%"=="PASTE_YOUR_LICENSE_KEY_HERE" goto ASKKEY
if "%CURKEY%"=="" goto ASKKEY
echo  License key detected. Starting bot...
echo.
goto START

:ASKKEY
echo  Welcome! Please enter your license key.
echo  (Format: ELDO-XXXX-XXXX-XXXX-XXXX)
echo.
set /p LICKEY=  Key:
if "%LICKEY%"=="" (
  echo  No key entered. Exiting.
  pause
  exit /b 1
)
echo %LICKEY%> license.key
echo.
echo  Key saved! Validating...
echo.

:START
eldobot.exe
echo.
echo  Bot stopped. Press any key to exit.
pause > nul