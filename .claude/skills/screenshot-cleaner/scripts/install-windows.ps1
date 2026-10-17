# Register (or remove with -Uninstall) an hourly Task Scheduler job for cleanup.ps1.
param(
  [switch]$Uninstall,
  [int]$MaxAgeHours = 23
)

$taskName = 'ScreenshotCleaner'
$destDir = Join-Path $env:LOCALAPPDATA 'screenshot-cleaner'
$dest = Join-Path $destDir 'cleanup.ps1'

if ($Uninstall) {
  Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $dest -Force -ErrorAction SilentlyContinue
  Write-Output 'uninstalled'
  exit 0
}

New-Item -ItemType Directory -Force -Path $destDir | Out-Null
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'cleanup.ps1') -Destination $dest -Force

$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
  -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$dest`" -MaxAgeHours $MaxAgeHours"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 1)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
Write-Output "installed: task '$taskName' runs every hour"
