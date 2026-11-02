(() => {
'use strict';
const model=window.MemoryModel,motion=window.MemoryMotion,app=document.getElementById('app');
const intro=app.innerHTML;
const initial=()=>({relation:'',mode:'',age:'',sex:'',hours:'',years:10});
const state={profile:initial(),complete:false,answers:[],extra:0,card:null,shareLink:false};
  const types=window.MemoryFloaties;

let cardUrl=null,toastTimer,formingTimer,answerTimer;
const num=n=>new Intl.NumberFormat('zh-HK',{maximumFractionDigits:1}).format(n);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const multiline=s=>esc(s).replace(/\n/g,'<br>');
const person=()=>state.profile.relation||'心入面嗰個人';
function toast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3200);}
function go(hash){clearTimeout(answerTimer);if(location.hash===hash)render();else location.hash=hash;}
function top(step,label,back){const q=label.match(/(\d+) \/ (\d+)/),count=q?Number(q[2]):1,current=q?Number(q[1]):1;return `<div class="step-row"><button class="back" data-go="${back}"><span aria-hidden="true">‹</span> ${q?(current>1?'上一題':'返回封面'):'返回'}</button><span class="step-counter">${label}</span></div>${q?`<div class="progress" aria-label="第 ${current} 題，共 ${count} 題">${Array.from({length:count},(_,i)=>`<span class="${i<current?'done':''}"></span>`).join('')}</div>`:''}`;}
function option(i,text,attrs,selected){return `<button type="button" class="option ${selected?'selected':''}" style="--choice-delay:${i*100}ms" ${attrs} aria-pressed="${!!selected}"><span class="option-code" aria-hidden="true">${String.fromCharCode(65+i)}</span><span>${esc(text)}</span></button>`;}
function capture(){}
const questionImages=["01-rain", "02-old-photo", "03-after-meal", "04-voice-message", "05-free-afternoon", "06-handcraft", "07-family-chat"];
function questionGraphic(index){const name=questionImages[index],next=questionImages[index+1];if(next){const preload=new Image();preload.src='../assets/questions-20261102/'+next+'.webp';}return `<div class="question-graphic" aria-hidden="true"><picture><source srcset="../assets/questions-20261102/${name}.webp" type="image/webp"><img src="../assets/questions-20261102/${name}.png" alt="" width="320" height="220" decoding="async" fetchpriority="high"></picture></div>`;}
function formingScreen(){return `<section class="screen memory-forming" aria-labelledby="forming-title"><div class="eyebrow">看看你的選擇</div><h2 id="forming-title">你期待的回憶，<br>正在慢慢成形。</h2><div class="forming-scene" aria-hidden="true"><div class="forming-orbit"></div><div class="memory-fragment fragment-one"><img src="../assets/questions-20261102/02-old-photo.webp" alt=""></div><div class="memory-fragment fragment-two"><img src="../assets/questions-20261102/05-free-afternoon.webp" alt=""></div><div class="memory-fragment fragment-three"><img src="../assets/questions-20261102/07-family-chat.webp" alt=""></div><span class="forming-light"></span></div><p class="forming-copy" role="status">把你的選擇放在一起，<br>看看哪位小夥伴最接近你的心意。</p><div class="forming-progress" role="progressbar" aria-label="回憶正在成形"><span></span></div></section>`;}
function questionScreen(index){const q=model.questions[index],selected=state.answers[index];return `<section class="screen question-screen floatie-question">${top(2,`${index+1} / ${model.questions.length}`,index?`#quiz/${index-1}`:'#')}<div class="eyebrow">${esc(q.place)}</div>${questionGraphic(index)}<p class="story-scene">${esc(q.scene)}</p><h2 class="question-title">${esc(q.title)}</h2><div class="option-list" role="group" aria-label="揀一個最接近你而家心意嘅答案">${q.choices.map((c,i)=>option(i,c[0],`data-answer="${i}" data-question="${index}"`,selected===i)).join('')}</div><div class="answer-echo" aria-live="polite">${selected===undefined?'冇標準答案，揀最接近你心意嗰個就得。':answerEcho(index,selected)}</div></section>`;}
function answerEcho(){return '記低呢個選擇，再睇吓下一個情境。';}
function motif(t){return `<div class="floatie-art"><img src="${t.image}" alt="${esc(t.title)}" width="600" height="500" decoding="async"></div>`;}
function rankedCompanions(key){if(state.answers.length!==model.questions.length||model.resolve(state.answers)!==key)return [];return model.rank(state.answers).slice(1,3);}
function companionCollage(key){const others=rankedCompanions(key);if(!others.length)return '';return `<section class="ranked-companions"><h3>你也期待的相處時光</h3><div class="companion-collage">${others.map((k,i)=>{const t=types[k];return `<article class="companion-note" style="--note-wash:${t.wash};--note-accent:${t.accent}"><span class="companion-rank">第${i===0?'二':'三'}位</span><img src="${t.image}" alt="${esc(t.title)}" width="260" height="190"><h4>${esc(t.title)}</h4><p>${esc(t.keywords)}</p></article>`;}).join('')}</div></section>`;}
function resultScreen(key,shared=false){const t=types[key],handle=window.MemoryConfig.instagramHandle;return `<section class="screen result-screen"><h2 class="result-heading">${shared?'來認識這位小夥伴':'這次，你遇見了……'}</h2><article class="result-card floatie-card" style="--floatie-accent:${t.accent};--floatie-wash:${t.wash}" aria-label="${t.title}結果卡"><h3 class="result-type">${t.title}</h3><p class="floatie-keywords">${esc(t.keywords)}</p>${motif(t)}</article><div class="floatie-story"><div class="eyebrow">${t.title} ／ 下一段回憶</div><h3>${esc(t.lead)}</h3><p class="result-description">${esc(t.description)}</p><div class="floatie-invitation"><p>${multiline(t.question)}</p><p>${esc(t.action)}</p></div></div>${shared?'':companionCollage(key)}${shared?'<button class="primary" data-action="restart">遇見我的回憶小夥伴</button>':`<div class="result-actions"><button class="primary" data-action="save">留住這位回憶小夥伴</button><button class="secondary quiz-restart" data-action="restart">遇見其他回憶小夥伴</button><button class="secondary" data-action="share">分享這個體驗</button></div>${state.shareLink?shareBox(key):''}<div class="quiz-next-actions"><a class="next-memory-button has-graphic" href="../time/"><span class="animated-hourglass next-experience-image" aria-hidden="true"><img class="next-experience-image" src="../assets/time-hourglass-v1.png" alt="" width="114" height="114" loading="lazy" decoding="async"><span class="button-sand" aria-hidden="true"><i style="--grain:0"></i><i style="--grain:1"></i><i style="--grain:2"></i><i style="--grain:3"></i><i style="--grain:4"></i><i style="--grain:5"></i><i style="--grain:6"></i><i style="--grain:7"></i></span></span><span>留一點時間，給你在乎的人。</span><strong>看看你們剩餘的相處時間 <b aria-hidden="true">↗</b></strong></a></div>`}<p class="quiet-note">這是一個關於家庭相處的小遊戲。結果反映你這次的選擇，並不是心理評估。</p></section>`;}
function privacyScreen(){return `<section class="screen privacy-screen"><a class="back" href="../">‹ 返回首頁</a><h2>私隱與 cookies</h2><div class="privacy-copy"><h3>你的答案及輸入</h3><p>相處時間的年齡、見面頻率及時數，以及回憶小夥伴的七題選擇，只在目前頁面內處理。網站程式不會把答案或輸入傳送到伺服器，也不會把它們寫入 cookies、localStorage 或 sessionStorage。本體驗不要求姓名或聯絡資料。</p><h3>網站連線與 cookies</h3><p>本網站沒有加入廣告、分析追蹤或自設 cookies。網站由 Vercel 託管；託管平台可能處理 IP、裝置及連線紀錄，與你的答案及輸入分開。</p><h3>儲存與分享</h3><p>分享提供介紹兩個體驗的邀請訊息及網站首頁連結，不包含你的答案或估算結果。儲存的回憶卡包含角色類型及展覽文字，由你決定是否儲存或分享。其他平台會按各自私隱政策處理你主動分享的內容。</p></div><a class="primary" href="../">返回首頁</a></section>`;}
function shareUrl(){return window.ExhibitionInvitation.url;}
function invitationMessage(){return window.ExhibitionInvitation.message;}
function invitationText(){return invitationMessage()+'\n\n'+shareUrl();}
function shareBox(){return `<div class="share-box"><h3>邀請親友一起體驗</h3><p class="invitation-template">${multiline(invitationText())}</p><button class="secondary" data-copy="invitation">複製邀請訊息</button></div>`;}
function route(){const r=location.hash.slice(1)||'';const aliases={voice:'discovery',photo:'cherish',object:'cherish',craft:'connection',journey:'courage',presence:'warmth'};const m=r.match(/^(card|result|reveal)\/(.+)$/);return m&&aliases[m[2]]?m[1]+'/'+aliases[m[2]]:r;}
function render({scroll=true,focus=true,animate=true,timeFrom=0}={}){clearTimeout(formingTimer);clearTimeout(answerTimer);const r=route();
 if(/^quiz\/\d+$/.test(r)&&Number(r.split('/')[1])<model.questions.length&&state.complete){const i=Number(r.split('/')[1]);if(i>state.answers.length){go(`#quiz/${state.answers.length}`);return;}app.innerHTML=questionScreen(i);}

 else if(r==='forming'&&state.answers.length===model.questions.length){state.card=model.resolve(state.answers);app.innerHTML=formingScreen();formingTimer=setTimeout(()=>{if(route()==='forming'&&state.answers.length===model.questions.length)go('#result/'+state.card);},4000);}
 else if(/^result\//.test(r)&&state.answers.length===model.questions.length&&types[r.split('/')[1]]){state.card=model.resolve(state.answers);app.innerHTML=resultScreen(state.card);}
 else if(/^card\//.test(r)&&types[r.split('/')[1]]){state.card=r.split('/')[1];app.innerHTML=resultScreen(state.card,true);}
 else if(r==='privacy')app.innerHTML=privacyScreen();
 else {if(r)history.replaceState(null,'',location.pathname);app.innerHTML=intro;}
 if(scroll)window.scrollTo(0,0);if(focus)app.focus({preventScroll:true});motion.mount(app,{animate,timeFrom});}
function invalidate(){state.complete=false;state.answers=[];state.card=null;state.extra=0;state.shareLink=false;}
function selectAnswer(index,answer){if(!model.questions[index]?.choices[answer])return;const changed=state.answers[index]!==answer;state.answers[index]=answer;if(changed){state.answers=state.answers.slice(0,index+1);state.card=null;}app.querySelectorAll('[data-answer]').forEach((b,i)=>{b.classList.toggle('selected',i===answer);b.setAttribute('aria-pressed',String(i===answer));});app.querySelector('.answer-echo').textContent=answerEcho(index,answer);app.querySelectorAll('[data-answer]').forEach(b=>b.disabled=true);clearTimeout(answerTimer);answerTimer=setTimeout(()=>{if(route()!==`quiz/${index}`)return;if(index===model.questions.length-1){state.card=model.resolve(state.answers);go('#forming');}else go(`#quiz/${index+1}`);},220);}
  function roundedRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
  function drawLines(ctx,text,x,y,lineHeight){for(const line of text.split('\n')){ctx.fillText(line,x,y);y+=lineHeight;}return y;}
  function wrapText(ctx,text,x,y,width,lineHeight){
    const noStart='，。、；：！？）》」』】〕〉…,.!?;:%',noEnd='（《「『【〔〈(';
    let line='';const draw=value=>{if(value){ctx.fillText(value,x,y);y+=lineHeight;}};
    for(const ch of text){if(ch==='\n'){draw(line);line='';continue;}
      if(line&&ctx.measureText(line+ch).width>width){let split=line.length;if(noStart.includes(ch))split--;while(split>0&&noEnd.includes(line[split-1]))split--;if(split>0){draw(line.slice(0,split));line=line.slice(split)+ch;}else line+=ch;}else line+=ch;
    }draw(line);return y;
  }
  async function makeCard(key){
    const t=types[key];if(document.fonts?.load)await document.fonts.load('700 32px "Foam GenSen Rounded"');if(document.fonts?.ready)await document.fonts.ready;
    const [image,logo]=await Promise.all([window.MemoryArt.loadImage(t.exportImage||t.image),window.MemoryArt.loadImage('../assets/expo-logo.svg')]);
    const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;const ctx=canvas.getContext('2d');
    const brand=(size)=>`700 ${size}px "Foam GenSen Rounded","PingFang TC",sans-serif`;
    const bg=ctx.createLinearGradient(0,0,1080,1920);bg.addColorStop(0,t.wash);bg.addColorStop(.8,'#fffdf5');ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1920);
    ctx.save();ctx.globalAlpha=.55;ctx.fillStyle=t.wash;ctx.beginPath();ctx.arc(1110,180,375,0,Math.PI*2);ctx.fill();ctx.restore();
    // Keep essential artwork inside generous top and bottom clear space.
    ctx.fillStyle=t.accent;ctx.font=brand(36);ctx.fillText('回憶小夥伴',88,230);ctx.font=brand(106);ctx.fillText(t.title,82,340);ctx.font=brand(40);ctx.fillText(t.keywords,88,410);
    const ratio=Math.min(960/image.width,500/image.height);const iw=image.width*ratio,ih=image.height*ratio;ctx.drawImage(image,(1080-iw)/2,445+(500-ih)/2,iw,ih);
    ctx.fillStyle=t.accent;ctx.font=brand(34);ctx.fillText(t.title+' ／ 下一段回憶',88,995);
    ctx.globalAlpha=.65;ctx.beginPath();ctx.arc(100,1062,12,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.font=brand(50);ctx.fillText(t.lead,132,1082);
    ctx.fillStyle='#294235';ctx.font=brand(38);const descriptionBottom=wrapText(ctx,t.description,100,1165,880,68);
    ctx.fillStyle=t.accent;ctx.font=brand(44);wrapText(ctx,t.question,88,Math.max(1490,descriptionBottom+40),904,74);
    const logoWidth=432,logoHeight=logoWidth*40.8/493.4;ctx.drawImage(logo,(1080-logoWidth)/2,1630,logoWidth,logoHeight);
    const credit='和悅會十周年呈獻「一屋三代放暑假」跨代共融成果展覽';let size=29;ctx.font=brand(size);while(ctx.measureText(credit).width>904&&size>20){size--;ctx.font=brand(size);}ctx.font=brand(size*.9);ctx.fillStyle='#697165';ctx.textAlign='center';ctx.fillText(credit,540,1710);ctx.font=brand(25.2);ctx.fillText('11月2-12日 | 618上海街地下',540,1755);ctx.font=brand(25.2);ctx.fillText('IG @woopieclub',540,1800);
    return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('未能產生圖片')),'image/png'));
  }
  async function saveCard(){const button=app.querySelector('[data-action="save"]');if(button){button.disabled=true;button.textContent='準備圖片中……';}try{const blob=await makeCard(state.card);if(cardUrl)URL.revokeObjectURL(cardUrl);cardUrl=URL.createObjectURL(blob);document.getElementById('card-image').src=cardUrl;const dialog=document.getElementById('card-dialog');dialog.showModal();dialog.focus({preventScroll:true});dialog.scrollTop=0;}catch(error){toast('圖片暫時未能產生，請再試一次。');}finally{if(button){button.disabled=false;button.textContent='留住這位回憶小夥伴';}}}
  async function shareCard(){
    const status=await window.ExhibitionInvitation.share();if(status==='shared'||status==='cancelled')return;
    state.shareLink=true;render({scroll:false,focus:false,animate:false});toast('複製邀請訊息，傳給你想邀請的人。');
  }
  async function copyLink(){try{await navigator.clipboard.writeText(invitationText());toast('已複製邀請訊息。');}catch(error){toast('可以長按上面嘅邀請訊息複製。');}}

app.addEventListener('input',e=>{if(e.target.id==='age'){state.profile.age=e.target.value;state.complete=false;state.answers=[];}});
app.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.go!==undefined){capture();go(b.dataset.go);return;}
 if(b.dataset.answer!==undefined){selectAnswer(Number(b.dataset.question),Number(b.dataset.answer));return;}

 if(b.dataset.viewType){go('#card/'+b.dataset.viewType);return;}
 if(b.dataset.copy){await copyLink(b.dataset.copy);return;}
 switch(b.dataset.action){
 case 'start':state.complete=true;go('#quiz/0');break;
 
 case 'restart':invalidate();state.profile=initial();state.complete=true;go('#quiz/0');break;
 case 'save':await saveCard();break;
 case 'share':await shareCard();break;
 }
});

for(const b of document.querySelectorAll('[data-close-card]'))b.addEventListener('click',()=>document.getElementById('card-dialog').close());
const saveDialog=document.getElementById('card-dialog');let backdropPointer=false;
function outsideSaveDialog(event){const r=saveDialog.getBoundingClientRect();return event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom;}
saveDialog.addEventListener('pointerdown',event=>{backdropPointer=event.target===saveDialog&&outsideSaveDialog(event);});
saveDialog.addEventListener('click',event=>{if(backdropPointer&&event.target===saveDialog&&outsideSaveDialog(event))saveDialog.close();backdropPointer=false;});
saveDialog.addEventListener('close',()=>{backdropPointer=false;});

window.addEventListener('hashchange',()=>motion.leave(app,()=>render()));

render({focus:false});
})();
