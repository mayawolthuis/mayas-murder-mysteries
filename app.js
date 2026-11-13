'use strict';
const DEFAULT_ETSY = 'https://www.etsy.com/shop/MayasMurderMysteries';
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function safeImage(path, fallback='assets/one-last-toast-art.svg') {
  if (typeof path !== 'string') return fallback;
  if (/^(https:\/\/[^\s]+|\/?assets\/[\w./%-]+)$/.test(path)) return path;
  return fallback;
}
function safeEtsy(url, fallback=DEFAULT_ETSY) {
  try {const u = new URL(url);if(u.protocol === 'https:' && (u.hostname === 'etsy.com' || u.hostname === 'www.etsy.com'))return u.href;}catch(_e){}
  return fallback;
}
async function readJSON(path) {const res = await fetch(path, {cache:'no-store'});if(!res.ok)throw new Error('Could not load '+path);return res.json();}
function setText(selector, value) {const node=$(selector);if(node && value !== undefined && value !== null)node.textContent=String(value);}
function setHTML(selector, value) {const node=$(selector);if(node)node.innerHTML=value;}
function decorateTitle(title, emphasized) {const s=esc(title || '');return emphasized && s.includes(emphasized) ? s.replace(emphasized,`<em>${emphasized}</em>`) : s;}
function setupNav(){const button=$('.menu-toggle'), nav=$('#site-nav');if(!button||!nav)return;button.addEventListener('click',()=>{const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close navigation':'Open navigation');});$$('a',nav).forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');button.setAttribute('aria-expanded','false');}));}
function updateCommon(site){
  $$('#copyright-year').forEach(n=>n.textContent=String(new Date().getFullYear()));
  const etsy=safeEtsy(site?.etsy_shop || DEFAULT_ETSY);
  $$('[data-etsy-shop]').forEach(a=>a.href=etsy);
  if(site?.brand_name) document.title=document.title.replace("Maya's Murder Mysteries",site.brand_name);
  setText('#announcement-text',site?.announcement);
  setText('#hero-eyebrow',site?.eyebrow);
  if(site?.hero_title)setHTML('#hero-title',decorateTitle(site.hero_title,'killer evening.'));
  setText('#hero-description',site?.hero_description);
  const heroImage=$('#hero-main-image');
  if(heroImage){
    if(site?.hero_image)heroImage.src=safeImage(site.hero_image);
    if(site?.hero_image_alt)heroImage.alt=String(site.hero_image_alt);
  }
  if(site?.about_heading)setHTML('#about-heading',decorateTitle(site.about_heading,'the mysteries.'));
  setText('#about-intro',site?.about_intro);
  setText('#about-signoff',site?.about_signoff);
  setText('#footer-note',site?.footer_note);
  const photo=$('#about-photo');if(photo && site?.about_photo)photo.src=safeImage(site.about_photo,'assets/maya-portrait.jpg');
  if(site?.about_text){const paragraphs=site.about_text.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);setHTML('#about-paragraphs',paragraphs.map(s=>`<p>${esc(s)}</p>`).join(''));}
}
function cardHTML(game){
  const slug=encodeURIComponent(String(game.slug||''));const image=safeImage(game.image);const badge=esc(game.badge || 'A NEW MYSTERY');
  const meta=esc(game.players || 'Details coming soon');
  return `<article class="mystery-card" data-status="${esc(game.status||'coming-soon')}"><a class="mystery-card-art" href="mystery.html?slug=${slug}" aria-label="Explore ${esc(game.title)}"><img src="${esc(image)}" alt="${esc(game.image_alt || game.title)}" loading="lazy" width="400" height="500"></a><div class="mystery-card-content"><span class="card-badge">${badge}</span><h3>${esc(game.title)}</h3><p class="mystery-card-subtitle">${esc(game.subtitle||'')}</p><p class="mystery-card-desc">${esc(game.description||'')}</p><div class="mystery-meta">${meta}</div><a class="mystery-card-link" href="mystery.html?slug=${slug}">Explore the mystery <span aria-hidden="true">↗</span></a></div></article>`;
}
function renderMysteries(games){const target=$('#mystery-grid');if(!target)return;if(!Array.isArray(games)||!games.length){target.innerHTML='<p class="empty-message">New mysteries are being prepared. Check back soon.</p>';return;}target.innerHTML=games.map(cardHTML).join('');$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.filter;$$('[data-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});$$('.mystery-card',target).forEach(card=>{card.classList.toggle('hidden',filter!=='all'&&card.dataset.status!==filter);});}));}
function renderReviews(reviews){const target=$('#reviews-grid');if(!target)return;const approved=Array.isArray(reviews)?reviews.filter(r=>r.approved===true&&r.quote&&r.author):[];if(!approved.length){target.innerHTML='<div class="review-empty"><span class="empty-mark" aria-hidden="true">✦ ✦ ✦ ✦ ✦</span><h4>The guestbook is waiting.</h4><p>Our first real reviews will appear here after the mysteries make their debut. No fabricated testimonials, promise.</p></div>';return;}target.innerHTML=approved.map(r=>`<article class="review-card"><div class="review-stars" aria-label="${Number(r.stars||5)} out of 5 stars">${'★'.repeat(Math.max(1,Math.min(5,Number(r.stars)||5)))}</div><blockquote>“${esc(r.quote)}”</blockquote><cite>— ${esc(r.author)}${r.source?' · '+esc(r.source):''}</cite></article>`).join('');}
function renderGallery(gallery){const target=$('#gallery-grid');if(!target)return;const approved=Array.isArray(gallery)?gallery.filter(item=>item.approved===true&&item.image):[];if(!approved.length){target.innerHTML='<div class="gallery-empty"><span class="empty-mark" aria-hidden="true">✉</span><h4>Memories in the making.</h4><p>Our gallery will feature real kit photographs and customer party moments, shared with permission.</p></div>';return;}target.innerHTML=approved.map(item=>`<figure class="gallery-item"><img class="gallery-image" src="${esc(safeImage(item.image))}" alt="${esc(item.alt||item.caption||'Murder mystery party photograph')}" loading="lazy"><figcaption>${esc(item.caption||'')}</figcaption></figure>`).join('');}
function renderFaq(faqs){const target=$('#faq-list');if(!target)return;target.innerHTML=(Array.isArray(faqs)?faqs:[]).map((item,i)=>`<details${i===0?' open':''}><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join('');}
function renderDetail(games,site){
  const target=$('#mystery-detail');
  if(!target)return;
  const slug=new URLSearchParams(location.search).get('slug');
  const game=Array.isArray(games)?games.find(g=>g.slug===slug):null;
  if(!game){
    target.innerHTML='<div class="empty-message"><h2>Case file not found.</h2><p>That mystery may have been moved or is still being written.</p><a class="btn btn-dark" href="index.html#mysteries">See all mysteries</a></div>';
    return;
  }
  document.title=`${game.title} | Maya's Murder Mysteries`;
  const desc=$('meta[name="description"]');
  if(desc)desc.setAttribute('content',String(game.description||game.subtitle||'Murder mystery party kit').slice(0,155));
  const etsy=safeEtsy(game.etsy_url,safeEtsy(site?.etsy_shop||DEFAULT_ETSY));
  const hasListing=!!game.etsy_url&&!!safeEtsy(game.etsy_url,'');
  const items=Array.isArray(game.what_is_included)?game.what_is_included:[];
  const extras=Array.isArray(game.product_photos)?game.product_photos.filter(p=>p&&typeof p.image==='string'&&p.image.trim()):[];
  const photos=[
    {image:safeImage(game.image),alt:String(game.image_alt||`${game.title} cover`),caption:''},
    ...extras.map(p=>({image:safeImage(p.image),alt:String(p.alt||p.caption||`${game.title} kit photo`),caption:String(p.caption||'')}))
  ];
  const first=photos[0];
  const thumbs=photos.length>1?`<div class="product-gallery-thumbs" role="group" aria-label="Choose a product photo">${photos.map((p,i)=>`<button class="product-gallery-thumb${i===0?' is-active':''}" type="button" data-photo-index="${i}" aria-pressed="${i===0?'true':'false'}" aria-label="Show photo ${i+1}: ${esc(p.caption||p.alt)}"><img src="${esc(p.image)}" alt="" loading="lazy"></button>`).join('')}</div>`:'';
  const galleryHTML=`<div class="product-gallery" aria-label="Photos of ${esc(game.title)}"><div class="detail-image-wrap"><button type="button" class="product-gallery-main" aria-label="Enlarge ${esc(game.title)} photo"><img class="product-gallery-main-image" src="${esc(first.image)}" alt="${esc(first.alt)}" width="640" height="800"><span class="product-gallery-zoom" aria-hidden="true">VIEW LARGER ↗</span></button></div>${thumbs}<p class="product-gallery-caption" aria-live="polite">${esc(first.caption)}</p><dialog class="product-gallery-lightbox" aria-label="Enlarged product photo"><button class="product-gallery-close" type="button" aria-label="Close photo">×</button><img class="product-gallery-lightbox-image" src="${esc(first.image)}" alt="${esc(first.alt)}"><p class="product-gallery-lightbox-caption">${esc(first.caption)}</p>${photos.length>1?'<div class="product-gallery-lightbox-nav"><button type="button" data-gallery-prev aria-label="Previous photo">← Previous</button><span class="product-gallery-counter">1 / '+photos.length+'</span><button type="button" data-gallery-next aria-label="Next photo">Next →</button></div>':''}</dialog></div>`;
  target.innerHTML=`${galleryHTML}<div class="detail-copy"><span class="eyebrow">${esc(game.eyebrow||'THE MYSTERY')}</span><h1>${esc(game.title)}</h1><p class="detail-subtitle">${esc(game.subtitle||'')}</p><p class="detail-description">${esc(game.description||'')}</p><dl class="detail-facts"><div><dt>GUEST LIST</dt><dd>${esc(game.players||'To be announced')}</dd></div><div><dt>FORMAT</dt><dd>${esc(game.format||'Physical party kit')}</dd></div><div><dt>SETTING</dt><dd>${esc(game.theme||'Mystery')}</dd></div><div><dt>PLAYTIME</dt><dd>${esc(game.duration||'To be announced')}</dd></div></dl>${items.length?`<div class="detail-included"><h2>What's in the box?</h2><ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></div>`:''}<p class="detail-notice">${esc(game.detail_note||'')}</p><div class="detail-actions"><a class="btn btn-dark" href="${esc(etsy)}" target="_blank" rel="noopener noreferrer">${hasListing?'View this kit on Etsy':'Visit our Etsy shop'} <span aria-hidden="true">↗</span></a><a class="text-link" href="index.html#how-it-works">How it works <span aria-hidden="true">→</span></a></div></div>`;
  const mainImage=$('.product-gallery-main-image',target);
  const caption=$('.product-gallery-caption',target);
  const lightbox=$('.product-gallery-lightbox',target);
  const enlarged=$('.product-gallery-lightbox-image',target);
  const enlargedCaption=$('.product-gallery-lightbox-caption',target);
  const counter=$('.product-gallery-counter',target);
  let current=0;
  function selectPhoto(index){
    current=(index+photos.length)%photos.length;
    const photo=photos[current];
    mainImage.src=photo.image;
    mainImage.alt=photo.alt;
    caption.textContent=photo.caption;
    enlarged.src=photo.image;
    enlarged.alt=photo.alt;
    enlargedCaption.textContent=photo.caption;
    if(counter)counter.textContent=`${current+1} / ${photos.length}`;
    $$('[data-photo-index]',target).forEach((button,i)=>{
      button.classList.toggle('is-active',i===current);
      button.setAttribute('aria-pressed',String(i===current));
    });
  }
  $$('[data-photo-index]',target).forEach(button=>button.addEventListener('click',()=>selectPhoto(Number(button.dataset.photoIndex))));
  $('.product-gallery-main',target).addEventListener('click',()=>{if(typeof lightbox.showModal==='function')lightbox.showModal();});
  $('.product-gallery-close',target).addEventListener('click',()=>lightbox.close());
  const prev=$('[data-gallery-prev]',target),next=$('[data-gallery-next]',target);
  if(prev)prev.addEventListener('click',()=>selectPhoto(current-1));
  if(next)next.addEventListener('click',()=>selectPhoto(current+1));
  lightbox.addEventListener('click',event=>{if(event.target===lightbox)lightbox.close();});
  lightbox.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();selectPhoto(current-1);}
    if(event.key==='ArrowRight'){event.preventDefault();selectPhoto(current+1);}
  });
}
async function main(){setupNav();$$('#copyright-year').forEach(n=>n.textContent=String(new Date().getFullYear()));try{const [site,games,reviews,gallery,faqs]=await Promise.all([readJSON('content/site.json'),readJSON('content/mysteries.json'),readJSON('content/reviews.json'),readJSON('content/gallery.json'),readJSON('content/faqs.json')]);updateCommon(site);renderMysteries(games);renderReviews(reviews);renderGallery(gallery);renderFaq(faqs);renderDetail(games,site);}catch(err){console.error(err);const grid=$('#mystery-grid');if(grid)grid.innerHTML='<p class="empty-message">The case files could not be loaded. Please refresh the page or try again later.</p>';const detail=$('#mystery-detail');if(detail)detail.innerHTML='<p class="empty-message">This case file could not be opened. Please try again later.</p>';}}
main();
