const SUPABASE_URL='https://uysehlmmxgmfrpkhjcfn.supabase.co';
const SUPABASE_KEY='sb_publishable_CBJSE4rECgDP1C69xF54Qg_WGxdnkjk';
const db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const fallback={posters:[],events:[],audios:[],settings:null};
const $=s=>document.querySelector(s);
function publicUrl(bucket,path){return path?db.storage.from(bucket).getPublicUrl(path).data.publicUrl:''}
function esc(v=''){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
async function loadSite(){
 const [settings,posters,events,audios]=await Promise.all([
  db.from('site_settings').select('*').eq('id',true).maybeSingle(),
  db.from('posters').select('*').eq('published',true).order('sort_order').order('created_at',{ascending:false}),
  db.from('events').select('*').eq('published',true).order('event_date',{ascending:false}),
  db.from('audios').select('*').eq('published',true).order('created_at',{ascending:false})
 ]);
 const s=settings.data; if(s){
  $('#siteTitle').textContent=(s.site_title||'کربلایی طاها زراعتکار').replace(/^کربلایی\s*/,'');
  $('#siteSubtitle').textContent=s.site_subtitle||'ذاکر اهل‌بیت علیهم‌السلام'; $('#aboutTitle').textContent=s.site_title||'کربلایی طاها زراعتکار'; $('#aboutText').textContent=s.about_text||'';
  for(const [id,key] of [['telegramLink','telegram_url'],['instagramLink','instagram_url'],['eitaaLink','eitaa_url'],['baleLink','bale_url']]){const el=$('#'+id);if(el&&s[key])el.href=s[key]}
 }
 renderPosters(posters.data||fallback.posters); renderEvents(events.data||fallback.events); renderAudios(audios.data||fallback.audios);
}
function renderPosters(items){const g=$('#posterGrid');g.innerHTML=items.length?'':'<div class="empty">هنوز پوستری منتشر نشده است.</div>';items.forEach(p=>{const url=publicUrl('posters',p.image_path);const c=document.createElement('article');c.className='poster';c.innerHTML='<img loading="lazy" alt=""><span></span>';c.querySelector('img').src=url;c.querySelector('img').alt=p.title;c.querySelector('span').textContent=p.title;c.onclick=()=>{$('#lightboxImg').src=url;$('#lightbox').classList.add('open')};g.appendChild(c)})}
function renderEvents(items){const g=$('#eventGrid');g.innerHTML=items.length?'':'<div class="empty">مراسمی برای نمایش ثبت نشده است.</div>';items.forEach(e=>{const c=document.createElement('article');c.className='event-card';const d=e.event_date?new Date(e.event_date).toLocaleDateString('fa-IR'):'تاریخ اعلام نشده';c.innerHTML='<h3></h3><b></b><p></p>';c.querySelector('h3').textContent=e.title;c.querySelector('b').textContent=d;c.querySelector('p').textContent=e.location||e.description||'';g.appendChild(c)})}
function renderAudios(items){const g=$('#audioGrid');g.innerHTML=items.length?'':'<div class="coming"><div class="sound">♫</div><h3>به‌زودی</h3><p>آرشیو صوتی مداحی‌ها و برنامه‌ها در این بخش قرار می‌گیرد.</p></div>';items.forEach(a=>{const c=document.createElement('article');c.className='audio-card';c.innerHTML='<h3></h3><p></p><audio controls preload="none"></audio>';c.querySelector('h3').textContent=a.title;c.querySelector('p').textContent=a.description||'';c.querySelector('audio').src=publicUrl('audios',a.audio_path);g.appendChild(c)})}
loadSite().catch(()=>loadSite);
$('.menu-btn')?.addEventListener('click',()=>$('.links').classList.toggle('open'));
$('#close')?.addEventListener('click',()=>$('#lightbox').classList.remove('open'));
$('#lightbox')?.addEventListener('click',e=>{if(e.target.id==='lightbox')e.currentTarget.classList.remove('open')});
$('#year').textContent=new Date().getFullYear();