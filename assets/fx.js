function mkFx(cfg){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  function clamp(v,a,b){return Math.min(b,Math.max(a,v));}
  document.documentElement.classList.add('js');
  var $$ = function(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
  /* marcar entradas */
  (cfg.reveal||[]).forEach(function(sel){ $$(sel).forEach(function(el,i){ el.classList.add('rv'); if(!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i%6); }); });
  /* titulares por palabras */
  if(!reduce){
    $$(cfg.split||'h1.rv, h2.rv').forEach(function(h){
      h.setAttribute('aria-label', h.textContent.replace(/\s+/g,' ').trim());
      var st={i:0};
      (function wrap(node){
        Array.prototype.slice.call(node.childNodes).forEach(function(n){
          if(n.nodeType===3){
            var f=document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function(t){
              if(!t) return;
              if(/^\s+$/.test(t)){ f.appendChild(document.createTextNode(' ')); return; }
              var o=document.createElement('span'); o.className='wd'; o.setAttribute('aria-hidden','true');
              var i=document.createElement('span'); i.textContent=t; i.style.setProperty('--w', st.i++);
              o.appendChild(i); f.appendChild(o);
            });
            n.parentNode.replaceChild(f,n);
          } else if(n.nodeType===1){ wrap(n); }
        });
      })(h);
      h.classList.add('split');
    });
  }
  /* observador de entradas */
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); e.target.classList.add('in-view'); io.unobserve(e.target);} }); },{threshold:.12, rootMargin:'0px 0px -6% 0px'});
  $$('.rv,.reveal,.reveal-stagger').forEach(function(el){ io.observe(el); });
  /* inclinación 3D con foco de luz */
  function tilt(el,max){
    if(reduce||!fine) return;
    el.classList.add('fx-tilt');
    var cx=0,cy=0,tx=0,ty=0,raf=0;
    function loop(){ cx+=(tx-cx)*.12; cy+=(ty-cy)*.12;
      el.style.setProperty('--rx',(-cy*max).toFixed(2)+'deg'); el.style.setProperty('--ry',(cx*max).toFixed(2)+'deg');
      if(Math.abs(tx-cx)>.002||Math.abs(ty-cy)>.002){ raf=requestAnimationFrame(loop);} else { raf=0; } }
    function kick(){ if(!raf) raf=requestAnimationFrame(loop); }
    el.addEventListener('pointermove',function(e){ if(e.pointerType==='touch') return;
      var r=el.getBoundingClientRect(); tx=((e.clientX-r.left)/r.width-.5)*2; ty=((e.clientY-r.top)/r.height-.5)*2;
      el.style.setProperty('--mx',(e.clientX-r.left)+'px'); el.style.setProperty('--my',(e.clientY-r.top)+'px'); kick(); });
    el.addEventListener('pointerleave',function(){ tx=0; ty=0; kick(); });
  }
  (cfg.tilt||[]).forEach(function(sel){ $$(sel).forEach(function(el){ tilt(el,5); }); });
  /* botones magnéticos */
  if(!reduce&&fine){ $$('.btn').forEach(function(b){
    b.addEventListener('pointermove',function(e){ var r=b.getBoundingClientRect();
      b.style.setProperty('--tx',((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px'); b.style.setProperty('--ty',((e.clientY-r.top-r.height/2)*.28).toFixed(1)+'px'); });
    b.addEventListener('pointerleave',function(){ b.style.setProperty('--tx','0px'); b.style.setProperty('--ty','0px'); }); }); }
  /* móvil: lo que en escritorio reacciona al mouse reacciona al scroll */
  if(!fine && !reduce){
    var lio=new IntersectionObserver(function(es){ es.forEach(function(e){ e.target.classList.toggle('lit', e.isIntersecting); }); },{rootMargin:'-36% 0px -36% 0px'});
    $$(cfg.lit||'.ccard,.tool-card,.blog-card,.pq,.res,.pc2,.mod,.step-card').forEach(function(el){ lio.observe(el); });
  }
  /* frase que se enciende palabra por palabra con el scroll */
  var wls=$$('[data-wl]').map(function(el){
    var txt=el.textContent.replace(/\s+/g,' ').trim(); el.setAttribute('aria-label',txt); el.textContent='';
    var ws=txt.split(' ').map(function(t){ var s=document.createElement('span'); s.className='wlw'; s.setAttribute('aria-hidden','true'); s.textContent=t; el.appendChild(s); el.appendChild(document.createTextNode(' ')); return s; });
    if(reduce) ws.forEach(function(s){ s.classList.add('on'); });
    return {el:el,ws:ws};
  });
  /* nav + barra de progreso */
  var sc=null;
  function scroller(){ if(!sc){ var p=document.querySelector('main')||document.body; while(p&&p!==document.body){ var cs=getComputedStyle(p); if(/(auto|scroll)/.test(cs.overflowY)&&p.scrollHeight>p.clientHeight+2){ sc=p; break; } p=p.parentElement; } if(!sc) sc=document.scrollingElement||document.documentElement; } return sc; }
  var nav=document.querySelector('header .nav'), bar=document.getElementById('bar'), tk=false;
  function frame(){ tk=false; var s=scroller(), vh=s.clientHeight||innerHeight, h=s.scrollHeight-vh;
    if(nav) nav.classList.toggle('is-scrolled', s.scrollTop>40);
    if(!reduce) $$('.ring').forEach(function(el,k){ var rb=el.parentElement.getBoundingClientRect(), o=(rb.top+rb.height/2)-vh/2; el.style.transform='translate3d(0,'+(-o*(k%2?.1:.06)).toFixed(1)+'px,0)'; });
    if(!reduce) wls.forEach(function(o){ var r=o.el.getBoundingClientRect(), p=clamp((vh*.88-r.top)/(vh*.5),0,1), n=Math.round(p*o.ws.length); o.ws.forEach(function(s,i){ s.classList.toggle('on', i<n); }); });
    if(bar) bar.style.transform='scaleX('+(h>0?clamp(s.scrollTop/h,0,1):0).toFixed(4)+')'; }
  addEventListener('scroll',function(){ if(!tk){ tk=true; requestAnimationFrame(frame);} },{passive:true,capture:true});
  frame();
  if(cfg.after) cfg.after({$$:$$,reduce:reduce,fine:fine,clamp:clamp});
}
(function(){
  try{var d=document.documentElement,K='mk-theme',s=null;
  try{s=localStorage.getItem(K)}catch(e){}
  if(s==='light')d.setAttribute('data-theme','light');
  function mount(){
    if(document.querySelector('.thm'))return;
    var b=document.createElement('button');b.className='thm';b.type='button';
    b.setAttribute('aria-label','Cambiar entre modo claro y oscuro');
    b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><g class="moon"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></g><g class="sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></g></svg>';
    b.addEventListener('click',function(e){
      var light=d.getAttribute('data-theme')==='light';
      var apply=function(){if(light)d.removeAttribute('data-theme');else d.setAttribute('data-theme','light');
        try{localStorage.setItem(K,light?'dark':'light')}catch(_){}
        var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',light?'#0c0c0c':'#f6f5f2')};
      var red=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
      if(document.startViewTransition&&!red){
        var x=e.clientX,y=e.clientY,r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
        var t=document.startViewTransition(apply);
        t.ready.then(function(){d.animate({clipPath:['circle(0px at '+x+'px '+y+'px)','circle('+r+'px at '+x+'px '+y+'px)']},{duration:650,easing:'cubic-bezier(.22,1,.36,1)',pseudoElement:'::view-transition-new(root)'})}).catch(function(){});
      }else apply();
    });
    document.body.appendChild(b);
  }
  if(document.body)mount();else document.addEventListener('DOMContentLoaded',mount);
  }catch(e){}
})();
