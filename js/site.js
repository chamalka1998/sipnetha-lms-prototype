// Shared behaviour: toast, mobile menu, LMS drawer, demo links
function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2800);
}
window.alert = toast; // soft message instead of a browser alert box

const kind = document.body.dataset.kind;

/* Website pages: hamburger menu */
if (kind === 'public') {
  const header = document.querySelector('header');
  const nav = header && header.querySelector('nav');
  if (nav) {
    const actions = nav.nextElementSibling;
    const btn = document.createElement('button');
    btn.id = 'menu-btn'; btn.type = 'button'; btn.setAttribute('aria-label', 'Open menu');
    btn.innerHTML = '<span class="material-symbols-outlined">menu</span>';
    (actions || nav.parentElement).appendChild(btn);
    const panel = document.createElement('div');
    panel.id = 'mobile-menu';
    panel.innerHTML = [...nav.querySelectorAll('a')].map(a => `<a href="${a.getAttribute('href')}">${a.textContent.trim()}</a>`).join('') +
      '<a href="https://wa.me/94771234567" target="_blank" rel="noopener" style="color:#16a34a">Chat on WhatsApp</a>';
    header.firstElementChild.appendChild(panel);
    btn.addEventListener('click', () => {
      const open = panel.classList.toggle('open');
      btn.firstChild.textContent = open ? 'close' : 'menu';
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }
}

/* LMS pages: sidebar drawer on small screens */
if (kind === 'lms') {
  const header = document.querySelector('header');
  const aside = document.querySelector('aside');
  if (header && aside) {
    const burger = document.createElement('button');
    burger.id = 'lms-burger'; burger.type = 'button'; burger.setAttribute('aria-label', 'Open menu');
    burger.innerHTML = '<span class="material-symbols-outlined">menu</span>';
    header.insertBefore(burger, header.firstChild);
    const overlay = document.createElement('div'); overlay.id = 'lms-overlay';
    document.body.appendChild(overlay);
    const toggle = on => document.body.classList.toggle('nav-open', on);
    burger.addEventListener('click', () => toggle(true));
    overlay.addEventListener('click', () => toggle(false));
    aside.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
  }
}

/* Buttons not connected yet */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href="#"]');
  if (a) { e.preventDefault(); toast('Demo only: this button is not connected in the prototype.'); }
});
