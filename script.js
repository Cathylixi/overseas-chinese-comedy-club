const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = [...document.querySelectorAll('main section[id]')];
const languageSelect = document.querySelector('#language-select');
const isEnglish = document.body.dataset.language === 'en';
const menuLabels = isEnglish
  ? { open: 'Open navigation', close: 'Close navigation' }
  : { open: '打开导航', close: '关闭导航' };

if (languageSelect) {
  languageSelect.addEventListener('change', () => {
    const target = languageSelect.value === 'en'
      ? languageSelect.dataset.enUrl
      : languageSelect.dataset.zhUrl;
    const destination = new URL(target, window.location.href);
    destination.hash = window.location.hash;
    window.location.href = destination.href;
  });
}

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 30);
}

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
  header.classList.remove('menu-visible');
  document.body.classList.remove('menu-open');
  menuToggle.querySelector('.sr-only').textContent = menuLabels.open;
}

menuToggle.addEventListener('click', () => {
  const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(willOpen));
  navigation.classList.toggle('open', willOpen);
  header.classList.toggle('menu-visible', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
  menuToggle.querySelector('.sr-only').textContent = willOpen ? menuLabels.close : menuLabels.open;
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: '-30% 0px -60% 0px' }
);

sections.forEach((section) => sectionObserver.observe(section));

document.querySelector('#copyright-year').textContent = new Date().getFullYear();
