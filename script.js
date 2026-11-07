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

const galleryFilters = [...document.querySelectorAll('.gallery-filter')];
const galleryItems = [...document.querySelectorAll('.gallery-card[data-category]')];
const lightbox = document.querySelector('#photo-lightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-shell > img');
const lightboxDate = lightbox?.querySelector('.lightbox-copy p');
const lightboxTitle = lightbox?.querySelector('.lightbox-copy h3');
const lightboxDescription = lightbox?.querySelector('.lightbox-copy span');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

galleryFilters.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    galleryFilters.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle('active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    });

    galleryItems.forEach((item) => {
      item.hidden = filter !== 'all' && item.dataset.category !== filter;
    });
  });
});

function closeLightbox() {
  if (lightbox?.open) lightbox.close();
}

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;

    const image = item.querySelector('.gallery-media img');
    const date = item.querySelector('.gallery-hover b');
    const title = item.querySelector('.gallery-caption strong');
    const description = item.querySelector('.gallery-caption small');

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxDate.textContent = date?.textContent || '';
    lightboxTitle.textContent = title?.textContent || '';
    lightboxDescription.textContent = description?.textContent || '';
    lightbox.showModal();
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox?.addEventListener('close', () => {
  if (lightboxImage) lightboxImage.removeAttribute('src');
});

const trainingDialog = document.querySelector('#training-dialog');
const trainingOpeners = [...document.querySelectorAll('[data-training-dialog]')];
const trainingClose = trainingDialog?.querySelector('.training-close');
const trainingForm = trainingDialog?.querySelector('#training-form');

function closeTrainingDialog() {
  if (trainingDialog?.open) trainingDialog.close();
}

trainingOpeners.forEach((opener) => {
  opener.addEventListener('click', (event) => {
    event.preventDefault();
    closeMenu();
    if (trainingDialog && !trainingDialog.open) trainingDialog.showModal();
  });
});

trainingClose?.addEventListener('click', closeTrainingDialog);
trainingDialog?.addEventListener('click', (event) => {
  if (event.target === trainingDialog) closeTrainingDialog();
});

trainingForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(trainingForm);
  const details = {
    name: formData.get('name'),
    age: formData.get('age'),
    location: formData.get('location'),
    email: formData.get('email'),
    wechat: formData.get('wechat'),
  };
  const subject = isEnglish
    ? 'Cohort 7 Training Registration'
    : '第七期海外华语脱口秀俱乐部培训报名';
  const body = isEnglish
    ? [
        'Cohort 7 Training Registration',
        '',
        `Name: ${details.name}`,
        `Age: ${details.age}`,
        `Country and City: ${details.location}`,
        `Email: ${details.email}`,
        `WeChat ID: ${details.wechat}`,
      ]
    : [
        '第七期海外华语脱口秀俱乐部培训报名',
        '',
        `姓名：${details.name}`,
        `年龄：${details.age}`,
        `所在国家及城市：${details.location}`,
        `电子邮箱：${details.email}`,
        `微信号：${details.wechat}`,
      ];

  window.location.href = `mailto:namccct@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.join('\n'))}`;
});

document.querySelector('#copyright-year').textContent = new Date().getFullYear();
