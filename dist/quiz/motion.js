/* Gentle, cancellable presentation. No animation gates navigation or changes an answer. */
(() => {
  'use strict';
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const frames=new Set();
  let timer=null;
  const reduced=()=>preference.matches;
  function cancel(){for(const frame of frames)cancelAnimationFrame(frame);frames.clear();clearTimeout(timer);timer=null;}
  function frame(fn){const id=requestAnimationFrame(time=>{frames.delete(id);fn(time);});frames.add(id);}
  function count(element,from,to,duration){
    const format=value=>new Intl.NumberFormat('zh-HK',{maximumFractionDigits:0}).format(Math.round(value));
    element.textContent=format(to);
    if(reduced()||from===to)return;
    let start;
    element.textContent=format(from);
    frame(function tick(time){
      if(!element.isConnected)return;
      start??=time;const progress=Math.min(1,(time-start)/duration);
      const eased=1-Math.pow(1-progress,3);
      element.textContent=format(from+(to-from)*eased);
      if(progress<1)frame(tick);else element.textContent=format(to);
    });
  }
  function mount(root,{animate=true,timeFrom=0}={}){
    cancel();root.classList.remove('is-leaving');
    root.querySelector('.screen')?.classList.toggle('screen--still',!animate);
    const countEl=root.querySelector('[data-count-to]');
    if(countEl)count(countEl,timeFrom,Number(countEl.dataset.countTo),animate?2600:1450);
    root.querySelectorAll('.time-cell.active,.time-cell.extra').forEach((cell,index)=>cell.style.setProperty('--cell-delay',`${180+index*18}ms`));
  }
  function leave(root,finish){
    cancel();
    if(reduced()){finish();return;}
    root.classList.add('is-leaving');
    timer=setTimeout(()=>{timer=null;root.classList.remove('is-leaving');finish();},320);
  }
  preference.addEventListener('change',()=>{
    document.documentElement.dataset.motion=reduced()?'reduced':'full';
    // A preference change settles any current number without cancelling navigation.
    for(const frame of frames)cancelAnimationFrame(frame);frames.clear();
    document.querySelectorAll('[data-count-to]').forEach(el=>el.textContent=new Intl.NumberFormat('zh-HK').format(Math.round(Number(el.dataset.countTo))));
  });
  document.documentElement.dataset.motion=reduced()?'reduced':'full';
  window.MemoryMotion={reduced,cancel,count,mount,leave};
})();
