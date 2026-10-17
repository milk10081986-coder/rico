---
name: screenshot-cleaner
description: パソコン内のスクリーンショットを、撮影から24時間以内に自動で削除する仕組みをセットアップ・解除・確認するスキル。「スクショを自動削除したい」「スクリーンショットを定期的に消して」「スクショ自動削除を止めて」と言われたときに使用する。macOS / Windows / Linux に対応。
---

# スクショ自動削除（screenshot-cleaner）

スクリーンショットを **1時間ごと** にチェックし、**作成から23時間以上経過したもの** を削除します。
1時間間隔のチェックと組み合わせることで、どのスクショも **24時間以内に必ず削除** されます。

## 対象ファイル

| OS | フォルダ | ファイル名パターン |
|---|---|---|
| macOS | `defaults read com.apple.screencapture location` の場所（未設定ならデスクトップ） | `Screenshot*` / `スクリーンショット*` / `Screen Shot*` |
| Windows | `%USERPROFILE%\Pictures\Screenshots`、OneDrive の `Pictures\Screenshots` | `*.png` / `*.jpg` |
| Linux | `~/Pictures/Screenshots`、`~/Pictures`、`~/ピクチャ` | `Screenshot*` / `スクリーンショット*` |

対象は画像（png / jpg / jpeg / heic）と macOS の画面収録（mov）のみ。サブフォルダは見ません。

## 手順

1. **OS を確認する**（ユーザーに聞くか、`uname` / `$env:OS` で判定）。
2. **まずドライランで対象を見せる**。何が消えるかをユーザーに確認してもらってから本番設定に進む。
   - macOS / Linux: `bash scripts/cleanup.sh --dry-run`
   - Windows: `powershell -ExecutionPolicy Bypass -File scripts\cleanup.ps1 -DryRun`
3. **自動実行を登録する**（ユーザーの了承後）。
   - macOS: `bash scripts/install-macos.sh` → launchd に1時間ごとのジョブを登録
   - Linux: `bash scripts/install-linux.sh` → crontab に1時間ごとのジョブを登録
   - Windows: `powershell -ExecutionPolicy Bypass -File scripts\install-windows.ps1` → タスクスケジューラに登録
4. **結果を伝える**。削除ログの場所（下記）と解除方法を案内する。

## 解除

- macOS: `bash scripts/install-macos.sh --uninstall`
- Linux: `bash scripts/install-linux.sh --uninstall`
- Windows: `powershell -ExecutionPolicy Bypass -File scripts\install-windows.ps1 -Uninstall`

## オプション

- 保存時間を変える: `--max-age-hours N`（Windows は `-MaxAgeHours N`）。既定は 23。
- 別フォルダを追加: 環境変数 `SCREENSHOT_DIRS`（`:` 区切り、Windows は `;` 区切り）。
- ゴミ箱に移すだけにしたい場合: `--trash`（macOS のみ。`~/.Trash` へ移動）。

## ログ

- macOS / Linux: `~/.screenshot-cleaner/cleanup.log`
- Windows: `%LOCALAPPDATA%\screenshot-cleaner\cleanup.log`

## 注意

- 削除は元に戻せません（`--trash` 指定時を除く）。残したいスクショは別フォルダへ移すか名前を変えてもらう。
- macOS で初回に「フルディスクアクセス」を求められた場合は、システム設定 → プライバシーとセキュリティ → フルディスクアクセスで `/bin/bash` を許可する。
- クラウド環境（このリポジトリを開いたリモートセッション等）では実行しても意味がないため、必ずユーザー自身のパソコンで実行してもらう。
