const defaultPosters=Array.from({length:15},(_,i)=>({id:i+1,title:'پوستر مراسم '+(i+1),image:'assets/mockups.svg'}));
const state=JSON.parse(localStorage.getItem('tahaSiteData')||'null')||{posters:defaultPosters};
function save(){localStorage.setItem('tahaSiteData',JSON.stringify(state))}
function renderPosters(){const grid=document.querySelector('#posterGrid');if(!grid)return;grid.innerHTML='';state.posters.forEach(p=>{const card=document.createElement('div');card.className='poster';card.innerHTML='<span></span><img loading="lazy" alt="">';card.querySelector('span').textContent=p.title;card.querySelector('img').src=p.image;card.querySelector('img').alt=p.title;card.onclick=()=>{document.querySelector('#lightboxImg').src=p.image;document.querySelector('#lightbox').classList.add('open')};grid.appendChild(card)})}
renderPosters();
const menu=document.querySelector('.menu-btn');if(menu)menu.onclick=()=>document.querySelector('.links').classList.toggle('open');
const close=document.querySelector('#close');if(close)close.onclick=()=>document.querySelector('#lightbox').classList.remove('open');
const lb=document.querySelector('#lightbox');if(lb)lb.onclick=e=>{if(e.target.id==='lightbox')e.currentTarget.classList.remove('open')};
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();