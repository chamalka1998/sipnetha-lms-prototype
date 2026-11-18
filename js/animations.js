// Animation layer. Safe: if anything fails, the page still shows normally.
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* 1. Page leave transition on internal links */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey) return;
    const h = a.getAttribute('href');
    if (!h || h.startsWith('#') || /^(https?:|mailto:|tel:)/.test(h)) return;
    e.preventDefault();
    document.documentElement.classList.add('leaving');
    setTimeout(() => (location.href = h), 200);
  });
  addEventListener('pageshow', () => document.documentElement.classList.remove('leaving'));

  if (reduce) return;

  /* 2. Header shadow after scroll */
  const header = document.querySelector('header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* 3. Soft card hover */
  $$('.grid > [class*="rounded-"]').forEach(el => {
    if (/shadow|border/.test(el.className) && !el.closest('aside, header')) el.classList.add('lift');
  });

  /* 5. Scroll reveal (staggered) */
  const root = document.querySelector('main') || document.body;
  const picked = new Set();
  const add = el => { if (![...picked].some(p => p.contains(el) || el.contains(p)) && !el.closest('aside, header, footer')) picked.add(el); };
  $$('h1, h2', root).forEach(add);
  $$('.grid > *', root).forEach(add);
  $$('section > div, section > p, article', root).forEach(el => { if (el.children.length) add(el); });
  const targets = [...picked];
  targets.forEach(el => {
    const sibs = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
    el.style.setProperty('--d', Math.min(sibs, 6) * 90 + 'ms');
    el.classList.add('reveal');
  });
  const done = el => setTimeout(() => { el.classList.remove('reveal', 'in'); el.style.removeProperty('--d'); }, 1200);
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); done(en.target); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  targets.forEach(el => io ? io.observe(el) : el.classList.add('in'));

  /* 6. Progress bars fill up, numbers count up (when they scroll into view) */
  const bars = $$('[style*="width"]', root).filter(el => /%/.test(el.style.width) && el.offsetHeight > 0 && el.offsetHeight <= 16);
  bars.forEach(el => { el._w = el.style.width; el.style.width = '0%'; el.style.transition = 'width 1.2s cubic-bezier(.2,.7,.2,1)'; });
  const nums = $$('h1, h2, h3, p, span, div', root).filter(el => !el.children.length && /^\d[\d,.]*\s?(%|\+|k|K)?$/.test(el.textContent.trim()) &&
    parseFloat(getComputedStyle(el).fontSize) >= 24);
  nums.forEach(el => { el._t = el.textContent.trim(); });
  const run = el => {
    const m = el._t.match(/^([\d,.]+)(.*)$/); const end = parseFloat(m[1].replace(/,/g, '')); const dec = (m[1].split('.')[1] || '').length;
    const t0 = performance.now();
    const step = t => { const p = Math.min((t - t0) / 1100, 1), v = end * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + m[2];
      if (p < 1) requestAnimationFrame(step); else el.textContent = el._t; };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const io2 = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; io2.unobserve(el);
      if (el._w) el.style.width = el._w; else if (el._t) run(el);
    }), { threshold: 0.4 });
    bars.forEach(b => io2.observe(b)); nums.forEach(n => io2.observe(n));
  } else bars.forEach(b => (b.style.width = b._w));
})();
