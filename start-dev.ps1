Set-Location $PSScriptRoot

Write-Host "Checke ob Docker läuft" -ForegroundColor Cyan
$dockerRunning = $false
try {
    docker info | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $dockerRunning = $true
    }
} catch {
    $dockerRunning = $false
}

if (-not $dockerRunning) {
    Write-Host "Docker läuft nicht. Starte es:" -ForegroundColor Red
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

    $dockerReady = $false
    $attempts = 0
    while (-not $dockerReady -and $attempts -lt 60) {
        Start-Sleep -Seconds 2
        try {
            docker info | Out-Null
            if ($LASTEXITCODE -eq 0) { $dockerReady = $true }
        } catch {
            $attempts++
        }
    }

    if (-not $dockerReady) {
        Write-Host "Docker konnte nicht gestartet werden. Bitte starte Docker manuell und führe das Skript erneut aus." -ForegroundColor Red
        exit 1
    }else {
        Write-Host "Docker ist jetzt bereit." -ForegroundColor Green
    }
}

Write-Host "Starte Docker-Container" -ForegroundColor Cyan
docker start recur



Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Starte Backend" -ForegroundColor Cyan
Set-Location "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "./gradlew bootRun" 
Set-Location ..


Write-Host "Starte Frontend" -ForegroundColor Cyan
Set-Location "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "yarn run dev"
Set-Location ..


Write-Host "Warte bis Frontend und Backend hochgefahren sind" -ForegroundColor Cyan

$backendReady = $false
while (-not $backendReady) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing -TimeoutSec 2
        $backendReady = $true
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -gt 0) {
            $backendReady = $true
        } else {
            Start-Sleep -Seconds 2
        }
    }
}


Write-Host "Backend is ready!" -ForegroundColor Green


$frontendReady = $false
while (-not $frontendReady) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) { $frontendReady = $true }
    } catch {
        Start-Sleep -Seconds 2
    }
}
Write-Host "Frontend is ready!" -ForegroundColor Green

Write-Host "All services are up and running! Open Browser at http://localhost:5173" -ForegroundColor Green

Start-Process "http://localhost:5173"

exit