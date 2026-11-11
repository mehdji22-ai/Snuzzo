/* Snuzzo theme scripts. No dependencies. */
(function () {
  'use strict';
  var root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
  var money = function (cents) {
    var fmt = (window.SnuzzoTheme && window.SnuzzoTheme.moneyFormat) || '${{amount}}';
    var value = (cents / 100).toFixed(2);
    var noDec = value.replace(/\.00$/, '');
    return fmt
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/, Math.round(cents / 100))
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/, value.replace('.', ','))
      .replace(/\{\{\s*amount\s*\}\}/, noDec);
  };
  window.SnuzzoMoney = money;

  /* ---------- Cart ---------- */
  function setBagCount(n) {
    document.querySelectorAll('[data-bag-count]').forEach(function (el) {
      el.textContent = n > 0 ? n : '';
      el.setAttribute('data-count', n);
    });
  }
  function addToCart(variantId, qty) {
    return fetch(root + 'cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ items: [{ id: Number(variantId), quantity: qty || 1 }] })
    }).then(function (r) {
      return r.json().then(function (data) {
        if (!r.ok) throw new Error(data.description || data.message || 'Could not add to bag');
        return fetch(root + 'cart.js').then(function (c) { return c.json(); });
      });
    }).then(function (cart) {
      setBagCount(cart.item_count);
      document.dispatchEvent(new CustomEvent('snuzzo:cart-added', { detail: { cart: cart } }));
      return cart;
    });
  }
  window.SnuzzoCart = { add: addToCart, setCount: setBagCount };
  function flash(btn, msgEl, ok, text) {
    var original = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', original);
    if (msgEl) msgEl.textContent = text;
    if (ok) {
      btn.textContent = (window.SnuzzoTheme && window.SnuzzoTheme.addedText) || 'Added';
      setTimeout(function () { btn.textContent = btn.getAttribute('data-label'); }, 1800);
    }
  }

  /* Any form with [data-ajax-add] posts via AJAX */
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[data-ajax-add]');
    if (!form) return;
    e.preventDefault();
    var idInput = form.querySelector('[name="id"]');
    var btn = form.querySelector('[type="submit"]');
    var msg = form.querySelector('[data-buy-msg]') || document.querySelector('[data-buy-msg]');
    if (!idInput || !idInput.value) return;
    btn.disabled = true;
    addToCart(idInput.value, Number((form.querySelector('[name="quantity"]') || {}).value || 1))
      .then(function () {
        var t = (window.SnuzzoTheme && window.SnuzzoTheme.addedMsg) || 'Added to your bag.';
        flash(btn, msg, true, t);
        if (msg) { msg.innerHTML = t + ' <a href="' + root + 'cart">' + ((window.SnuzzoTheme && window.SnuzzoTheme.viewBag) || 'View bag') + '</a>'; }
        if (window.SnuzzoTheme && window.SnuzzoTheme.goToCart && !document.querySelector('[data-cart-drawer]')) window.location.href = root + 'cart';
      })
      .catch(function (err) { flash(btn, msg, false, err.message); })
      .finally(function () { btn.disabled = false; });
  });

  /* ---------- Mobile menu ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-menu-toggle]');
    if (!t) return;
    var nav = document.getElementById(t.getAttribute('aria-controls'));
    var open = t.getAttribute('aria-expanded') !== 'true';
    t.setAttribute('aria-expanded', open);
    nav.classList.toggle('is-open', open);
    var hdr = t.closest('[data-header]'); if (hdr) hdr.classList.toggle('menu-open', open);
  });

  /* ---------- Animal picker ---------- */
  function initPicker(section) {
    var dataEl = section.querySelector('[data-picker-json]');
    if (!dataEl) return;
    var animals = JSON.parse(dataEl.textContent);
    var chips = section.querySelectorAll('[data-chip]');
    var img = section.querySelector('[data-f-img]');
    var count = section.querySelector('[data-f-count]');
    var name = section.querySelector('[data-f-name]');
    var bullets = section.querySelector('[data-f-bullets]');
    var price = section.querySelector('[data-f-price]');
    var idInput = section.querySelector('[data-f-id]');
    var btn = section.querySelector('[data-f-btn]');
    var link = section.querySelector('[data-f-link]');
    var template = btn ? btn.getAttribute('data-template') : 'Add the [animal]';
    var countTpl = count ? count.getAttribute('data-template') : '';
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var i = Number(chip.getAttribute('data-index'));
        var a = animals[i];
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        if (img) { img.src = a.image; img.srcset = a.srcset || ''; img.alt = a.alt; }
        if (count) count.textContent = countTpl.replace('[n]', i + 1).replace('[total]', animals.length);
        if (name) name.textContent = a.title;
        if (price) price.innerHTML = a.price;
        if (bullets && a.bullets && a.bullets.length) {
          bullets.innerHTML = '';
          a.bullets.forEach(function (b) { var li = document.createElement('li'); li.textContent = b; bullets.appendChild(li); });
        }
        var sizesBox = section.querySelector('[data-f-sizes]');
        if (sizesBox) {
          var legend = sizesBox.querySelector('legend');
          sizesBox.innerHTML = '';
          if (legend) sizesBox.appendChild(legend);
          (a.variants || []).forEach(function (v) {
            var lab = document.createElement('label');
            lab.className = 'size' + (v.available ? '' : ' is-unavailable');
            var inp = document.createElement('input');
            inp.type = 'radio'; inp.name = 'picker-size-' + i + '-' + Date.now(); inp.value = v.id; inp.disabled = !v.available;
            inp.checked = String(v.id) === String(a.variant);
            var sp = document.createElement('span'); sp.textContent = v.title;
            lab.appendChild(inp); lab.appendChild(sp); sizesBox.appendChild(lab);
          });
          sizesBox.hidden = !a.variants || a.variants.length < 2;
        }
        if (idInput) idInput.value = a.variant || '';
        if (link) link.href = a.url;
        if (btn) {
          var label = a.available ? template.replace('[animal]', a.short) : ((window.SnuzzoTheme && window.SnuzzoTheme.soldOut) || 'Sold out');
          btn.textContent = label;
          btn.setAttribute('data-label', label);
          btn.disabled = !a.available || !a.variant;
        }
      });
    });
  }

  document.addEventListener('change', function (e) {
    var r = e.target.closest('[data-f-sizes] input[type="radio"]');
    if (!r) return;
    var form = r.closest('form'); var id = form && form.querySelector('[data-f-id]');
    if (id) id.value = r.value;
  });

  /* ---------- Carousel progress bars ---------- */
  function initCarousels(scope) {
    scope.querySelectorAll('[data-carousel]').forEach(function (c) {
      var track = c.querySelector('[data-carousel-track]'); var bar = c.querySelector('[data-carousel-bar]');
      if (!track || !bar) return;
      var upd = function () {
        var max = track.scrollWidth - track.clientWidth;
        var vis = track.clientWidth / track.scrollWidth;
        bar.style.width = Math.max(10, vis * 100) + '%';
        bar.style.transform = 'translateX(' + (max > 0 ? (track.scrollLeft / max) * ((1 / vis) - 1) * 100 : 0) + '%)';
      };
      track.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
    });
  }

  /* ---------- Tabs (rails and pill tabs) ---------- */
  function initTabs(scope) {
    var tabs = scope.querySelectorAll('[role="tab"]');
    tabs.forEach(function (tab, idx) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        var next = tabs[(idx + dir + tabs.length) % tabs.length];
        next.focus(); select(next);
      });
    });
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        var p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
    }
  }

  /* ---------- Before / after ---------- */
  function initBA(stage) {
    var range = stage.querySelector('input[type="range"]');
    if (!range) return;
    var set = function () { stage.style.setProperty('--pos', range.value + '%'); };
    range.addEventListener('input', set);
    set();
  }

  document.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-ba-chip]');
    if (!chip) return;
    var section = chip.closest('.ba');
    var id = chip.getAttribute('data-ba-chip');
    section.querySelectorAll('[data-ba-chip]').forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
    section.querySelectorAll('[data-ba-pair]').forEach(function (p) { p.hidden = p.getAttribute('data-ba-pair') !== id; });
  });

  /* ---------- Wishlist hearts (saved on this device) ---------- */
  function readWish() { try { return JSON.parse(localStorage.getItem('snuzzo-wish') || '[]'); } catch (e) { return []; } }
  function writeWish(list) { try { localStorage.setItem('snuzzo-wish', JSON.stringify(list)); } catch (e) {} }
  function initHearts() {
    var list = readWish();
    document.querySelectorAll('[data-heart]').forEach(function (b) {
      b.setAttribute('aria-pressed', list.indexOf(b.getAttribute('data-heart')) > -1 ? 'true' : 'false');
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-heart]');
    if (!b) return;
    e.preventDefault();
    var h = b.getAttribute('data-heart');
    var list = readWish();
    var i = list.indexOf(h);
    if (i > -1) list.splice(i, 1); else list.push(h);
    writeWish(list);
    initHearts();
  });

  /* ---------- Product gallery ---------- */
  function scrollToMedia(section, mediaId, smooth) {
    var track = section.querySelector('[data-track]');
    var item = track && track.querySelector('[data-media-id="' + mediaId + '"]');
    if (!item) return;
    track.scrollTo({ left: item.offsetLeft - track.offsetLeft, behavior: smooth ? 'smooth' : 'auto' });
    var img = item.querySelector('img'); if (img) img.loading = 'eager';
    section.querySelectorAll('[data-thumb]').forEach(function (t) { t.setAttribute('aria-current', t.getAttribute('data-thumb') === String(mediaId) ? 'true' : 'false'); });
  }
  function initGallery(section) {
    var track = section.querySelector('[data-track]');
    if (!track) return;
    section.querySelectorAll('[data-thumb]').forEach(function (t) {
      t.addEventListener('click', function () { scrollToMedia(section, t.getAttribute('data-thumb'), true); });
    });
    var timer;
    track.addEventListener('scroll', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var idx = Math.round(track.scrollLeft / track.clientWidth);
        var item = track.children[idx];
        if (!item) return;
        var id = item.getAttribute('data-media-id');
        section.querySelectorAll('[data-thumb]').forEach(function (t) {
          var on = t.getAttribute('data-thumb') === id;
          t.setAttribute('aria-current', on ? 'true' : 'false');
          if (on && t.parentElement.scrollWidth > t.parentElement.clientWidth) t.scrollIntoView({ block: 'nearest', inline: 'center' });
        });
      }, 80);
    }, { passive: true });
  }

  /* ---------- Question bubbles open the matching FAQ ---------- */
  document.addEventListener('click', function (e) {
    var q = e.target.closest('[data-faq-jump]');
    if (!q) return;
    var text = q.getAttribute('data-faq-jump').trim().toLowerCase();
    var target = null;
    document.querySelectorAll('#faq details, .accordion details').forEach(function (d) {
      var s = d.querySelector('summary');
      if (!target && s && s.textContent.trim().toLowerCase() === text) target = d;
    });
    if (!target) { var f = document.getElementById('faq'); if (f) f.scrollIntoView({ behavior: 'smooth' }); return; }
    target.open = true;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* ---------- Product variant picker ---------- */
  function initProduct(section) {
    var dataEl = section.querySelector('[data-variants-json]');
    if (!dataEl) return;
    var variants = JSON.parse(dataEl.textContent);
    var form = section.querySelector('form[data-ajax-add]');
    var idInput = form.querySelector('[name="id"]');
    var btn = form.querySelector('[type="submit"]');
    var priceEl = section.querySelector('[data-price]');
    var stickyPrice = document.querySelector('[data-sticky-price]');
    var groups = section.querySelectorAll('[data-option-index]');
    function current() {
      var opts = [];
      groups.forEach(function (g) {
        var c = g.querySelector('input:checked');
        opts[Number(g.getAttribute('data-option-index'))] = c ? c.value : null;
      });
      return variants.find(function (v) { return v.options.every(function (o, i) { return o === opts[i]; }); });
    }
    function update() {
      var v = current();
      // mark unavailable sizes in the last option group given the other selections
      groups.forEach(function (g) {
        var gi = Number(g.getAttribute('data-option-index'));
        g.querySelectorAll('input').forEach(function (inp) {
          var match = variants.some(function (vv) {
            return vv.available && vv.options[gi] === inp.value && vv.options.every(function (o, i) {
              if (i === gi) return true;
              var other = section.querySelector('[data-option-index="' + i + '"] input:checked');
              return !other || other.value === o;
            });
          });
          inp.parentElement.classList.toggle('is-unavailable', !match);
        });
      });
      if (!v) { btn.disabled = true; btn.textContent = (window.SnuzzoTheme && window.SnuzzoTheme.unavailable) || 'Unavailable'; return; }
      idInput.value = v.id;
      groups.forEach(function (g) {
        var c = g.querySelector('input:checked'); var lab = g.querySelector('[data-selected-value]');
        if (c && lab) lab.textContent = c.value;
      });
      if (v.media) { scrollToMedia(section, v.media, true); }
      var html = window.SnuzzoPriceHtml ? window.SnuzzoPriceHtml(v) : money(v.price) + (v.compare_at_price > v.price ? ' <s>' + money(v.compare_at_price) + '</s>' : '');
      if (priceEl) priceEl.innerHTML = html;
      if (stickyPrice) stickyPrice.innerHTML = money(v.price);
      btn.disabled = !v.available;
      var label = v.available ? btn.getAttribute('data-add') : btn.getAttribute('data-soldout');
      btn.textContent = label; btn.setAttribute('data-label', label);
      if (window.history.replaceState && section.hasAttribute('data-update-url')) {
        var url = new URL(window.location.href);
        url.searchParams.set('variant', v.id);
        window.history.replaceState({}, '', url.toString());
      }
    }
    groups.forEach(function (g) { g.addEventListener('change', update); });
    update();

    // sticky add bar on phones
    var sticky = document.querySelector('[data-sticky-buy]');
    if (sticky && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        sticky.classList.toggle('is-visible', !entries[0].isIntersecting);
      }).observe(btn);
      sticky.querySelector('button').addEventListener('click', function () {
        if (form.requestSubmit) form.requestSubmit(btn); else btn.click();
      });
    }
  }

  /* ---------- Collection: show more ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-show-more]');
    if (!a) return;
    e.preventDefault();
    a.setAttribute('aria-busy', 'true');
    fetch(a.href).then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var grid = document.querySelector('[data-product-grid]');
      doc.querySelectorAll('[data-product-grid] > *').forEach(function (el) {
        if (!el.hasAttribute('data-promo')) grid.appendChild(el);
      });
      var newMore = doc.querySelector('[data-more]');
      var oldMore = document.querySelector('[data-more]');
      if (newMore && oldMore) oldMore.replaceWith(newMore);
      initHearts();
      if (window.history.replaceState) window.history.replaceState({}, '', a.href);
    });
  });

  /* ---------- Collection: filters auto-submit ---------- */
  document.addEventListener('change', function (e) {
    var f = e.target.closest('form[data-filter-form]');
    if (f) f.submit();
  });

  /* ---------- Videos: load when visible, pause when off-screen ---------- */
  function initVideos(scope) {
    var vids = scope.querySelectorAll('video[data-lazy-video]');
    if (!vids.length) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window)) {
      vids.forEach(function (v) { v.src = v.getAttribute('data-lazy-video'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (!v.src) v.src = v.getAttribute('data-lazy-video');
          if (!reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (!v.paused) { v.pause(); }
      });
    }, { rootMargin: '200px' });
    vids.forEach(function (v) {
      io.observe(v);
      if (reduce) { v.controls = true; }
    });
  }

  function init(scope) {
    initVideos(scope);
    scope.querySelectorAll('[data-picker]').forEach(initPicker);
    initCarousels(scope);
    scope.querySelectorAll('[data-tabs]').forEach(initTabs);
    scope.querySelectorAll('[data-ba]').forEach(initBA);
    scope.querySelectorAll('[data-product]').forEach(function (s) { initGallery(s); initProduct(s); });
    initHearts();
  }
  document.addEventListener('DOMContentLoaded', function () { init(document); });
  (function () {
    var onScroll = function () { var h = document.querySelector('.site-header--overlay'); if (h) h.classList.toggle('is-solid', window.scrollY > 40); };
    window.addEventListener('scroll', onScroll, { passive: true }); document.addEventListener('DOMContentLoaded', onScroll);
  })();
  // re-init when sections are edited in the theme editor
  document.addEventListener('shopify:section:load', function (e) { init(e.target); });
})();
