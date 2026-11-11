/* Snuzzo customer reviews (Firebase Realtime Database).
   Compatible with the previous theme's data: <node>/<productId>/<pushId> =
   { name, date, rating, text, photos[], approved, createdAt }. */
const FB = 'https://www.gstatic.com/firebasejs/10.12.2/';
const MAX_PHOTOS = 3;
const PHOTO_WIDTH = 760;
const FETCH = 200;

const root = document.querySelector('[data-reviews]');
if (root) init(root);

function init(root) {
  const product = String(root.dataset.product || 'page').replace(/[.#$/\[\]]/g, '-');
  const node = root.dataset.node || 'snuzzo_reviews';
  const emailsNode = root.dataset.emailsNode || 'snuzzo_review_emails';
  const moderate = root.dataset.moderate === 'true';
  const perPage = Number(root.dataset.perPage) || 8;
  const decode = (s) => { const t = document.createElement('textarea'); t.innerHTML = s; return t.value; };
  const txt = Object.fromEntries(Object.entries(JSON.parse(root.querySelector('[data-reviews-text]').textContent)).map(([k, v]) => [k, decode(v)]));
  let cfg = null;
  try { cfg = JSON.parse(root.querySelector('[data-reviews-config]').textContent); } catch (e) { cfg = null; }

  const grid = root.querySelector('[data-reviews-grid]');
  const summary = root.querySelector('[data-reviews-summary]');
  const note = root.querySelector('[data-reviews-note]');
  const more = root.querySelector('[data-reviews-more]');
  const form = root.querySelector('[data-review-form]');
  const err = root.querySelector('[data-review-error]');
  const thanks = root.querySelector('[data-review-thanks]');
  const thumbs = root.querySelector('[data-review-thumbs]');
  const fileInput = root.querySelector('[data-review-photos]');
  const MINE = 'snuzzo-reviews-mine:' + product;

  let live = [];
  let mine = [];
  let shown = perPage;
  let photos = [];
  let db = null;
  try { mine = JSON.parse(localStorage.getItem(MINE)) || []; } catch (e) { mine = []; }

  const esc = (s) => { const d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; };
  const all = () => mine.concat(live);

  async function firebase() {
    if (db) return db;
    if (!cfg || !cfg.apiKey || !cfg.databaseURL) throw new Error('not set up');
    const [{ initializeApp, getApps }, rt] = await Promise.all([import(FB + 'firebase-app.js'), import(FB + 'firebase-database.js')]);
    const app = getApps().length ? getApps()[0] : initializeApp(cfg);
    db = { rt, ref: rt.getDatabase(app) };
    return db;
  }

  function starsHtml(r) {
    const pct = Math.max(0, Math.min(5, Number(r) || 0)) / 5 * 100;
    return `<span class="stars stars--sm" role="img" aria-label="${esc(txt.stars.replace('[n]', Number(r) || 0))}"><span class="stars__icons" style="--pct:${pct}%" aria-hidden="true"></span></span>`;
  }

  function render(message) {
    const list = all();
    grid.innerHTML = '';
    list.slice(0, shown).forEach((r) => {
      const el = document.createElement('article');
      el.className = 'review';
      let h = '';
      if (r.photos && r.photos[0]) h += `<img class="review__photo" src="${esc(r.photos[0])}" alt="${esc(txt.photoFrom.replace('[name]', r.name || ''))}" loading="lazy">`;
      h += '<div class="review__body">';
      if (r.pending) h += `<span class="badge">${esc(txt.pending)}</span>`;
      h += starsHtml(r.rating);
      h += `<p class="review__text">${esc(r.text)}</p>`;
      h += `<p class="review__meta"><b>${esc(r.name)}</b>${r.date ? ' · ' + esc(r.date) : ''}</p></div>`;
      el.innerHTML = h;
      grid.appendChild(el);
    });
    const rated = live.filter((r) => Number(r.rating) > 0);
    if (rated.length) {
      const avg = Math.round(rated.reduce((a, r) => a + Number(r.rating), 0) / rated.length * 10) / 10;
      summary.innerHTML = starsHtml(avg) + ' ' + esc(txt.count.replace('[avg]', avg).replace('[count]', rated.length));
    } else {
      summary.textContent = '';
    }
    note.textContent = message || (list.length ? '' : txt.none);
    more.hidden = list.length <= shown;
  }

  more.addEventListener('click', () => { shown += perPage; render(); });

  async function load() {
    try {
      const { rt, ref } = await firebase();
      const q = rt.query(rt.ref(ref, node + '/' + product), rt.orderByChild('createdAt'), rt.limitToLast(FETCH));
      const snap = await rt.get(q);
      const rows = [];
      snap.forEach((c) => {
        const d = c.val() || {};
        if (d.approved !== true) return;
        rows.push({ id: c.key, name: d.name, date: d.date, rating: d.rating, text: d.text || '', photos: d.photos || [], ms: d.createdAt || 0 });
      });
      rows.sort((a, b) => b.ms - a.ms);
      live = rows;
      const ids = new Set(rows.map((r) => r.id));
      mine = mine.filter((m) => !ids.has(m.id));
      save();
      render();
    } catch (e) {
      render(/not set up/.test(e.message) ? '' : txt.error);
      if (!/not set up/.test(e.message)) console.warn('[reviews]', e);
    }
  }
  function save() { try { localStorage.setItem(MINE, JSON.stringify(mine)); } catch (e) {} }

  /* photos: shrink before saving */
  function shrink(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let w = img.width, h = img.height;
          if (w > h && w > PHOTO_WIDTH) { h = Math.round(h * PHOTO_WIDTH / w); w = PHOTO_WIDTH; }
          else if (h >= w && h > PHOTO_WIDTH) { w = Math.round(w * PHOTO_WIDTH / h); h = PHOTO_WIDTH; }
          const c = document.createElement('canvas');
          c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(c.toDataURL('image/jpeg', 0.66));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  function paintThumbs() {
    thumbs.innerHTML = '';
    photos.forEach((url, i) => {
      const d = document.createElement('div');
      d.className = 'review-form__thumb';
      d.innerHTML = `<img src="${url}" alt=""><button type="button" aria-label="Remove">✕</button>`;
      d.querySelector('button').addEventListener('click', () => { photos.splice(i, 1); paintThumbs(); });
      thumbs.appendChild(d);
    });
  }
  fileInput.addEventListener('change', async () => {
    const files = Array.from(fileInput.files || []).slice(0, MAX_PHOTOS - photos.length);
    for (const f of files) { try { photos.push(await shrink(f)); } catch (e) {} }
    fileInput.value = '';
    paintThumbs();
  });

  const showErr = (m) => { err.textContent = m; err.hidden = !m; };
  const today = () => { const d = new Date(); return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const rating = Number(data.get('rating'));
    const first = String(data.get('first') || '').trim();
    const last = String(data.get('last') || '').trim();
    const email = String(data.get('email') || '').trim();
    const text = String(data.get('text') || '').trim();
    if (!rating) return showErr(txt.needRating);
    if (!first) return showErr(txt.needName);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showErr(txt.needEmail);
    showErr('');
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    try {
      const { rt, ref } = await firebase();
      const review = {
        name: last ? `${first} ${last.charAt(0).toUpperCase()}.` : first,
        date: today(), rating, text, approved: !moderate, createdAt: rt.serverTimestamp()
      };
      const ph = photos.filter((u) => u.length < 390000).slice(0, MAX_PHOTOS);
      if (ph.length) review.photos = ph;
      const n = rt.push(rt.ref(ref, node + '/' + product));
      await rt.set(n, review);
      rt.set(rt.push(rt.ref(ref, emailsNode)), { email, productId: product, createdAt: rt.serverTimestamp() }).catch(() => {});
      const copy = { id: n.key, name: review.name, date: review.date, rating, text, photos: ph, pending: moderate };
      if (moderate) { mine.unshift(copy); save(); } else { live.unshift(copy); }
      form.hidden = true;
      thanks.hidden = false;
      thanks.querySelector('[data-review-thanks-text]').textContent = moderate ? txt.thanksModerated : txt.thanks;
      form.reset(); photos = []; paintThumbs();
      render();
    } catch (e2) {
      showErr(txt.sendError);
      console.warn('[reviews]', e2);
    } finally {
      btn.disabled = false;
    }
  });
  root.querySelectorAll('[data-dialog-open]').forEach((b) => b.addEventListener('click', () => { form.hidden = false; thanks.hidden = true; showErr(''); }));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((en) => { if (en[0].isIntersecting) { io.disconnect(); load(); } }, { rootMargin: '400px' });
    io.observe(root);
  } else { load(); }
}
