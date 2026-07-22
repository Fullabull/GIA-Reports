@echo off
setlocal

set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;%PATH%"

"C:\Program Files\Git\bin\bash.exe" "%~dp0gdg.sh" %* ./gdg_out

exit /b %ERRORLEVEL%
