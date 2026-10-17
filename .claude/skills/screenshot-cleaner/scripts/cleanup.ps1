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

$cutoff = (Get-Date).AddHours(-$MaxAgeHours)
$count = 0
foreach ($d in ($dirs | Select-Object -Unique)) {
  if (-not (Test-Path $d)) { continue }
  Get-ChildItem -Path $d -File |
    Where-Object { $_.Extension -match '^\.(png|jpe?g|heic|mp4)$' -and $_.LastWriteTime -lt $cutoff } |
    ForEach-Object {
      if ($DryRun) { Write-Log "[dry-run] $($_.FullName)" }
      else { Remove-Item -LiteralPath $_.FullName -Force; Write-Log "deleted $($_.FullName)" }
      $count++
    }
}
Write-Log "done: $count file(s) $(if ($DryRun) { 'matched' } else { 'removed' })"
