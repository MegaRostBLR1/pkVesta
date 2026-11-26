const APP_CONFIG = {
  header: {
    html: './components/layout/header/header.html',
    css: './components/layout/header/header.css',
    js: './components/layout/header/header.js'
  },
  footer: {
    html: './components/layout/footer/footer.html',
    css: './components/layout/footer/footer.css',
    js: './components/layout/footer/footer.js'
  },
  cookies: {
    html: './components/layout/popups/cookies/cookies.html',
    css: './components/layout/popups/cookies/cookies.css',
    js: './components/layout/popups/cookies/cookies.js'
  },
  subscribe: {
    html: './components/layout/popups/subscribe/subscribe.html',
    css: './components/layout/popups/subscribe/subscribe.css',
    js: './components/layout/popups/subscribe/subscribe.js'
  },
  modal: {
    html: './components/layout/popups/main-modal/main-modal.html',
    css: './components/layout/popups/main-modal/main-modal.css',
    js: './components/layout/popups/main-modal/main-modal.js',
    init: 'initMainModal'
  },
  callbackModal: {
    html: './components/layout/popups/callback-modal/callback-modal.html',
    css: './components/layout/popups/callback-modal/callback-modal.css',
    js: './components/layout/popups/callback-modal/callback-modal.js',
    init: 'initCallbackModal'
  },
  defaultPage: 'home',
  pages: {
    'home': {
      title: 'Главная',
      html: './components/pages/home/home.html',
      js: './components/pages/home/home.js',
      init: 'initHome'
    },
    'services': {
      title: 'Услуги',
      html: './components/pages/services/services.html',
      js: './components/pages/services/services.js',
      init: 'initServices'
    },
    'laser': {
      title: 'Лазерная резка металла',
      html: './components/pages/services/laser/laser.html',
      css: './components/pages/services/laser/laser.css',
      js: './components/pages/services/laser/laser.js',
      init: 'initLaser'
    },
    'buildings': {
      title: 'Быстровозводимые здания',
      html: './components/pages/buildings/buildings.html',
      js: './components/pages/buildings/buildings.js',
      init: 'initBuildings'
    },
    'fast-buildings': {
      title: 'Быстровозводимые здания',
      html: './components/pages/fast-buildings/fast-buildings.html',
      css: './components/pages/fast-buildings/fast-buildings.css',
      js: './components/pages/fast-buildings/fast-buildings.js',
      init: 'initFastBuildings'
    },
    'buildings-directory': {
      title: 'Каталог зданий',
      html: './components/pages/buildings/buildings-directory/buildings-directory.html',
      css: './components/pages/buildings/buildings-directory/buildings-directory.css',
      js: './components/pages/buildings/buildings-directory/buildings-directory.js',
      init: 'initBuildingsDirectory'
    },
    'buildings-characteristics': {
      title: 'Характеристики быстровозводимых зданий',
      html: './components/pages/buildings/characteristics/characteristics.html',
      js: './components/pages/buildings/characteristics/characteristics.js',
      init: 'initBuildingsCharacteristics'
    },
    'buildings-why-pk-vesta': {
      title: 'Почему PK Vesta',
      html: './components/pages/buildings/why-pk-vesta/why-pk-vesta.html',
      css: './components/pages/buildings/why-pk-vesta/why-pk-vesta.css',
      js: './components/pages/buildings/why-pk-vesta/why-pk-vesta.js',
      init: 'initBuildingsWhyPkVesta'
    },
    'buildings-comparison': {
      title: 'Сравнение',
      html: './components/pages/buildings/comparison/comparison.html',
      css: './components/pages/buildings/comparison/comparison.css',
      js: './components/pages/buildings/comparison/comparison.js',
      init: 'initBuildingsComparison'
    },
    'buildings-prices': {
      title: 'Цены',
      html: './components/pages/buildings/buildings-prices/buildings-prices.html',
      css: './components/pages/buildings/buildings-prices/buildings-prices.css',
      js: './components/pages/buildings/buildings-prices/buildings-prices.js',
      init: 'initBuildingsPrices'
    },
    'buildings-faq': {
      title: 'Вопросы',
      html: './components/pages/buildings/buildings-faq/buildings-faq.html',
      css: './components/pages/buildings/buildings-faq/buildings-faq.css',
      js: './components/pages/buildings/buildings-faq/buildings-faq.js',
      init: 'initBuildingsFaq'
    },
    'objects': {
      title: 'Объекты',
      html: './components/pages/objects/objects.html',
      css: './components/pages/objects/objects.css',
      js: './components/pages/objects/objects.js',
      init: 'initObjects'
    },
    'object-page': {
      title: 'Объект',
      html: './components/pages/objects/object-page/object-page.html',
      css: './components/pages/objects/object-page/object-page.css',
      js: './components/pages/objects/object-page/object-page.js',
      init: 'initObjectPage'
    },
    'press-center': {
      title: 'Пресс-центр',
      html: './components/pages/press-center/press-center.html',
      css: './components/pages/press-center/press-center.css',
      js: './components/pages/press-center/press-center.js',
      init: 'initPressCenter'
    },
    'news': {
      title: 'Новости',
      html: './components/pages/press-center/news/news.html',
      css: './components/pages/press-center/news/news.css',
      js: './components/pages/press-center/news/news.js',
      init: 'initNews'
    },
    'news-item': {
      title: 'Новость',
      html: './components/pages/press-center/news-item/news-item.html',
      css: './components/pages/press-center/news-item/news-item.css',
      js: './components/pages/press-center/news-item/news-item.js',
      init: 'initNewsItem'
    },
    'video': {
      title: 'Видео',
      html: './components/pages/press-center/video/video.html',
      css: './components/pages/press-center/video/video.css',
      js: './components/pages/press-center/video/video.js',
      init: 'initVideo'
    },
    'faq': {
      title: 'F.A.Q.',
      html: './components/pages/press-center/faq/faq.html',
      css: './components/pages/press-center/faq/faq.css',
      js: './components/pages/press-center/faq/faq.js',
      init: 'initFaq'
    },
    'articles': {
      title: 'Статьи',
      html: './components/pages/press-center/articles/articles.html',
      css: './components/pages/press-center/articles/articles.css',
      js: './components/pages/press-center/articles/articles.js',
      init: 'initArticles'
    },
    'article-item': {
      title: 'Статья',
      html: './components/pages/press-center/article-item/article-item.html',
      css: './components/pages/press-center/article-item/article-item.css',
      js: './components/pages/press-center/article-item/article-item.js',
      init: 'initArticleItem'
    },
    'about': {
      title: 'О компании',
      html: './components/pages/about/about.html',
      css: './components/pages/about/about.css',
      js: './components/pages/about/about.js',
      init: 'initAbout'
    },
    'prices': {
      title: 'Цены',
      html: './components/pages/prices/prices.html',
      css: './components/pages/prices/prices.css',
      js: './components/pages/prices/prices.js',
      init: 'initPrices'
    },
    'calculator': {
      title: 'Онлайн калькулятор',
      html: './components/pages/calculator/calculator.html',
      css: './components/pages/calculator/calculator.css',
      js: './components/pages/calculator/calculator.js',
      init: 'initCalculator'
    },
    'contacts': {
      title: 'Контакты',
      html: './components/pages/contacts/contacts.html',
      css: './components/pages/contacts/contacts.css',
      js: './components/pages/contacts/contacts.js',
      init: 'initContacts'
    },
    'search-result': {
      title: 'Результаты поиска',
      html: './components/pages/search-result/search-result.html',
      css: './components/pages/search-result/search-result.css',
      js: './components/pages/search-result/search-result.js',
      init: 'initSearchResult'
    }
  }
};

const loadedScripts = new Map();
const loadedStylesheets = new Map();

let renderRequestId = 0;
let currentPageName = null;

const OBJECT_SECTION_ROUTES = {
  'object-detail': { panel: 'object-detail', title: 'Объект' },
  'object-characteristics': { panel: 'object-characteristics', title: 'Характеристики объекта' },
  'object-parameters': { panel: 'object-parameters', title: 'Параметры объекта' }
};

const ROUTE_ALIASES = {
  'page-1': 'objects',
  'page-2': 'services',
  'page-3': 'objects',
  'page-4': 'press-center',
  'page-5': 'about',
  'page-6': 'prices',
  'page-7': 'contacts'
};

const NAVIGATION_ROUTES = {
  'Продукция': 'buildings',
  'Быстровозводимые здания': 'fast-buildings',
  'Легкие металлоконструкции': 'objects',
  'Сэндвич панели': 'objects',
  'Комплектующие для ворот': 'objects',
  'Оцинкованный профиль': 'objects',
  'Услуги': 'services',
  'Лазерная резка': 'laser',
  'Лизинг зданий': 'services',
  'Консалтинг': 'services',
  'Проектирование': 'services',
  'Изготовление': 'services',
  'Фундамент': 'services',
  'Доставка': 'services',
  'Монтаж': 'services',
  'Объекты': 'objects',
  'Пресс-центр': 'press-center',
  'Новости': 'news',
  'Видео': 'video',
  'F.A.Q.': 'faq',
  'Telegram канал': 'press-center',
  'Статьи': 'articles',
  'Завод': 'about',
  'Цены': 'prices',
  'Контакты': 'contacts'
};

async function loadHtml(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Не удалось загрузить ${url}: HTTP ${response.status}`);
  }

  return response.text();
}

function loadStylesheet(url) {
  if (!url) {
    return Promise.resolve();
  }

  if (loadedStylesheets.has(url)) {
    return loadedStylesheets.get(url);
  }

  const existingLink = document.querySelector(`link[data-page-style="${url}"]`);

  if (existingLink) {
    return Promise.resolve();
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  link.dataset.pageStyle = url;

  const promise = new Promise((resolve, reject) => {
    link.addEventListener('load', resolve, { once: true });

    link.addEventListener('error', () => {
      link.remove();
      loadedStylesheets.delete(url);
      reject(new Error(`Не удалось загрузить таблицу стилей: ${url}`));
    }, { once: true });
  });

  loadedStylesheets.set(url, promise);
  document.head.append(link);

  return promise;
}

function loadScript(url) {
  if (!url) {
    return Promise.resolve();
  }

  if (loadedScripts.has(url)) {
    return loadedScripts.get(url);
  }

  const script = document.createElement('script');
  script.src = url;
  script.async = false;

  const promise = new Promise((resolve, reject) => {
    script.addEventListener('load', resolve, { once: true });

    script.addEventListener('error', () => {
      script.remove();
      loadedScripts.delete(url);
      reject(new Error(`Не удалось загрузить скрипт: ${url}`));
    }, { once: true });
  });

  loadedScripts.set(url, promise);
  document.body.append(script);

  return promise;
}

async function loadComponent(target, component) {
  if (!target || !component?.html) {
    return;
  }

  target.innerHTML = await loadHtml(component.html);

  await Promise.all([
    loadStylesheet(component.css),
    loadScript(component.js)
  ]);
}

function getPageName() {
  const hashRoute = window.location.hash
    .replace(/^#\/?/, '')
    .split(/[?&]/, 1)[0]
    .trim()
    .toLowerCase();

  const route = hashRoute || APP_CONFIG.defaultPage;

  if (APP_CONFIG.pages[route] || OBJECT_SECTION_ROUTES[route]) {
    return route;
  }

  return ROUTE_ALIASES[route] || APP_CONFIG.defaultPage;
}

function getPageConfig(pageName) {
  const isObjectSection = Boolean(OBJECT_SECTION_ROUTES[pageName]);
  const configPageName = isObjectSection ? 'object-page' : pageName;
  const page = APP_CONFIG.pages[configPageName] || APP_CONFIG.pages[APP_CONFIG.defaultPage];

  return { isObjectSection, configPageName, page };
}

function initializePage(page, pageName) {
  const initializer = page.init ? window[page.init] : null;

  if (typeof initializer === 'function') {
    initializer(pageName);
  }
}

async function renderPage(pageName) {
  const { isObjectSection, configPageName, page } = getPageConfig(pageName);

  if (isObjectSection && currentPageName === 'object-page') {
    setObjectPageSection(pageName);
    document.title = `pkVesta — ${OBJECT_SECTION_ROUTES[pageName].title}`;
    return;
  }

  const requestId = ++renderRequestId;
  const main = document.querySelector('#app-main');

  if (!main) {
    console.error('Не найден контейнер страницы #app-main.');
    return;
  }

  currentPageName = null;
  main.innerHTML = '<p class="loading">Загрузка страницы…</p>';

  try {
    const html = await loadHtml(page.html);

    if (requestId !== renderRequestId) {
      return;
    }

    main.innerHTML = html;

    await Promise.all([
      loadStylesheet(page.css),
      loadScript(page.js)
    ]);

    if (requestId !== renderRequestId) {
      return;
    }

    initializePage(page, pageName);

    document.title = isObjectSection
      ? `pkVesta — ${OBJECT_SECTION_ROUTES[pageName].title}`
      : `pkVesta — ${page.title}`;

    currentPageName = configPageName;
  } catch (error) {
    if (requestId !== renderRequestId) {
      return;
    }

    console.error(error);
    main.innerHTML = '<p class="error">Не удалось загрузить страницу. Проверьте пути к файлам и запустите проект через локальный HTTP-сервер.</p>';
  }
}

function initNavigationRouting() {
  const calculatorLink = document.querySelector('.app-header .header-bottom__action-calculation');

  if (calculatorLink) {
    calculatorLink.href = '#/calculator';
  }

  const navigationLinks = document.querySelectorAll(
    '.app-header a.nav-link, .app-header a.nav-list__nested-list-link'
  );

  navigationLinks.forEach((link) => {
    const label = link.textContent.trim().replace(/\s+/g, ' ');
    const route = NAVIGATION_ROUTES[label];

    if (route) {
      link.href = `#/${route}`;
    }
  });
}

function initializeConfiguredComponent(component, target) {
  if (!target || !component?.init) {
    return;
  }

  const initializer = window[component.init];

  if (typeof initializer === 'function') {
    initializer();
  }
}

async function initApp() {
  const components = [
    { target: document.querySelector('#app-header'), config: APP_CONFIG.header },
    { target: document.querySelector('#app-footer'), config: APP_CONFIG.footer },
    { target: document.querySelector('#app-cookies'), config: APP_CONFIG.cookies },
    { target: document.querySelector('#app-subscribe'), config: APP_CONFIG.subscribe },
    { target: document.querySelector('#app-main-modal'), config: APP_CONFIG.modal },
    { target: document.querySelector('#app-callback-modal'), config: APP_CONFIG.callbackModal }
  ];

  const results = await Promise.allSettled(
    components.map(({ target, config }) => loadComponent(target, config))
  );

  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error(result.reason);
    }
  });

  components.forEach(({ target, config }) => {
    initializeConfiguredComponent(config, target);
  });

  initNavigationRouting();
  await renderPage(getPageName());
}

window.addEventListener('hashchange', () => {
  renderPage(getPageName());
});

document.addEventListener('DOMContentLoaded', initApp);
