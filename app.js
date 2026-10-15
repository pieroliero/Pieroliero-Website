const dialog = document.querySelector('#drawer');
const content = document.querySelector('#panel-content');
const ig = 'https://www.instagram.com/pieroliero/';
const passport = 'https://www.instagram.com/passport_pros/';
const link = (url, text) => `<a class="panel-link" href="${url}" target="_blank" rel="noopener noreferrer">${text} ↗</a>`;
const panels = {
 about: `<p class="eyebrow">YOUR HOST / PIERRE REAL</p><h2>Meet the Professor.</h2><img class="profile" src="assets/professor.webp" alt="Portrait of PieroLiero"><p>Comedian. Traveler. Nightlife observer. And now, behind the decks.</p><p>PieroLiero is where the Professor’s theories meet the real world: international adventures, Figueroa Street stories, and commentary delivered with a very straight face.</p><p>Passport Pro is part of the journey. DJing and Bad Decisions are the next chapter. The common denominator? The person taking you along.</p>${link(ig, 'Follow PieroLiero')}`,
 lectures: `<p class="eyebrow">I / THE LECTURE HALL</p><h2>Lectures / Shorts.</h2><p>The Hofessor’s lessons. Pick a lecture and watch it on YouTube.</p><div class="gallery-toolbar">${link('https://www.youtube.com/playlist?list=PLGANYRTW9Zv-Fdb-zQgf5UdRt7xF1xF2Q','Open the full playlist')}<span class="curation-label">HOFESSOR LESSONS</span></div><div id="lecture-grid" class="reel-grid lecture-grid"></div>`,
 upcoming: `<p class="eyebrow">EVENTS / BAD DECISIONS</p><h2>Bad Decisions.</h2><p>Events and the new website are coming soon.</p>`,
 research: `<p class="eyebrow">LESSONS / FIELD RESEARCH</p><h2>Lessons / Field Research.</h2><p>Twelve posts from my Instagram grid, with my three pinned videos first. Open any post to see it on Instagram.</p><div class="gallery-toolbar">${link(ig,'Visit @pieroliero')}<span class="curation-label">FROM MY MAIN GRID</span></div><div id="reel-grid" class="reel-grid"></div><p class="availability">Profile snapshot · October 14, 2026.</p>`,
 live: `<p class="eyebrow">LIVE / KICK</p><h2>Live from the field.</h2><p>Follow the live field trips and everything that happens between the lectures.</p><a class="kick-channel" href="https://kick.com/pieroliero" target="_blank" rel="noopener noreferrer"><span class="kick-mark">K</span><span><small>PIEROLIERO ON KICK</small><strong>Catch the next live stream.</strong></span><b>↗</b></a><div class="replay-heading"><h3>Latest broadcasts</h3><button id="refresh-kick" class="feed-refresh">Refresh ↻</button></div><div id="kick-replays" class="vlog-grid" aria-live="polite"><p>Checking the broadcast archive…</p></div>${link('https://kick.com/pieroliero/videos','See all replays on Kick')}`,
 travel: `<p class="eyebrow">III / THE DEPARTURE LOUNGE</p><h2>Study Abroad.</h2><p>Actual field trips. Actual questionable decisions. Pick a vlog and come along.</p><div class="gallery-toolbar">${link('https://www.youtube.com/@pieroliero1','Visit my YouTube channel')}</div><div id="vlog-grid" class="vlog-grid"></div><button class="load-vlogs" id="load-vlogs" type="button">More field trips ↓</button><div class="passport-note"><strong>The Passport Pro chapter</strong><p>The travel legacy that helped build this world.</p>${link(passport,'Explore Passport Pro')}</div>`,
 music: `<p class="eyebrow">IV / AFTER HOURS</p><h2>The Professor takes the decks.</h2><p>Class dismissed. New subject: DJing.</p><div class="music-card"><span class="record-disc">◉</span><div><small>THE MUSIC CHAPTER</small><h3>No Money, No Honey</h3><p>PieroLiero / Bad Decisions</p></div></div><p>Bad Decisions is one project in the larger PieroLiero world. The story continues after the lecture ends.</p><p class="availability">Spotify — coming soon as PieroLiero. Follow for release updates.</p>${link(ig,'Follow the music chapter')}`,
 contact: `<p class="eyebrow">OFFICE VISITS / BY APPOINTMENT</p><h2>Let’s make it interesting.</h2><p>For DJ bookings, comedy, creative collaborations, and brand partnerships, start a conversation with PieroLiero.</p>${link(ig,'Contact PieroLiero on Instagram')}<p class="availability">Booking email and event details will be added before launch.</p>`
};
const vlogs = window.PIEROLIERO_VLOGS || [];
const escapeHtml = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let visibleVlogs = 8;
function renderVlogs() {
 const grid=content.querySelector('#vlog-grid');if(!grid)return;
 grid.innerHTML=vlogs.slice(0,visibleVlogs).map(v=>`<a class="vlog-card" href="${escapeHtml(v.url)}" target="_blank" rel="noopener noreferrer"><span class="vlog-thumbnail"><img src="${escapeHtml(v.thumbnail)}" alt="${escapeHtml(v.title)}" loading="lazy"><span aria-hidden="true">▶</span></span><strong>${escapeHtml(v.title)}</strong><small>WATCH ON YOUTUBE ↗</small></a>`).join('');
 content.querySelector('#load-vlogs').hidden=visibleVlogs>=vlogs.length;
}
function renderReels(){
 const grid=content.querySelector('#reel-grid');
 grid.innerHTML=(window.PIEROLIERO_GRID||[]).slice(0,12).map((r,i)=>`<a class="reel-card" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open Instagram grid post ${i+1}"><span class="reel-thumbnail"><img src="${escapeHtml(r.thumbnail)}" alt="${escapeHtml(r.title||'Post from PieroLiero’s Instagram grid')}" loading="lazy"><span class="reel-play" aria-hidden="true">↗</span></span></a>`).join('');
}
function renderLectures(){
 const grid=content.querySelector('#lecture-grid');
 grid.innerHTML=(window.PIEROLIERO_LECTURES||[]).map(v=>`<a class="reel-card lecture-card" href="${escapeHtml(v.url)}" target="_blank" rel="noopener noreferrer" aria-label="Watch ${escapeHtml(v.title)} on YouTube"><span class="reel-thumbnail"><img src="${escapeHtml(v.thumbnail)}" alt="${escapeHtml(v.title)}" loading="lazy"><span class="reel-play" aria-hidden="true">▶</span></span><strong>${escapeHtml(v.title)}</strong></a>`).join('');
}
async function loadKick(){
 const grid=content.querySelector('#kick-replays');if(!grid)return;
 grid.innerHTML='<p>Checking the broadcast archive…</p>';
 try{
  const response=await fetch('api/kick-replays',{cache:'no-store',signal:AbortSignal.timeout(16000)});if(!response.ok)throw new Error('Feed unavailable');
  const feed=await response.json();if(!dialog.open||content.querySelector('#kick-replays')!==grid)return;
  if(feed.status==='unavailable')throw new Error('Feed unavailable');
  const videos=(feed.videos||[]).filter(v=>{try{const url=new URL(v.url);return url.protocol==='https:'&&url.hostname==='kick.com'&&url.pathname.startsWith('/pieroliero/videos/')}catch{return false}});
  grid.innerHTML=videos.length?videos.slice(0,8).map(v=>`<a class="vlog-card" href="${escapeHtml(v.url)}" target="_blank" rel="noopener noreferrer"><span class="vlog-thumbnail">${v.thumbnail&&/^https:\/\//.test(v.thumbnail)?`<img src="${escapeHtml(v.thumbnail)}" alt="${escapeHtml(v.title)}" loading="lazy">`:''}<span aria-hidden="true">▶</span></span><strong>${escapeHtml(v.title||'PieroLiero live replay')}</strong><small>WATCH ON KICK ↗</small></a>`).join(''):'<div class="replay-empty"><span aria-hidden="true">◉</span><h3>The archive starts here.</h3><p>No saved broadcasts are listed on Kick yet. This section checks for new replays each time you open it.</p></div>';
 }catch{
  if(content.querySelector('#kick-replays')===grid)grid.innerHTML='<div class="replay-empty"><h3>Take a seat on Kick.</h3><p>The replay list couldn’t refresh right now. Open the channel for the latest broadcasts.</p></div>';
 }
}
let opener;
function openPanel(key,button) {
 if(!panels[key]) return;
 opener=button;
 content.innerHTML=panels[key];
 dialog.classList.toggle('gallery-dialog',key==='travel'||key==='research'||key==='live'||key==='lectures');
 if(key==='travel'){visibleVlogs=8;renderVlogs();}
 content.querySelector('h2').id='dialog-title';
 if(key==='research') renderReels();
 if(key==='lectures') renderLectures();
 if(key==='live') loadKick();
 dialog.showModal();dialog.scrollTop=0;
}
document.addEventListener('click', event=>{
 const button=event.target.closest('[data-open]');if(button) openPanel(button.dataset.open,button);
 if(event.target.closest('#refresh-kick'))loadKick();
 if(event.target.closest('#load-vlogs')){visibleVlogs+=8;renderVlogs();}
});
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close();}});
dialog.addEventListener('close',()=>{content.querySelectorAll('video').forEach(v=>v.pause());document.body.style.overflow='';opener?.focus();});
dialog.addEventListener('toggle',()=>{if(dialog.open) document.body.style.overflow='hidden';});
document.querySelector('#year').textContent=new Date().getFullYear();
