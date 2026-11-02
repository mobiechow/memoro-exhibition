(() => {
  'use strict';
  const body=document.body,choices=document.querySelector('.home-choices');
  const timers=[];
  const ready=()=>{body.dataset.phase='ready';choices.removeAttribute('inert');choices.removeAttribute('aria-hidden');};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clear=()=>timers.splice(0).forEach(clearTimeout);
  if(reduced.matches){ready();return;}
  // Title fades for 350ms, followed by a one-second pause.
  timers.push(setTimeout(()=>body.dataset.phase='copy',1350));
  timers.push(setTimeout(()=>body.dataset.phase='compact',2050));
  timers.push(setTimeout(ready,2550));
  reduced.addEventListener('change',e=>{if(e.matches){clear();ready();}});
  addEventListener('pagehide',clear,{once:true});
  addEventListener('pageshow',e=>{if(e.persisted)ready();});
})();
