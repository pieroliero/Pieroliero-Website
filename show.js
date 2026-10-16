const screen=document.querySelector('#screen'),screenContent=document.querySelector('#screen-content');
const channelOrder=['music','travel','research','live','events','store'];let currentChannel='music',powered=true,tuningTimer;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const channelInfo={music:{number:'01',name:'AFTER HOURS',action:'Explore the music'},travel:{number:'02',name:'ON THE ROAD',action:'Watch the vlogs'},research:{number:'03',name:'REAL LIFE / INSTAGRAM',action:'Open the reels'},live:{number:'04',name:'LIVE FROM KICK',action:'Open Kick broadcasts'},events:{number:'05',name:'BAD DECISIONS',action:'See event updates'},store:{number:'06',name:'THE SHOPPING CHANNEL',action:'Visit the store'}};
// YouTube HQ thumbnails contain a 16:9 picture inside a 480x360 file.
// Crop only the baked-in bands, then fit the complete picture across the CRT.
function vlogPicture(src,title){const url=escapeHtml(src),label=escapeHtml(title);return `<svg class="picture vlog-picture" viewBox="0 45 480 270" preserveAspectRatio="xMinYMid slice" role="img" aria-label="${label}"><defs><clipPath id="vlog-content-crop"><rect x="0" y="45" width="480" height="270"/></clipPath></defs><image href="${url}" x="0" y="0" width="480" height="360" preserveAspectRatio="none" clip-path="url(#vlog-content-crop)"/></svg>`;}
function renderChannel(key){const info=channelInfo[key];let body='';
 if(key==='music')body=`<img class="screen-portrait" src="assets/professor.webp" alt="Pierre Real, PieroLiero"><div class="music-copy"><h2>AFTER<br>HOURS.</h2><p>The music chapter.<br>Spotify coming soon.</p></div><span class="screen-caption">YOUR HOST: PIERRE REAL</span>`;
 if(key==='travel'){const v=(window.PIEROLIERO_VLOGS||[])[0];body=`${vlogPicture(v.thumbnail,v.title)}<div class="shade"></div><div class="program-copy"><small>THE TRAVEL EPISODES</small><h2>International<br>incidents.</h2><p>Vlogs, detours, and the Passport Pro chapter.</p></div>`;}
 if(key==='research'){const r=(window.PIEROLIERO_GRID||[])[0];body=`<img class="picture" src="${escapeHtml(r.thumbnail)}" alt="Post from PieroLiero’s Instagram"><div class="shade"></div><div class="program-copy"><small>INSTAGRAM REELS</small><h2>Straight from<br>the feed.</h2><p>Comedy. Street stories. Nightlife.</p></div>`;}
 if(key==='live')body='<div class="test-pattern"></div><div class="program-copy"><small>PIEROLIERO ON KICK</small><h2>Live from<br>Kick.</h2><p>Follow the broadcasts. See what happens.</p></div>';
 if(key==='events')body='<img class="picture event-photo" src="assets/bad-decisions-club.webp" alt="Bad Decisions nightclub scene"><div class="shade"></div><img class="events-logo" src="assets/bad-decisions-logo.png" alt=""><div class="program-copy"><small>EVENTS / AFTER HOURS</small><h2>Bad<br>Decisions.</h2><p>Don’t make other plans just yet.</p></div>';
 if(key==='store')body='<img class="picture" src="assets/store/image-0.jpg" alt="Pieroliero Third Wheels on Your Hinge Date"><div class="shade"></div><div class="program-copy"><small>EXCEPTIONALLY QUESTIONABLE VALUE</small><h2>As seen on<br>PieroLiero.</h2><p>The original joke store.</p></div>';
 const action=key==='store'?`<a class="on-screen-action" href="store.html">${info.action} <svg class="ui-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg></a>`:`<button class="on-screen-action" data-panel="${key}">${info.action} <svg class="ui-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg></button>`;
 screenContent.innerHTML=`<div class="broadcast ${key}-broadcast"><span class="ident">LATE NIGHT WITH PIEROLIERO</span><span class="channel-id">${info.number}</span>${body}${action}</div>`;
 screen.setAttribute('aria-label',`Channel ${info.number}: ${info.name}`);
}
function switchChannel(key){if(!channelOrder.includes(key))return;stopTuningSound();clearTimeout(tuningTimer);powered=true;screen.classList.remove('is-off');document.querySelector('#power').setAttribute('aria-pressed','true');document.querySelector('#power').setAttribute('aria-label','Turn television off');currentChannel=key;document.querySelectorAll('[data-channel]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.channel===key)));document.querySelector('.dial').style.transform=`rotate(${channelOrder.indexOf(key)*55}deg)`;if(reducedMotion.matches){screen.classList.remove('is-tuning');renderChannel(key);return;}screen.classList.add('is-tuning');playTuningSound();renderChannel(key);tuningTimer=setTimeout(()=>{screen.classList.remove('is-tuning');stopTuningSound()},260);}
document.querySelectorAll('[data-channel]').forEach(b=>b.addEventListener('click',()=>switchChannel(b.dataset.channel)));
document.querySelector('#next-channel').addEventListener('click',()=>switchChannel(channelOrder[(channelOrder.indexOf(currentChannel)+1)%channelOrder.length]));
document.querySelector('#power').addEventListener('click',()=>{powered=!powered;stopTuningSound();clearTimeout(tuningTimer);screen.classList.remove('is-tuning');screen.classList.toggle('is-off',!powered);document.querySelector('#power').setAttribute('aria-pressed',String(powered));document.querySelector('#power').setAttribute('aria-label',powered?'Turn television off':'Turn television on');});
reducedMotion.addEventListener('change',()=>{stopTuningSound();clearTimeout(tuningTimer);screen.classList.remove('is-tuning')});renderChannel(currentChannel);

// Featured and shuffled programs use the same saved content as the galleries.
const programs=[...(window.PIEROLIERO_VLOGS||[]).map(v=>({...v,channel:'travel',category:'ON THE ROAD'})),...(window.PIEROLIERO_GRID||[]).map(v=>({...v,channel:'research',category:'INSTAGRAM REEL'}))];
let lastProgram=null;
function tuneProgram(program){
 switchChannel(program.channel);
 lastProgram=program;
 const title=program.channel==='research'?'Straight from the feed.':program.title;
 screenContent.innerHTML=`<div class="broadcast episode-broadcast ${program.channel}-episode"><span class="ident">LATE NIGHT WITH PIEROLIERO</span><span class="channel-id">${channelInfo[program.channel].number}</span>${program.channel==='travel'?vlogPicture(program.thumbnail,title):`<img class="picture" src="${escapeHtml(program.thumbnail)}" alt="${escapeHtml(title)}">`}<div class="shade"></div><div class="program-copy"><small>${program.category}</small><h2>${escapeHtml(title)}</h2></div><a class="on-screen-action" href="${escapeHtml(program.url)}" target="_blank" rel="noopener">Watch on ${program.channel==='travel'?'YouTube':'Instagram'} <svg class="ui-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14"/></svg></a></div>`;
 screen.setAttribute('aria-label',`Now showing: ${title}`);
 document.querySelector('#surprise-me').setAttribute('aria-label',`Surprise me again. Selected: ${title}`);
}
if(programs.length){
 const featured=programs[0];
 document.querySelector('#feature-thumbnail').src=featured.thumbnail;
 document.querySelector('#feature-title').textContent=featured.title;
 document.querySelector('#tonight-feature').addEventListener('click',()=>tuneProgram(featured));
 document.querySelector('#surprise-me').addEventListener('click',()=>{
  const choices=programs.filter(p=>p!==lastProgram);
  tuneProgram(choices[Math.floor(Math.random()*choices.length)]||featured);
 });
}else document.querySelector('.feature-strip').hidden=true;

// Scroll moves the physical objects; reduced-motion users get a still layout.
const physicalRecord=document.querySelector('.large-record');
const physicalPhoto=document.querySelector('.host-photo');
let physicalFrame=0,lastVinylScroll=-Infinity;
function updatePhysicalObjects(){
 physicalFrame=0;
 checkVinylSound();
 if(reducedMotion.matches){physicalRecord.style.removeProperty('--record-turn');physicalPhoto.style.removeProperty('--photo-turn');return;}
 const recordBox=physicalRecord.getBoundingClientRect();
 const recordProgress=(innerHeight-recordBox.top)/(innerHeight+recordBox.height);
 physicalRecord.style.setProperty('--record-turn',`${recordProgress*280}deg`);
 const photoBox=physicalPhoto.getBoundingClientRect();
 const photoProgress=Math.max(0,Math.min(1,(innerHeight-photoBox.top)/(innerHeight+photoBox.height)));
 physicalPhoto.style.setProperty('--photo-turn',`${-5+photoProgress*7}deg`);
}
function schedulePhysicalObjects(){if(!physicalFrame)physicalFrame=requestAnimationFrame(updatePhysicalObjects)}
addEventListener('scroll',()=>{lastVinylScroll=performance.now();schedulePhysicalObjects()},{passive:true});
addEventListener('resize',schedulePhysicalObjects,{passive:true});
reducedMotion.addEventListener('change',schedulePhysicalObjects);
schedulePhysicalObjects();



const wallpaper=document.querySelector('.reel-wallpaper');
if(wallpaper){
 const shots=(window.PIEROLIERO_GRID||[]).map(r=>r.thumbnail);
 // Keep the original collage and use each selected picture once.
 shots[0]='assets/grid/DJHsSnTyZDs.jpg';
 shots[5]='assets/collage/extinguisher.webp';
 shots[3]='assets/collage/amsterdam-pierre.webp';
 shots[9]='assets/collage/night-out.webp';
 shots[10]='assets/collage/night-market.webp';
 shots[11]='assets/collage/amsterdam-windows.webp';
 shots.push('assets/collage/limo.webp');
 wallpaper.innerHTML=shots.map((src,i)=>`<div class="wallpaper-photo" style="--tilt:${[-7,4,-3,8,5,-6,7,-4,-5,6,-8,3][i%12]}deg"><img src="${escapeHtml(src)}" alt="" loading="lazy"></div>`).join('');
}

// A short excerpt of the supplied TV recording, audible only during visible static.
let tvAudioContext=null,tvSoundEnabled=true;
const soundToggle=document.querySelector('#tuning-sound');
try{tvSoundEnabled=localStorage.getItem('pieroliero-tv-sound')!=='off'}catch{}
function updateSoundToggle(){soundToggle.textContent=`TV sound: ${tvSoundEnabled?'on':'off'}`;soundToggle.setAttribute('aria-pressed',String(tvSoundEnabled));soundToggle.setAttribute('aria-label',tvSoundEnabled?'Mute TV tuning sound':'Enable TV tuning sound')}
soundToggle.addEventListener('click',()=>{tvSoundEnabled=!tvSoundEnabled;if(!tvSoundEnabled)stopTuningSound();try{localStorage.setItem('pieroliero-tv-sound',tvSoundEnabled?'on':'off')}catch{}updateSoundToggle()});
updateSoundToggle();
let tuningBuffer=null,tuningSource=null;
// Decode ahead of the first channel change so sound starts with the visual effect.
fetch('assets/tv-channel-static.wav').then(response=>{
 if(!response.ok)throw new Error('TV sound unavailable');
 return response.arrayBuffer();
}).then(async bytes=>{
 const AudioEngine=window.AudioContext||window.webkitAudioContext;
 if(!AudioEngine)return;
 if(!tvAudioContext)tvAudioContext=new AudioEngine();
 tuningBuffer=await tvAudioContext.decodeAudioData(bytes);
 // A quiet, damped knob click at the start of the supplied static clip.
 for(let channel=0;channel<tuningBuffer.numberOfChannels;channel++){
  const samples=tuningBuffer.getChannelData(channel);
  for(let i=0;i<Math.min(samples.length,tuningBuffer.sampleRate*.012);i++)samples[i]+=(Math.random()*2-1)*.22*Math.exp(-i/(tuningBuffer.sampleRate*.0014));
 }
}).catch(()=>{});
function stopTuningSound(){
 if(!tuningSource)return;
 try{tuningSource.stop()}catch{}
 tuningSource=null;
}
async function playTuningSound(){
 if(!tvSoundEnabled||!tuningBuffer||!tvAudioContext)return;
 if(tvAudioContext.state==='suspended'){try{await tvAudioContext.resume()}catch{return}}
 if(tvAudioContext.state!=='running'||!tvSoundEnabled||!screen.classList.contains('is-tuning')||document.hidden)return;
 const source=tvAudioContext.createBufferSource(),gain=tvAudioContext.createGain();
 source.buffer=tuningBuffer;gain.gain.value=.8;
 source.connect(gain);gain.connect(tvAudioContext.destination);
 tuningSource=source;
 source.onended=()=>{source.disconnect();gain.disconnect();if(tuningSource===source)tuningSource=null};
 source.start();
}
addEventListener('visibilitychange',()=>{if(document.hidden)stopTuningSound()});

// Short scratches follow scrolling while the vinyl is visible, with room between them.
let lastVinylScratch=-Infinity,vinylInView=false;
function playVinylScratch(){
 if(document.hidden||reducedMotion.matches||performance.now()-lastVinylScroll>180||performance.now()-lastVinylScratch<750||!vinylInView||!tvSoundEnabled||!tvAudioContext||tvAudioContext.state!=='running')return;
 lastVinylScratch=performance.now();
 physicalRecord.dataset.scratchCount=String((Number(physicalRecord.dataset.scratchCount)||0)+1);
 const audio=tvAudioContext,now=audio.currentTime;
 const scratch=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();
 const buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*.3),audio.sampleRate),samples=buffer.getChannelData(0);
 for(let i=0;i<samples.length;i++){const t=i/audio.sampleRate;samples[i]=(Math.random()*2-1)*.65+Math.sin(t*2*Math.PI*340)*.16;}
 scratch.buffer=buffer;scratch.playbackRate.setValueAtTime(1.2,now);scratch.playbackRate.linearRampToValueAtTime(.45,now+.12);scratch.playbackRate.linearRampToValueAtTime(1.45,now+.24);
 filter.type='bandpass';filter.Q.value=1.4;filter.frequency.setValueAtTime(2200,now);filter.frequency.exponentialRampToValueAtTime(420,now+.12);filter.frequency.exponentialRampToValueAtTime(1800,now+.24);
 gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.11,now+.018);gain.gain.linearRampToValueAtTime(.03,now+.12);gain.gain.linearRampToValueAtTime(.085,now+.17);gain.gain.exponentialRampToValueAtTime(.0001,now+.27);
 scratch.connect(filter);filter.connect(gain);gain.connect(audio.destination);scratch.start(now);scratch.stop(now+.28);
 scratch.onended=()=>{scratch.disconnect();filter.disconnect();gain.disconnect()};
}
async function unlockSiteSound(){
 if(!tvSoundEnabled)return;
 const AudioEngine=window.AudioContext||window.webkitAudioContext;if(!AudioEngine)return;
 try{if(!tvAudioContext)tvAudioContext=new AudioEngine();if(tvAudioContext.state==='suspended')await tvAudioContext.resume();checkVinylSound()}catch{}
}
// Touch browsers often unlock audio on release rather than pointer-down.
addEventListener('pointerdown',unlockSiteSound,{passive:true});
addEventListener('pointerup',unlockSiteSound,{passive:true});
addEventListener('touchend',unlockSiteSound,{passive:true});
addEventListener('click',unlockSiteSound,{passive:true});
addEventListener('wheel',unlockSiteSound,{passive:true});
function checkVinylSound(){
 const box=physicalRecord.getBoundingClientRect();
 const visibleHeight=Math.max(0,Math.min(box.bottom,innerHeight)-Math.max(box.top,0));
 const wasVisible=vinylInView;
 vinylInView=visibleHeight>=Math.min(box.height,innerHeight)*.25;
 if(!vinylInView&&wasVisible)lastVinylScratch=-Infinity;
 if(vinylInView)playVinylScratch();
}

addEventListener('keydown',unlockSiteSound,{passive:true});
if('IntersectionObserver' in window){
 const scratchObserver=new IntersectionObserver(checkVinylSound,{threshold:[0,.1,.25,.35]});
 scratchObserver.observe(physicalRecord);
}
