/* Whole-experience invitation; the homepage link appears once, before the exhibition footer. */
(()=>{'use strict';const url='https://memoroexhibition.vercel.app/',title='有些回憶，需要三代一起完成｜展覽互動體驗';const message="下一段和家人的回憶，你希望是甚麼模樣？\n\n想邀請你試試兩個小體驗：看看你們剩餘多少相處時間，或回答七個小問題，遇見你的回憶小夥伴。\n留一點時間，想想你們的下一次。\n\n體驗連結\nhttps://memoroexhibition.vercel.app/\n-----------------------------\n有些回憶，需要三代一起完成\n和悅會十周年呈獻「一屋三代放暑假」跨代共融成果展覽\n日期：2026年11月2–12日\n時間：11:00–19:30\n地點：618上海街地下";
window.ExhibitionInvitation=Object.freeze({url,title,message,text:()=>message,async share(){if(navigator.share){try{await navigator.share({title,text:message});return 'shared';}catch(error){if(error.name==='AbortError')return 'cancelled';}}return 'fallback';},async copy(){await navigator.clipboard.writeText(message);}});
})();
