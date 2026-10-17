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
  defaultPage: 'home',
  pages: {
    'home': {
      title: 'Главная',
      html: './components/pages/home/home.html',
      css: './components/pages/home/home.css',
      js: './components/pages/home/home.js',
      init: 'initHome'
    },
    'services': {
      title: 'Услуги',
      html: './components/pages/services/services.html',
      css: './components/pages/services/services.css',
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
      css: './components/pages/buildings/buildings.css',
      js: './components/pages/buildings/buildings.js',
      init: 'initBuildings'
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
      css: './components/pages/buildings/characteristics/characteristics.css',
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
    'object-detail': {
      title: 'Объект',
      html: './components/pages/objects/object-detail/object-detail.html',
      css: './components/pages/objects/object-detail/object-detail.css',
      js: './components/pages/objects/object-detail/object-detail.js',
      init: 'initObjectDetail'
    },
    'object-characteristics': {
      title: 'Характеристики объекта',
      html: './components/pages/objects/object-characteristics/object-characteristics.html',
      css: './components/pages/objects/object-characteristics/object-characteristics.css',
      js: './components/pages/objects/object-characteristics/object-characteristics.js',
      init: 'initObjectCharacteristics'
    },
    'object-parameters': {
      title: 'Параметры объекта',
      html: './components/pages/objects/object-parameters/object-parameters.html',
      css: './components/pages/objects/object-parameters/object-parameters.css',
      js: './components/pages/objects/object-parameters/object-parameters.js',
      init: 'initObjectParameters'
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
    'contacts': {
      title: 'Контакты',
      html: './components/pages/contacts/contacts.html',
      css: './components/pages/contacts/contacts.css',
      js: './components/pages/contacts/contacts.js',
      init: 'initContacts'
    }
  }
};

const loadedPageAssets = new Set();
let renderRequestId = 0;

const ROUTE_ALIASES = {
  'page-1': 'objects',
  'page-2': 'services',
  'page-3': 'objects',
  'page-4': 'press-center',
  'page-5': 'about',
  'page-6': 'prices',
  'page-7': 'contacts'
};

async function loadHtml(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Не удалось загрузить ${url}: HTTP ${response.status}`);
  }

  return response.text();
}

async function loadComponent(target, component) {
  target.innerHTML = await loadHtml(component.html);
  loadStylesheet(component.css);
  await loadScript(component.js);
}

function loadStylesheet(url) {
  const existingLink = document.querySelector(`link[data-page-style="${url}"]`);

  if (existingLink) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  link.dataset.pageStyle = url;
  document.head.append(link);
}

function loadScript(url) {
  if (loadedPageAssets.has(url)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.src = url;
    script.async = false;

    script.onload = () => {
      loadedPageAssets.add(url);
      resolve();
    };

    script.onerror = () => {
      reject(new Error(`Не удалось загрузить ${url}`));
    };

    document.body.append(script);
  });
}

function getPageName() {
  const hashRoute = window.location.hash
      .replace(/^#\/?/, '')
      .split(/[?&]/, 1)[0]
      .trim()
      .toLowerCase();

  const route = hashRoute || APP_CONFIG.defaultPage;

  if (APP_CONFIG.pages[route]) {
    return route;
  }

  return ROUTE_ALIASES[route] || APP_CONFIG.defaultPage;
}

async function renderPage(pageName) {
  const requestId = ++renderRequestId;
  const page = APP_CONFIG.pages[pageName] || APP_CONFIG.pages[APP_CONFIG.defaultPage];
  const main = document.querySelector('#app-main');

  if (!main) {
    return;
  }

  main.innerHTML = '<p class="loading">Загрузка страницы…</p>';

  try {
    const html = await loadHtml(page.html);

    if (requestId !== renderRequestId) {
      return;
    }

    main.innerHTML = html;
    loadStylesheet(page.css);
    await loadScript(page.js);

    if (requestId !== renderRequestId) {
      return;
    }

    document.title = `pkVesta — ${page.title}`;

    const init = window[page.init];

    if (typeof init === 'function') {
      init();
    }
  } catch (error) {
    if (requestId !== renderRequestId) {
      return;
    }

    console.error(error);
    main.innerHTML = '<p class="error">Не удалось загрузить страницу. Проверьте путь к файлам и запустите проект через локальный HTTP-сервер.</p>';
  }
}


function initNavigationRouting() {
  const routeByLabel = {
    'Продукция': 'objects',
    'Быстровозводимые здания': 'buildings',
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

  document.querySelectorAll('.app-header a.nav-link, .app-header a.nav-list__nested-list-link')
      .forEach((link) => {
        const label = link.textContent.trim().replace(/\s+/g, ' ');
        const route = routeByLabel[label];

        if (route) {
          link.href = `#/${route}`;
        }
      });
}

async function initApp() {
  const header = document.querySelector('#app-header');
  const footer = document.querySelector('#app-footer');

  try {
    await Promise.all([
      loadComponent(header, APP_CONFIG.header),
      loadComponent(footer, APP_CONFIG.footer)
    ]);
  } catch (error) {
    console.error(error);
  }

  initNavigationRouting();
  await renderPage(getPageName());
}

window.addEventListener('hashchange', () => {
  renderPage(getPageName());
});

document.addEventListener('DOMContentLoaded', initApp);
