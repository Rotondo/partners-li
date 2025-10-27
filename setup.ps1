# Script de Setup - PayManager
# Verifica e instala dependências necessárias

Write-Host "🚀 PayManager - Setup de Desenvolvimento" -ForegroundColor Cyan
Write-Host "==========================================`n" -ForegroundColor Cyan

# Verificar Node.js
Write-Host "📦 Verificando Node.js..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js NÃO está instalado!" -ForegroundColor Red
    Write-Host "`n📥 Instale o Node.js de uma das opções abaixo:`n" -ForegroundColor Yellow
    Write-Host "1. Download direto: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "2. Usar winget: winget install OpenJS.NodeJS.LTS" -ForegroundColor Cyan
    Write-Host "`nReinicie o terminal após instalar e execute este script novamente." -ForegroundColor Yellow
    Read-Host "`nPressione ENTER para abrir o site do Node.js"
    Start-Process "https://nodejs.org/"
    exit 1
}

# Verificar npm
Write-Host "`n📦 Verificando npm..." -ForegroundColor Yellow

try {
    $npmVersion = npm --version 2>&1
    Write-Host "✅ npm disponível: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm não encontrado" -ForegroundColor Red
    exit 1
}

# Verificar se node_modules existe
Write-Host "`n📂 Verificando dependências..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "✅ Dependências já instaladas" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dependências não instaladas" -ForegroundColor Yellow
    Write-Host "`n📥 Instalando dependências..." -ForegroundColor Yellow
    Write-Host "Isso pode demorar alguns minutos na primeira vez...`n" -ForegroundColor Yellow
    
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Dependências instaladas com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Erro ao instalar dependências" -ForegroundColor Red
        exit 1
    }
}

# Verificar estrutura do projeto
Write-Host "`n📁 Verificando estrutura do projeto..." -ForegroundColor Yellow

$filesToCheck = @("package.json", "vite.config.ts", "src/App.tsx", "tailwind.config.ts")

$allFilesExist = $true
foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file (AUSENTE)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "`n⚠️  Alguns arquivos essenciais estão faltando" -ForegroundColor Yellow
}

# Conclusão
Write-Host "`n" + "="*50 -ForegroundColor Cyan
Write-Host "🎉 Setup Concluído!" -ForegroundColor Green
Write-Host "`nVocê pode agora iniciar o servidor com:" -ForegroundColor Yellow
Write-Host "  npm run dev`n" -ForegroundColor Cyan

Write-Host "A aplicação estará disponível em:" -ForegroundColor Yellow
Write-Host "  http://localhost:8080`n" -ForegroundColor Cyan

# Perguntar se quer iniciar agora
$startNow = Read-Host "Deseja iniciar o servidor agora? (S/N)"

if ($startNow -eq "S" -or $startNow -eq "s" -or $startNow -eq "Y" -or $startNow -eq "y") {
    Write-Host "`n🚀 Iniciando servidor de desenvolvimento...`n" -ForegroundColor Green
    npm run dev
} else {
    Write-Host "`n💡 Para iniciar manualmente, execute: npm run dev" -ForegroundColor Yellow
}

