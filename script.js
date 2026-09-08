const header = document.querySelector('.site-header');
const toggleHeader = () => header?.classList.toggle('scrolled', window.scrollY > 34);
toggleHeader();
window.addEventListener('scroll', toggleHeader, { passive: true });

const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  document.body.classList.toggle('menu-open', open);
});
mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

const productCount = document.getElementById('productCount');
const selectedProducts = document.getElementById('selectedProducts');
const shopTotal = document.getElementById('shopTotal');
const extras = [...document.querySelectorAll('[data-extra]')];
const euro = value => new Intl.NumberFormat('de-DE').format(value) + ' €';

function updateShop() {
  if (!productCount) return;
  const option = productCount.options[productCount.selectedIndex];
  let total = Number(option.value);
  extras.forEach(box => { if (box.checked) total += Number(box.dataset.extra); });
  selectedProducts.textContent = option.dataset.count + ' Produkte';
  shopTotal.textContent = euro(total);
}
productCount?.addEventListener('change', updateShop);
extras.forEach(box => box.addEventListener('change', updateShop));

const contactPackage = document.getElementById('contactPackage');
document.querySelectorAll('.package-choice').forEach(button => {
  button.addEventListener('click', () => {
    contactPackage.value = button.dataset.package;
    document.getElementById('kontakt').scrollIntoView({ behavior: 'smooth' });
  });
});
document.getElementById('chooseShop')?.addEventListener('click', () => {
  contactPackage.value = `Online-Shop · ${selectedProducts.textContent} · ${shopTotal.textContent}`;
  document.getElementById('kontakt').scrollIntoView({ behavior: 'smooth' });
});

const revealTargets = document.querySelectorAll('.service-row,.project,.price-card,.steps li,.calculator');
revealTargets.forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: .08, rootMargin: '0px 0px -30px' });
  revealTargets.forEach(el => observer.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('is-visible'));
}

document.getElementById('contactForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const subject = `Projektanfrage: ${data.get('paket')}`;
  const body = [
    `Name: ${data.get('name')}`,
    `E-Mail: ${data.get('email')}`,
    `Gewünschte Leistung: ${data.get('paket')}`,
    '',
    String(data.get('nachricht'))
  ].join('\n');
  document.getElementById('formStatus').textContent = 'Ihre E-Mail-Anwendung wird geöffnet …';
  window.location.href = `mailto:info@webstudio24.digital?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
