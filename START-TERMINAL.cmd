@echo off
cd /d "%~dp0"
set "TERMINAL_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%TERMINAL_NODE%" set "TERMINAL_NODE=node"
start "" "http://127.0.0.1:4173"
"%TERMINAL_NODE%" server.mjs
pause
