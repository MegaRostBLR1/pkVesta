const APP_CONFIG = {
  header: {
    html: './components/header/index.html',
    css: './components/header/style.css',
    js: './components/header/script.js'
  },
  footer: {
    html: './components/footer/index.html',
    css: './components/footer/style.css',
    js: './components/footer/script.js'
  },
  defaultPage: 'page-1',
  pages: {
    'page-1': {
      title: 'Страница 1',
      html: './pages/page-1/index.html',
      css: './pages/page-1/style.css',
      js: './pages/page-1/script.js',
      init: 'initPage1'
    },
    'page-2': {
      title: 'Страница 2',
      html: './pages/page-2/index.html',
      css: './pages/page-2/style.css',
      js: './pages/page-2/script.js',
      init: 'initPage2'
    },
    'page-3': {
      title: 'Страница 3',
      html: './pages/page-3/index.html',
      css: './pages/page-3/style.css',
      js: './pages/page-3/script.js',
      init: 'initPage3'
    },
    'page-4': {
      title: 'Страница 4',
      html: './pages/page-4/index.html',
      css: './pages/page-4/style.css',
      js: './pages/page-4/script.js',
      init: 'initPage4'
    },
    'page-5': {
      title: 'Страница 5',
      html: './pages/page-5/index.html',
      css: './pages/page-5/style.css',
      js: './pages/page-5/script.js',
      init: 'initPage5'
    },
    'page-6': {
      title: 'Страница 6',
      html: './pages/page-6/index.html',
      css: './pages/page-6/style.css',
      js: './pages/page-6/script.js',
      init: 'initPage6'
    },
    'page-7': {
      title: 'Страница 7',
      html: './pages/page-7/index.html',
      css: './pages/page-7/style.css',
      js: './pages/page-7/script.js',
      init: 'initPage7'
    }
  }
};

const loadedPageAssets = new Set();

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
  return window.location.hash.replace(/^#\/?/, '') || APP_CONFIG.defaultPage;
}

async function renderPage(pageName) {
  const page = APP_CONFIG.pages[pageName] || APP_CONFIG.pages[APP_CONFIG.defaultPage];
  const main = document.querySelector('#app-main');

  main.innerHTML = '<p class="loading">Загрузка страницы…</p>';

  try {
    const html = await loadHtml(page.html);

    loadStylesheet(page.css);
    await loadScript(page.js);

    main.innerHTML = html;
    document.title = `pkVesta — ${page.title}`;

    const init = window[page.init];

    if (typeof init === 'function') {
      init();
    }
  } catch (error) {
    console.error(error);
    main.innerHTML = '<p class="error">Не удалось загрузить страницу. Проверьте путь к файлам и запустите проект через локальный HTTP-сервер.</p>';
  }
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

  await renderPage(getPageName());
}

window.addEventListener('hashchange', () => {
  renderPage(getPageName());
});

document.addEventListener('DOMContentLoaded', initApp);
