/* Snuzzo theme: bag drawer, quick add, size chart, quantity, delivery estimate, live search. */
(function () {
  'use strict';
  var root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
  var T = window.SnuzzoTheme || {};
  var money = function (c) { return window.SnuzzoMoney ? window.SnuzzoMoney(c) : (c / 100).toFixed(2); };
  var lastFocus = null;

  /* ---------- Generic dialogs ([data-dialog-open="ID"] opens #ID) ---------- */
  function openDialog(el) {
    if (!el) return;
    lastFocus = document.activeElement;
    el.hidden = false;
    el.classList.add('is-open');
    document.documentElement.classList.add('has-dialog');
    var lazy = el.querySelector('img[data-src]');
    if (lazy) { lazy.src = lazy.getAttribute('data-src'); lazy.removeAttribute('data-src'); }
    var focusEl = el.querySelector('[data-dialog-focus]') || el.querySelector('button, a, input, select');
    if (focusEl) setTimeout(function () { focusEl.focus(); }, 30);
  }
  function closeDialog(el) {
    if (!el || el.hidden) return;
    el.classList.remove('is-open');
    el.hidden = true;
    if (!document.querySelector('.dialog.is-open')) document.documentElement.classList.remove('has-dialog');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.SnuzzoDialog = { open: openDialog, close: closeDialog };
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-dialog-open]');
    if (opener) { e.preventDefault(); openDialog(document.getElementById(opener.getAttribute('data-dialog-open'))); return; }
    var closer = e.target.closest('[data-dialog-close]');
    if (closer) { e.preventDefault(); closeDialog(closer.closest('.dialog')); return; }
    if (e.target.classList && e.target.classList.contains('dialog')) closeDialog(e.target);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.dialog.is-open').forEach(closeDialog);
    if (e.key === 'Tab') {
      var d = document.querySelector('.dialog.is-open');
      if (!d) return;
      var f = d.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Bag drawer ---------- */
  function drawer() { return document.querySelector('[data-cart-drawer]'); }
  function refreshDrawer() {
    var d = drawer();
    if (!d) return Promise.resolve();
    var id = d.getAttribute('data-section-id');
    return fetch(root + '?sections=' + id).then(function (r) { return r.json(); }).then(function (data) {
      var doc = new DOMParser().parseFromString(data[id], 'text/html');
      var fresh = doc.querySelector('[data-cart-drawer-body]');
      var body = d.querySelector('[data-cart-drawer-body]');
      if (fresh && body) body.replaceWith(fresh);
      var count = doc.querySelector('[data-drawer-count]');
      if (count && window.SnuzzoCart) window.SnuzzoCart.setCount(Number(count.getAttribute('data-drawer-count')));
    });
  }
  document.addEventListener('snuzzo:cart-added', function () {
    if (!drawer()) return;
    document.querySelectorAll('.dialog.is-open').forEach(function (x) { if (!x.hasAttribute('data-cart-drawer')) closeDialog(x); });
    refreshDrawer().then(function () { openDialog(drawer()); });
  });
  document.addEventListener('click', function (e) {
    var bag = e.target.closest('[data-bag-link]');
    if (bag && drawer()) { e.preventDefault(); refreshDrawer().then(function () { openDialog(drawer()); }); }
  });
  function changeLine(key, qty) {
    var d = drawer();
    if (d) d.setAttribute('aria-busy', 'true');
    return fetch(root + 'cart/change.js', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty })
    }).then(function () { return refreshDrawer(); }).finally(function () { if (d) d.removeAttribute('aria-busy'); });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-line-change]');
    if (!b) return;
    e.preventDefault();
    changeLine(b.getAttribute('data-key'), Number(b.getAttribute('data-line-change')));
  });
  document.addEventListener('change', function (e) {
    var i = e.target.closest('[data-line-qty]');
    if (i) changeLine(i.getAttribute('data-key'), Math.max(0, Number(i.value) || 0));
  });

  /* ---------- Quick add (the + on product cards) ---------- */
  var qa = null;
  function quickAddDialog() {
    if (qa) return qa;
    qa = document.getElementById('QuickAdd');
    return qa;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-quick-add]');
    if (!b) return;
    e.preventDefault();
    var handle = b.getAttribute('data-quick-add');
    var dlg = quickAddDialog();
    if (!dlg) { window.location.href = root + 'products/' + handle; return; }
    b.setAttribute('aria-busy', 'true');
    fetch(root + 'products/' + handle + '.js').then(function (r) { return r.json(); }).then(function (p) {
      renderQuickAdd(dlg, p);
      openDialog(dlg);
    }).finally(function () { b.removeAttribute('aria-busy'); });
  });
  function renderQuickAdd(dlg, p) {
    var body = dlg.querySelector('[data-qa-body]');
    var img = p.featured_image ? p.featured_image + (p.featured_image.indexOf('?') > -1 ? '&' : '?') + 'width=500' : '';
    var first = p.variants.find(function (v) { return v.available; }) || p.variants[0];
    var single = p.variants.length === 1 && p.options.length === 1 && p.variants[0].title === 'Default Title';
    var html = '<div class="qa">' + (img ? '<img class="qa__img" src="' + img + '" alt="">' : '') +
      '<div class="qa__info"><h2 class="qa__title" id="QuickAddTitle">' + esc(p.title) + '</h2>' +
      '<div class="pdp__price" data-qa-price>' + priceHtml(first) + '</div>';
    if (!single) {
      p.options.forEach(function (opt, oi) {
        html += '<fieldset class="sizes qa__opts" data-qa-opt="' + oi + '"><legend class="pdp__group-head">' + esc(opt.name) + '</legend>';
        opt.values.forEach(function (val) {
          var checked = first.options[oi] === val ? ' checked' : '';
          html += '<label class="size"><input type="radio" name="qa-' + oi + '" value="' + esc(val) + '"' + checked + '><span>' + esc(val) + '</span></label>';
        });
        html += '</fieldset>';
      });
    }
    html += '<button type="button" class="btn btn--ink" data-qa-add style="width:100%">' + esc(T.addToBag || 'Add to bag') + '</button>' +
      '<p class="buy-msg" role="status" aria-live="polite" data-qa-msg></p>' +
      '<a class="link-strong" href="' + p.url + '">' + esc(T.viewDetails || 'View full details') + '</a></div></div>';
    body.innerHTML = html;
    var current = first;
    function pick() {
      var opts = [];
      body.querySelectorAll('[data-qa-opt]').forEach(function (fs) {
        var c = fs.querySelector('input:checked');
        opts[Number(fs.getAttribute('data-qa-opt'))] = c ? c.value : null;
      });
      current = single ? p.variants[0] : p.variants.find(function (v) { return v.options.every(function (o, i) { return o === opts[i]; }); });
      var btn = body.querySelector('[data-qa-add]');
      body.querySelector('[data-qa-price]').innerHTML = current ? priceHtml(current) : '';
      btn.disabled = !current || !current.available;
      btn.textContent = current && current.available ? (T.addToBag || 'Add to bag') : (T.soldOut || 'Sold out');
    }
    body.addEventListener('change', pick);
    pick();
    body.querySelector('[data-qa-add]').addEventListener('click', function (ev) {
      var btn = ev.currentTarget;
      if (!current) return;
      btn.disabled = true;
      window.SnuzzoCart.add(current.id, 1).catch(function (err) {
        body.querySelector('[data-qa-msg]').textContent = err.message;
      }).finally(function () { btn.disabled = false; });
    });
  }
  function priceHtml(v) {
    var h = money(v.price);
    if (v.compare_at_price > v.price) {
      h += ' <s>' + money(v.compare_at_price) + '</s> <span class="save">' + esc((T.save || 'Save [amount]').replace('[amount]', money(v.compare_at_price - v.price))) + '</span>';
    }
    return h;
  }
  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
  window.SnuzzoPriceHtml = priceHtml;

  /* ---------- Quantity steppers ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-qty-step]');
    if (!b) return;
    var input = b.parentElement.querySelector('input');
    var v = Math.max(1, (Number(input.value) || 1) + Number(b.getAttribute('data-qty-step')));
    input.value = v;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ---------- Delivery estimate ---------- */
  function addBusinessDays(d, n) {
    var x = new Date(d);
    while (n > 0) { x.setDate(x.getDate() + 1); if (x.getDay() !== 0 && x.getDay() !== 6) n--; }
    return x;
  }
  function initDelivery() {
    document.querySelectorAll('[data-delivery]').forEach(function (el) {
      var ship = Number(el.getAttribute('data-ship')) || 1;
      var min = Number(el.getAttribute('data-min')) || 5;
      var max = Number(el.getAttribute('data-max')) || min;
      var lang = document.documentElement.lang || 'en';
      var fmt = function (d) { return d.toLocaleDateString(lang, { weekday: 'short', month: 'short', day: 'numeric' }); };
      var now = new Date();
      var shipped = addBusinessDays(now, ship);
      var early = addBusinessDays(shipped, min);
      var late = addBusinessDays(shipped, max);
      var set = function (k, v) { var n = el.querySelector('[data-d="' + k + '"]'); if (n) n.textContent = v; };
      set('ordered', fmt(now));
      set('shipped', fmt(shipped));
      set('delivered', min === max ? fmt(late) : fmt(early) + ' – ' + fmt(late));
      set('by', fmt(late));
      el.hidden = false;
    });
  }

  /* ---------- Live search suggestions ---------- */
  function initPredictive() {
    document.querySelectorAll('[data-predictive]').forEach(function (form) {
      var input = form.querySelector('input[type="search"]');
      var box = form.querySelector('[data-predictive-results]');
      if (!input || !box) return;
      var timer;
      input.setAttribute('autocomplete', 'off');
      input.addEventListener('input', function () {
        clearTimeout(timer);
        var q = input.value.trim();
        if (q.length < 2) { box.hidden = true; box.innerHTML = ''; input.setAttribute('aria-expanded', 'false'); return; }
        timer = setTimeout(function () {
          fetch(root + 'search/suggest.json?q=' + encodeURIComponent(q) + '&resources[type]=product&resources[limit]=6')
            .then(function (r) { return r.json(); })
            .then(function (data) {
              var items = (data.resources && data.resources.results && data.resources.results.products) || [];
              if (!items.length) { box.innerHTML = '<p class="pred__empty">' + esc((T.noResults || 'Nothing found for "[q]".').replace('[q]', q)) + '</p>'; }
              else {
                box.innerHTML = '<ul role="listbox">' + items.map(function (p) {
                  var img = p.image ? p.image + (p.image.indexOf('?') > -1 ? '&' : '?') + 'width=120' : '';
                  return '<li role="option"><a class="pred__item" href="' + p.url + '">' + (img ? '<img src="' + img + '" alt="" width="56" height="56">' : '') +
                    '<span><b>' + esc(p.title) + '</b><span>' + esc(p.price ? money(Math.round(parseFloat(p.price) * 100)) : '') + '</span></span></a></li>';
                }).join('') + '</ul><a class="pred__all link-strong" href="' + root + 'search?q=' + encodeURIComponent(q) + '&type=product">' + esc(T.seeAll || 'See all results') + '</a>';
              }
              box.hidden = false;
              input.setAttribute('aria-expanded', 'true');
            });
        }, 200);
      });
      document.addEventListener('click', function (e) { if (!form.contains(e.target)) { box.hidden = true; input.setAttribute('aria-expanded', 'false'); } });
      input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { box.hidden = true; input.setAttribute('aria-expanded', 'false'); } });
    });
  }

  function init() { initDelivery(); initPredictive(); }
  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('shopify:section:load', init);
})();
