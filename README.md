# 一屋三代放暑假｜展覽互動體驗

首頁、相處時間估算、七題回憶小測驗、可下載分享卡，以及「三代同堂」跨代對話卡介紹與查詢表格。

網站：https://mobiechow.github.io/memoro-exhibition/

## 維護

純 HTML、CSS、JavaScript，所有網站檔案在 `dist/`，無需安裝或建置。修改後推送 `main`，GitHub Actions 自動發佈 GitHub Pages。Repository Settings → Pages → Source 應選擇 GitHub Actions。

本機預覽：`python3 -m http.server 8000 --directory dist`，開啟 http://localhost:8000/ 。

體驗答案只在頁面記憶體處理；沒有登入、答案儲存、資料庫、AI 或 analytics。查詢表格以 HTTPS 直接提交至 FormSubmit，再由其轉送至傳家寶的既有接收信箱。接收端必須先完成 FormSubmit 啟用；只有服務回報接受提交後才顯示成功，錯誤會保留填寫內容。託管平台連線紀錄由平台處理。時間結果是根據觀眾假設的情境估算，並非生命預測。

## 來源

2026-11-02 複製自本機 `Exhibition/memoro_exhibition/dist/`，只調整 GitHub Pages 的分享及預覽網址。沒有包含本機部署帳戶資料、備份或設計工作檔。原 Vercel 部署獨立維持。

實體手機原生分享及相簿儲存仍需實機確認。

## 2026-11-09 查詢頁

- `/dialogue/`：三張實際卡面（源自 Card/三代同堂_Preview.pdf 第5、11、35頁）及四步建議玩法。
- 姓名、至少一種聯絡方式、至少一個查詢項目及兩項未預選同意為必填。查詢不連結測驗答案。
- `/privacy/`：查詢用途、傳家寶接收及跟進同意、接收信箱內電郵保存至2026年12月12日、查閱／更正／刪除聯絡方式、和悅會政策連結；舊 `/quiz/#privacy` 仍可閱讀摘要及前往完整版本。
- 保存日期需要收件人及合作機構實際執行電郵清理；網站不會自動刪除電郵。
- 訪客毋須開啟電郵程式。FormSubmit 會另保留提交紀錄30日，已於收集聲明及私隱頁披露。

## Vercel production

This release is based on GitHub main fa1bef9 with hosting-specific share URLs and privacy hosting text updated for https://memoroexhibition.vercel.app/. Deploy the dist/ static output to existing project memoro_exhibition.
