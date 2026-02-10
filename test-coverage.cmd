@echo off
SETLOCAL
set FAILED=0

echo ========================================
echo  Backend coverage (server)
echo ========================================
echo  HTML report: server/coverage/
echo ========================================
cd server
call node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage
IF ERRORLEVEL 1 set FAILED=1
cd ..

echo.
echo ========================================
echo  Frontend coverage (Angular)
echo ========================================
echo  Threshold: 80%% statements / branches / functions / lines
echo  HTML report: coverage/
echo ========================================
call npx ng test --no-watch --coverage
IF ERRORLEVEL 1 set FAILED=1

echo.
IF %FAILED%==1 (
    echo ========================================
    echo  RESULT: Coverage check failed.
    echo ========================================
    exit /b 1
) ELSE (
    echo ========================================
    echo  RESULT: All coverage checks passed.
    echo ========================================
    echo  Reports:
    echo    Backend:  server/coverage/
    echo    Frontend: coverage/
    echo ========================================
    exit /b 0
)
ENDLOCAL
