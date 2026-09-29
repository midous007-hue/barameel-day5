/* BARAMEEL WORLD V14
   Source of truth: server for production; localStorage is only a UI cache.
*/
(() => {
  const VERSION='20260928-14';
  const KEY='barameel.v14.player';
  const CONFIG=window.BARAMEEL_CONFIG||{apiBase:'',production:false};
  const RUNNERS=['brona','chiller','dreamer','racer','rookie','skater'];
  const RUNNER_NAMES={brona:'BRONA',chiller:'THE CHILLER',dreamer:'THE DREAMER',racer:'THE RACER',rookie:'THE ROOKIE',skater:'THE SKATER'};
  const defaults={playerId:null,nickname:'',runner:'brona',points:0,weeklyPoints:0,rank:null,playerCount:0,checkpoints:[],collected:{collection01:{}},matches:[],lastReward:null,totalScans:0,lastSeen:null};
  let state=load();
  if(!state.playerId){state.playerId=crypto.randomUUID();state.createdAt=Date.now();save()}

  function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}}}
  function save(){state.lastSeen=Date.now();localStorage.setItem(KEY,JSON.stringify(state))}
  function patch(p){state={...state,...p};save();return state}
  function setNickname(v){patch({nickname:String(v||'').trim().slice(0,24)})}
  function setRunner(v){if(RUNNERS.includes(v))patch({runner:v})}
  function selected(){return state.runner||'brona'}
  function addPoints(n){const x=Number(n)||0;patch({points:Math.max(0,(Number(state.points)||0)+x),weeklyPoints:Math.max(0,(Number(state.weeklyPoints)||0)+x)})}
  function checkpointKey(c,i,p){return `${c}|${i}|${String(p).padStart(2,'0')}`}
  function registerCheckpoint(c,i,p){const k=checkpointKey(c,i,p);if(!state.checkpoints.includes(k)){state.checkpoints=[...state.checkpoints,k];save();return true}return false}
  function checkpointCount(){return state.checkpoints.length}
  function collect(c,i,p){state.collected[c]??={};state.collected[c][i]??=[];const id=String(p).padStart(2,'0');if(!state.collected[c][i].includes(id)){state.collected[c][i].push(id);registerCheckpoint(c,i,p);save();return true}return false}
  function pieces(c,i){return(state.collected[c]?.[i]||[]).map(Number).sort((a,b)=>a-b)}
  function count(c,i){return pieces(c,i).length}
  function hasPiece(c,i,p){return pieces(c,i).includes(Number(p))}
  function setLastReward(r){patch({lastReward:r})}

  const SOUND_FILES={tap:'./audio/tap.wav',select:'./audio/select.wav',confirm:'./audio/confirm.wav',back:'./audio/back.wav',scan:'./audio/scan.wav',error:'./audio/error.wav',completion:'./audio/completion-arcade.wav',levelup:'./audio/reward-levelup.mp3'};
  const bank={}; let unlocked=false; let ctx=null;
  function audio(){if(ctx)return ctx;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();const g=ctx.createGain();g.gain.value=.86;g.connect(ctx.destination);ctx.master=g;return ctx}
  function unlockAudio(){const c=audio();if(!c)return;try{if(c.state==='suspended')c.resume()}catch{};unlocked=true}
  function tone(f,d=.08,type='square',gain=.22,delay=0){const c=audio();if(!c)return;try{if(c.state==='suspended')c.resume();const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+delay;o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(c.master);o.start(t);o.stop(t+d+.02)}catch{}}
  function prime(){Object.entries(SOUND_FILES).forEach(([k,s])=>{if(bank[k])return;const a=new Audio(s);a.preload='auto';a.playsInline=true;bank[k]=a})}
  function fallback(k){if(k==='back'){tone(659,.07,'square',.24);tone(523,.09,'square',.22,.07);tone(392,.12,'triangle',.18,.16)}else if(k==='error'){tone(220,.09,'sawtooth',.28);tone(160,.12,'sawtooth',.26,.1)}else if(k==='scan'){[660,880,1175,1568].forEach((f,i)=>tone(f,.055,'square',.23,i*.055))}else if(k==='confirm'){[523,659,784,1047,1568].forEach((f,i)=>tone(f,.06,'square',.25,i*.05))}else if(k==='select'){[392,523,659,988,1319].forEach((f,i)=>tone(f,.06,i===4?'triangle':'square',.24,i*.045))}else{tone(740,.06,'square',.23);tone(1040,.05,'square',.2,.055)}}
  function play(k){prime();unlockAudio();const a=bank[k];if(!a){fallback(k);return}try{a.currentTime=0;a.volume=1;const p=a.play();p?.catch(()=>fallback(k))}catch{fallback(k)}}
  function playSelect(){play('select')}
  function playCompletionSound(){play('completion')}
  function playPointsCountUp(amount,duration=2300){unlockAudio();const steps=Math.max(22,Math.min(40,Math.round(duration/58)));const span=duration/steps;for(let i=0;i<steps;i++){const p=i/(steps-1),f=420+(1320-420)*(p*p);tone(f,.045,'square',.10,.06+i*span/1000)}[880,1175,1568].forEach((f,i)=>tone(f,.08,'triangle',.18,Math.max(0,(duration-(220-i*90))/1000)))}
  ['pointerdown','touchstart','mousedown','keydown'].forEach(e=>window.addEventListener(e,unlockAudio,{capture:true,passive:true}));

  function go(url){location.href=url}
  function goAfter(url,sound='tap',delay=180){play(sound);setTimeout(()=>go(url),delay)}
  function idle(fn){if('requestIdleCallback' in window)requestIdleCallback(fn,{timeout:900});else setTimeout(fn,80)}
  function preload(src){const i=new Image();i.decoding='async';i.src=src;return i}
  function preloadAll(xs){xs.forEach(preload)}
  function flash(target=document.body){let el=target.querySelector?.('.barameel-flash');if(!el){el=document.createElement('div');el.className='barameel-flash';target.appendChild(el)}el.classList.remove('on');void el.offsetWidth;el.classList.add('on')}

  async function api(path,body,method='POST'){if(!CONFIG.apiBase)return null;try{const r=await fetch(CONFIG.apiBase.replace(/\/$/,'')+path,{method,headers:{'content-type':'application/json'},body:body?JSON.stringify(body):undefined,credentials:'include',cache:'no-store'});if(!r.ok)throw Error(String(r.status));return await r.json()}catch(e){console.warn('[BARAMEEL API]',path,e);return null}}
  async function track(event,meta={}){return api('/analytics',{player_id:state.playerId,event,meta,path:location.pathname,ts:Date.now()})}
  async function syncPlayer(){const r=await api('/player',{player_id:state.playerId,nickname:state.nickname,runner:state.runner});if(r?.player){state={...state,...r.player};save();return r.player}return null}
  async function scanUniversal({qrToken='BARAMEEL-UNIVERSAL',ticketId=null}){const r=await api('/scan',{player_id:state.playerId,qr_token:qrToken,ticket_id:ticketId,idempotency_key:'scan-'+crypto.randomUUID()});if(r?.player){state={...state,...r.player};save()}return r}
  async function duoLink(otherPlayerId){const r=await api('/duo-link',{player_id:state.playerId,other_player_id:otherPlayerId,idempotency_key:'link-'+crypto.randomUUID()});if(r?.player){state={...state,...r.player};save()}return r}

  const memory={};
  async function fetchCollection(id='collection01'){if(memory[id])return memory[id];const key='barameel.collection.'+id;try{const c=sessionStorage.getItem(key);if(c){memory[id]=JSON.parse(c);return memory[id]}}catch{}const r=await fetch(`./assets/collections/${id}/collection.json`,{cache:'force-cache'});if(!r.ok)throw Error('collection unavailable');const d=await r.json();memory[id]=d;try{sessionStorage.setItem(key,JSON.stringify(d))}catch{}return d}

  function parseQR(raw){const s=decodeURIComponent(String(raw||'')).trim();if(/^BARAMEEL[-_:]?(UNIVERSAL|CHECKPOINT)/i.test(s)||/barameel-universal/i.test(s))return {type:'universal',token:'BARAMEEL-UNIVERSAL'};let m=s.match(/collection0?(\d+)\|image0?(\d+)\|piece0?(\d+)/i);if(m)return {type:'legacy',collection:`collection${String(m[1]).padStart(2,'0')}`,image:`image${String(m[2]).padStart(2,'0')}`,piece:Number(m[3])};return null}

  // Demo-only reward draw. Production MUST use /scan on the backend.
  async function demoUniversalDraw(){const cfg=await fetchCollection('collection01');const images=cfg.images||[];const pool=[];images.forEach(im=>(im.pieces||[]).forEach(p=>pool.push({collection:'collection01',image:im.imageId,piece:Number(p.piece_number),points:Number(p.points||20000),rarity:p.rarity||'COMMON',masterFile:im.masterFile})));const r=pool[Math.floor(Math.random()*pool.length)];const fresh=collect(r.collection,r.image,r.piece);if(fresh)addPoints(r.points);const reward={...r,duplicate:!fresh,at:Date.now(),universal:true};setLastReward(reward);state.totalScans=(state.totalScans||0)+1;save();return {ok:true,demo:true,reward,player:state}}

  window.BR={CONFIG,VERSION,RUNNERS,RUNNER_NAMES,get state(){return state},patch,setRunner,setNickname,selected,addPoints,collect,pieces,count,hasPiece,setLastReward,checkpointCount,registerCheckpoint,play,playSelect,playCompletionSound,playPointsCountUp,go,goAfter,idle,preload,preloadAll,flash,api,track,syncPlayer,scanUniversal,duoLink,fetchCollection,parseQR,demoUniversalDraw,save};
})();
