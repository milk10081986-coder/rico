# Delete screenshots older than MaxAgeHours (Windows).
param(
  [int]$MaxAgeHours = 23,
  [switch]$DryRun
)

$logDir = Join-Path $env:LOCALAPPDATA 'screenshot-cleaner'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$log = Join-Path $logDir 'cleanup.log'
function Write-Log($msg) {
  $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg"
  Write-Output $line
  Add-Content -Path $log -Value $line -Encoding UTF8
}

$dirs = @(
  (Join-Path ([Environment]::GetFolderPath('MyPictures')) 'Screenshots'),
  (Join-Path $env:USERPROFILE 'Pictures\Screenshots')
)
if ($env:OneDrive) { $dirs += (Join-Path $env:OneDrive 'Pictures\Screenshots'), (Join-Path $env:OneDrive '画像\Screenshots') }
if ($env:SCREENSHOT_DIRS) { $dirs += $env:SCREENSHOT_DIRS -split ';' }

# Desktop holds other images too, so only files named like screenshots are removed there.
$desktops = @([Environment]::GetFolderPath('Desktop'), (Join-Path $env:USERPROFILE 'Desktop'))
if ($env:OneDrive) { $desktops += (Join-Path $env:OneDrive 'Desktop'), (Join-Path $env:OneDrive 'デスクトップ') }
$namePattern = '^(Screenshot|スクリーンショット|Screen Shot)'

$cutoff = (Get-Date).AddHours(-$MaxAgeHours)
$count = 0
$targets = @($dirs | Select-Object -Unique | ForEach-Object { @{ Path = $_; NameOnly = $false } })
$targets += @($desktops | Select-Object -Unique | ForEach-Object { @{ Path = $_; NameOnly = $true } })
foreach ($t in $targets) {
  if (-not (Test-Path $t.Path)) { continue }
  Get-ChildItem -Path $t.Path -File |
    Where-Object { $_.Extension -match '^\.(png|jpe?g|heic|mp4)$' -and $_.LastWriteTime -lt $cutoff } |
    Where-Object { -not $t.NameOnly -or $_.Name -match $namePattern } |
    ForEach-Object {
      if ($DryRun) { Write-Log "[dry-run] $($_.FullName)" }
      else { Remove-Item -LiteralPath $_.FullName -Force; Write-Log "deleted $($_.FullName)" }
      $count++
    }
}
Write-Log "done: $count file(s) $(if ($DryRun) { 'matched' } else { 'removed' })"
