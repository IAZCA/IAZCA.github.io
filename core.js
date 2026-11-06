/* Shared content + viewer. All text below is copied from the live site. */
(function(){
  var M='media/', yt=function(id){return 'https://img.youtube.com/vi/'+id+'/maxresdefault.jpg'};
  var videos=[
    {t:'Music Video: Car Vibin',d:'',yt:'-UgO388HKr0',clip:M+'car.mp4',poster:M+'car.jpg'},
    {t:'Edit: Malcolm Todd - Earrings',d:'',yt:'0Lm9VfqnqHA',poster:yt('0Lm9VfqnqHA')},
    {t:'Title Sequence: Quarantine Test Opening',d:'',src:'quarantine-test-opening.mp4',clip:M+'quarantine.mp4',poster:M+'quarantine.jpg'},
    {t:'City Symphony: Laurel',d:'',yt:'tgY2s6AMvYc',poster:yt('tgY2s6AMvYc')},
    {t:'Documentary: Music Makes The Movie',d:'',yt:'Ru3RaZ0SZWo',poster:yt('Ru3RaZ0SZWo')},
    {t:'Short: Homeward Bound',d:'',yt:'hc3AOWaUIW0',poster:yt('hc3AOWaUIW0')},
    {t:'Short: Workout With Isaac',d:'',yt:'fHrctBKT-jo',poster:yt('fHrctBKT-jo')}
  ];
  var sound=[
    {t:'Dinosaur Roar',d:'Layered, pitched, and textured foley built from scratch to give an extinct animal a believable voice.',src:'dinosaur-roar.mp4',clip:M+'dino.mp4',poster:M+'dino.jpg'},
    {t:'Robot Sound',d:'Mechanical clicks, servo whines, and synth layers stacked into one cohesive robotic voice.',src:'Robot-Sound.mp4',clip:M+'robot.mp4',poster:M+'robot.jpg'},
    {t:'Sputnik Sound Design',d:'A full soundscape built from scratch for an alien world — creature, environment, and machine.',src:'Sputnik_Sound%20Design%20Project%20-%20Trim.mp4',clip:M+'sputnik.mp4',poster:M+'sputnik.jpg'}
  ];
  var albums=[
    {t:'Moonlite',d:'Album 01',poster:M+'moon1.jpg',photos:[M+'moon1.jpg',M+'moon2.jpg']},
    {t:'Dante’s Retreat',d:'Album 02',poster:M+'dante2.jpg',photos:[M+'dante1.jpg',M+'dante2.jpg',M+'dante3.jpg']},
    {t:'Milk & Honey',d:'Album 03',poster:M+'honey1.jpg',photos:[M+'honey1.jpg',M+'honey2.jpg',M+'honey3.jpg']}
  ];
  videos.forEach(function(x){x.kind='Video'});sound.forEach(function(x){x.kind='Sound'});albums.forEach(function(x){x.kind='Photos'});
  var fl=document.createElement('link');fl.rel='stylesheet';fl.href='https://fonts.googleapis.com/css2?family=Unbounded:wght@300;500;700;800&family=Sora:wght@200;300;400;600&family=Space+Mono:wght@400;700&display=swap';document.head.appendChild(fl);

  var IZ=window.IZ={videos:videos,sound:sound,albums:albums,all:videos.concat(albums,sound),
    name:'Ivan Alexander Zapata',role:'Creative Director · Video Editor · Storyteller',
    tagline:'Impressed yet? The show’s just starting.',
    about:'Audio Video Media Production graduate determined to create appealing projects that engage viewers. His short film placed top two at the Maryland Film Festival 2018, and he co-founded the photography business 3/5ths Production. His drive to create comes from his lifelong dream to entertain and bring joy to those who view his work.',
    email:'Ivanzapata712@gmail.com',bio:M+'bio.jpg'};

  /* Reduced-motion visitors and data savers get stills instead of clips */
  /* ?motion=on forces animation for design previews, because the owner's PC has Windows animation effects turned off */
  var force=/[?&]motion=on/.test(location.search),calm=!force&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(calm)document.documentElement.classList.add('calm');
  IZ.still=calm||(!force&&!!(navigator.connection&&navigator.connection.saveData));
  IZ.phone=matchMedia('(max-width:760px)').matches;

  /* media(item): a muted looping clip when one exists, otherwise the still.
     The poster stays visible if the phone refuses autoplay (iPhone Low Power Mode). */
  IZ.media=function(x,cls){
    if(x.clip&&!IZ.still) return '<video class="'+(cls||'cover')+'" src="'+x.clip+'" poster="'+x.poster+'" muted loop playsinline autoplay preload="none"></video>';
    return '<img class="'+(cls||'cover')+'" src="'+x.poster+'" alt="'+x.t.replace(/"/g,'')+'" loading="lazy">';
  };

  /* Autoplaying clips only run while they are on screen, which saves phone battery and data.
     Add data-manual to a video when the page controls it itself. */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      var v=e.target;if(v.dataset.manual!==undefined)return;
      if(e.isIntersecting&&!IZ.still){var q=v.play();if(q&&q.catch)q.catch(function(){})}else v.pause();
    })},{rootMargin:'80px'});
    var queued=false;
    var scan=function(){queued=false;[].forEach.call(document.querySelectorAll('video[autoplay]:not([data-iz])'),function(v){v.dataset.iz=1;io.observe(v)})};
    new MutationObserver(function(){if(!queued){queued=true;setTimeout(scan,60)}}).observe(document.documentElement,{childList:true,subtree:true});
  }

  /* open(item, element): the clicked element grows into the player.
     Phones: back button closes, swipe down closes, swipe sideways changes photo, rotation refits. */
  IZ.open=function(x,el){
    if(IZ.opened)return;IZ.opened=true;
    var r=el?el.getBoundingClientRect():{left:innerWidth/2-80,top:innerHeight/2-45,width:160,height:90};
    var scrim=document.createElement('div'),box=document.createElement('div'),cap=document.createElement('div'),close=document.createElement('button');
    var root=document.documentElement,oldOverflow=root.style.overflow,oldOver=root.style.overscrollBehaviorY,photo=null,idx=0,done=false,born=performance.now();
    scrim.className='iz-scrim';box.className='iz-box';cap.className='iz-cap';close.className='iz-close';
    close.textContent='×';close.setAttribute('aria-label','Close');
    cap.innerHTML='<b></b><span></span>';cap.firstChild.textContent=x.t;cap.lastChild.textContent=x.d;
    function place(a){box.style.left=a.left+'px';box.style.top=a.top+'px';box.style.width=a.width+'px';box.style.height=a.height+'px'}
    function fit(){
      var W=innerWidth,H=innerHeight,flat=H<500,narrow=W<700;
      if(x.photos){var pw=Math.min(W*(narrow?1:.92),1500),ph=H-(flat?16:narrow?190:150);return{left:(W-pw)/2,top:flat?8:Math.max(64,(H-ph)/2-30),width:pw,height:ph}}
      var w=Math.min(W*(narrow?1:.9),(H-(flat?16:170))*16/9),h=w*9/16;
      return{left:(W-w)/2,top:Math.max(8,(H-h)/2-(flat?0:24)),width:w,height:h};
    }
    place(r);
    var poster=new Image();poster.src=x.poster;poster.className='iz-poster';poster.alt='';box.appendChild(poster);
    [scrim,box,cap,close].forEach(function(n){document.body.appendChild(n)});
    root.style.overflow='hidden';root.style.overscrollBehaviorY='none';
    box.getBoundingClientRect();
    requestAnimationFrame(function(){scrim.classList.add('on');cap.classList.add('on');close.classList.add('on');place(fit())});
    function step(d){if(!photo)return;idx=(idx+d+x.photos.length)%x.photos.length;photo.src=x.photos[idx];cap.lastChild.textContent=(idx+1)+' of '+x.photos.length+' · swipe or tap for more'}
    var n=null,ready=false,grown=false;
    function reveal(){if(ready&&grown&&!done)poster.style.opacity=0}
    function isReady(){ready=true;reveal()}
    if(x.yt){n=document.createElement('iframe');n.src='https://www.youtube.com/embed/'+x.yt+'?autoplay=1&playsinline=1&rel=0';n.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';n.allowFullscreen=true;n.title=x.t;n.onload=isReady}
    else if(x.src){n=document.createElement('video');n.src=x.src;n.controls=true;n.playsInline=true;n.setAttribute('playsinline','');n.onloadeddata=isReady}
    else if(x.photos){n=photo=document.createElement('img');n.alt=x.t;n.onload=isReady;n.src=x.photos[0];n.style.cursor='pointer';n.onclick=function(e){var q=box.getBoundingClientRect();step(e.clientX<q.left+q.width*.3?-1:1)};cap.lastChild.textContent='1 of '+x.photos.length+' \u00b7 swipe or tap for more'}
    if(n){box.insertBefore(n,poster);if(x.src){var pl=n.play();if(pl&&pl.catch)pl.catch(function(){})}}
    setTimeout(function(){grown=true;reveal()},620);
    setTimeout(isReady,3000);
    var sx=0,sy=0,st=false;
    function down(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY;st=true}
    function up(e){if(!st)return;st=false;var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
      if(Math.abs(dy)>70&&Math.abs(dy)>Math.abs(dx)*1.3)shut();else if(photo&&Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){if(e.cancelable)e.preventDefault();step(dx<0?1:-1)}}
    [scrim,box].forEach(function(n){n.addEventListener('touchstart',down,{passive:true});n.addEventListener('touchend',up)});
    scrim.addEventListener('touchmove',function(e){e.preventDefault()},{passive:false});
    function refit(){place(fit())}
    function shut(viaBack){
      if(done)return;done=true;
      document.removeEventListener('keydown',key);removeEventListener('resize',refit);removeEventListener('popstate',pop);
      if(viaBack!==true)history.back();
      [].slice.call(box.children).forEach(function(c){if(c!==poster)c.remove()});
      poster.style.opacity=1;scrim.classList.remove('on');cap.classList.remove('on');close.classList.remove('on');
      root.style.overflow=oldOverflow;root.style.overscrollBehaviorY=oldOver;place(el?el.getBoundingClientRect():r);
      setTimeout(function(){IZ.opened=false},240);
      setTimeout(function(){[scrim,box,cap,close].forEach(function(n){n.remove()});if(el&&el.focus)el.focus({preventScroll:true})},640);
    }
    function pop(){shut(true)}
    function key(e){if(e.key==='Escape')shut();if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)}
    history.pushState({iz:1},'');
    addEventListener('popstate',pop);addEventListener('resize',refit);
    document.addEventListener('keydown',key);scrim.onclick=function(){if(performance.now()-born>450)shut()};close.onclick=shut;close.focus({preventScroll:true});
  };

  /* wire every [data-open="group:index"] element to the viewer */
  document.addEventListener('click',function(e){
    var el=e.target.closest&&e.target.closest('[data-open]');if(!el)return;
    var p=el.dataset.open.split(':');IZ.open(IZ[p[0]][+p[1]],el);
  });
  IZ.tick=function(fn){var q=false;function run(){q=false;fn()}addEventListener('scroll',function(){if(!q){q=true;requestAnimationFrame(run)}},{passive:true});addEventListener('resize',fn);fn()};
  IZ.clamp=function(v,a,b){return Math.max(a,Math.min(b,v))};
})();
