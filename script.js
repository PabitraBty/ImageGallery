// gallery filter + search + lightbox
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('[data-filter]');
  const cards = Array.from(document.querySelectorAll('.card'));
  const searchInput = document.getElementById('search');

  // lightbox nodes
  const lightbox = createLightbox();
  const lbImg = lightbox.querySelector('#lb-img');
  const lbTitle = lightbox.querySelector('#lb-title');
  const lbCat = lightbox.querySelector('#lb-cat');
  const lbClose = lightbox.querySelector('#lb-close');

  // set active
  function setActive(btn){
    buttons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  }

  // filter function
  function filterGallery(cat){
    const q = (searchInput.value || '').trim().toLowerCase();
    cards.forEach(card=>{
      const cardCat = (card.dataset.cat || '').toLowerCase();
      const title = (card.dataset.title || '').toLowerCase();
      const catMatch = (cat === 'all') || (cardCat === cat);
      const searchMatch = !q || title.includes(q) || cardCat.includes(q);
      if(catMatch && searchMatch) card.classList.remove('hidden');
      else card.classList.add('hidden');
    });
  }

  // wire buttons
  buttons.forEach(btn=>{
    btn.addEventListener('click', () => {
      setActive(btn);
      filterGallery(btn.dataset.filter);
    });
  });

  // search live
  searchInput.addEventListener('input', () => {
    const active = document.querySelector('.btn.active');
    filterGallery(active ? active.dataset.filter : 'all');
  });

  // attach click on cards -> open lightbox
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const visible = cards.filter(c => !c.classList.contains('hidden'));
      const idx = visible.indexOf(card);
      openLightboxAt(visible, idx);
    });
  });

  // open at index among visible cards
  let currentIndex = -1;
  let visibleCards = [];

  function openLightboxAt(visible, index) {
    visibleCards = visible;
    currentIndex = index;
    if(currentIndex < 0 || currentIndex >= visibleCards.length) return;
    const card = visibleCards[currentIndex];
    const src = card.querySelector('img').src;
    lbImg.src = src;
    lbTitle.textContent = card.dataset.title || '';
    lbCat.textContent = (card.dataset.cat || '').toUpperCase();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    lbImg.focus();
  }

  function closeLightbox(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  // keyboard navigation when lightbox open
  window.addEventListener('keydown', (e) => {
    if(!lightbox.classList.contains('open')) return;
    if(e.key === 'ArrowRight'){
      e.preventDefault();
      visibleCards = cards.filter(c => !c.classList.contains('hidden'));
      currentIndex = (currentIndex + 1) % visibleCards.length;
      openLightboxAt(visibleCards, currentIndex);
    } else if(e.key === 'ArrowLeft'){
      e.preventDefault();
      visibleCards = cards.filter(c => !c.classList.contains('hidden'));
      currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
      openLightboxAt(visibleCards, currentIndex);
    } else if(e.key === 'Escape'){
      closeLightbox();
    }
  });

  // close on outside click or close button
  lightbox.addEventListener('click', (ev) => {
    if(ev.target === lightbox) closeLightbox();
  });
  lbClose.addEventListener('click', closeLightbox);

  // initial filter
  filterGallery('all');

  // --- helper to create a small lightbox DOM and append to body ---
  function createLightbox(){
    const tpl = document.createElement('div');
    tpl.className = 'lightbox';
    tpl.setAttribute('aria-hidden','true');
    tpl.innerHTML = `
      <div class="panel" role="dialog" aria-label="Image preview">
        <button class="close" id="lb-close" aria-label="Close">✕</button>
        <img id="lb-img" src="" alt="Preview" tabindex="0" />
        <div class="side">
          <h3 id="lb-title"></h3>
          <p id="lb-cat" style="margin:6px 0;color:var(--muted)"></p>
          <p style="font-size:13px;color:var(--muted)">Use ← / → keys to navigate or Esc to close.</p>
        </div>
      </div>
    `;
    document.body.appendChild(tpl);
    return tpl;
  }
});
