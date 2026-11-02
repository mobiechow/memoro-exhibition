# 一屋三代放暑假｜展覽互動體驗

首頁、相處時間估算、七題回憶小測驗及可下載分享卡。

網站：https://mobiechow.github.io/memoro-exhibition/

## 維護

純 HTML、CSS、JavaScript，所有網站檔案在 `dist/`，無需安裝或建置。修改後推送 `main`，GitHub Actions 自動發佈 GitHub Pages。Repository Settings → Pages → Source 應選擇 GitHub Actions。

本機預覽：`python3 -m http.server 8000 --directory dist`，開啟 http://localhost:8000/ 。

答案只在頁面記憶體處理；沒有登入、答案儲存、資料庫、AI 或 analytics。託管平台連線紀錄由平台處理。時間結果是根據觀眾假設的情境估算，並非生命預測。

## 來源

2026-11-02 複製自本機 `Exhibition/memoro_exhibition/dist/`，只調整 GitHub Pages 的分享及預覽網址。沒有包含本機部署帳戶資料、備份或設計工作檔。原 Vercel 部署獨立維持。

實體手機原生分享及相簿儲存仍需實機確認。
