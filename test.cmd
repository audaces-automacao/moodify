@echo off
SETLOCAL
set FAILED=0

echo ========================================
echo  Running backend tests (server)
echo ========================================
cd server
call npm test
IF ERRORLEVEL 1 set FAILED=1
cd ..

echo.
echo ========================================
echo  Running frontend tests (Angular)
echo ========================================
call npx ng test --no-watch
IF ERRORLEVEL 1 set FAILED=1

echo.
IF %FAILED%==1 (
    echo ========================================
    echo  RESULT: Some tests failed.
    echo ========================================
    exit /b 1
) ELSE (
    echo ========================================
    echo  RESULT: All tests passed.
    echo ========================================
    exit /b 0
)
ENDLOCAL
