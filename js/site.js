// Shared behaviour for every page
function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2800);
}
window.alert = toast; // friendly message instead of a browser alert box

// Mobile menu
const btn = document.getElementById('menu-btn'), menu = document.getElementById('mobile-menu');
if (btn && menu) {
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden') === false;
    btn.querySelector('span').textContent = open ? 'close' : 'menu';
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
}

// Floating badges in hero areas
document.querySelectorAll('.absolute.backdrop-blur-md.shadow-lg, .absolute.backdrop-blur-md.shadow-md').forEach((el, i) => {
  el.classList.add('float-badge'); el.style.animationDelay = (i * 0.9) + 's';
});

// Links that are not connected in this prototype show a short message
document.addEventListener('click', e => {
  const a = e.target.closest('a[href="#"]');
  if (a) { e.preventDefault(); toast('Demo only: this button is not connected in the prototype.'); }
});
