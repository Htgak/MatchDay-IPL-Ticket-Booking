@echo off
SETLOCAL EnableDelayedExpansion

echo ===================================================
echo             MatchDay IPL Booking Setup
echo ===================================================
echo.

:: 1. Check Node.js installation (for client)
echo [*] Checking for Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Node.js is not installed. You will need Node.js to run the client UI locally.
) else (
    echo [OK] Node.js is installed.
)
echo.

:: 2. Check Docker installation
echo [*] Checking for Docker...
docker -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not running. Please start Docker and try again.
    goto error
)
echo [OK] Docker is installed.
echo.

:: 3. Setup environment files
echo [*] Setting up environment files...

:: Server .env
if not exist "server\.env" (
    echo   [-] Creating server\.env from example...
    copy "server\.env.example" "server\.env" >nul
    echo   [OK] server\.env created.
) else (
    echo   [OK] server\.env already exists.
)

:: Client .env
if not exist "client\.env" (
    echo   [-] Creating client\.env from example...
    copy "client\.env.example" "client\.env" >nul
    echo   [OK] client\.env created.
) else (
    echo   [OK] client\.env already exists.
)
echo.

:: 4. Start Docker Compose
echo [*] Building and launching Docker containers...
docker compose up -d --build
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose failed to start the containers.
    goto error
)
echo [OK] Docker containers are starting.
echo.

:: 5. Wait for server and run Seeding script
echo [*] Waiting for database and server to initialize...
echo   (This may take 15-20 seconds to boot the containers)
timeout /t 15 /nobreak >nul

echo [*] Setting up database schema and initial data...
docker compose exec -T db psql -U postgres -d ipl_booking -f /docker-entrypoint-initdb.d/init.sql
if %errorlevel% neq 0 (
    echo   [!] Database setup attempt failed. Waiting another 10 seconds for PostgreSQL to be ready...
    timeout /t 10 /nobreak >nul
    docker compose exec -T db psql -U postgres -d ipl_booking -f /docker-entrypoint-initdb.d/init.sql
    if !errorlevel! neq 0 (
        echo [ERROR] Database setup failed. Please check if the Docker db container is running.
        goto error
    )
)
echo [OK] Database setup complete.
echo.

echo [*] Seeding matches and stadium seats...
docker compose exec -T server node scripts/seed_stadiums.js
if %errorlevel% neq 0 (
    echo [ERROR] Seeding failed. Please check if the Docker server container is running correctly.
    goto error
)
echo [OK] Seeding complete!
echo.

:: 6. Install client dependencies on host
echo [*] Installing Client dependencies (for local UI development)...
cd client
call npm install
if %errorlevel% neq 0 (
    echo [WARNING] Failed to install client dependencies. You can run 'npm install' inside the 'client' directory manually later.
) else (
    echo [OK] Client dependencies installed.
)
cd ..
echo.

echo ===================================================
echo                  SETUP COMPLETE
echo ===================================================
echo.
echo All services (Server, Nginx load balancer, PostgreSQL, Redis)
echo are now running in Docker!
echo.
echo To start booking tickets:
echo 1. Start the client UI:
echo    cd client
echo    npm run dev
echo.
echo ===================================================
pause
exit /b 0

:error
echo.
echo [FATAL] Setup failed. Please check the errors above.
pause
exit /b 1
