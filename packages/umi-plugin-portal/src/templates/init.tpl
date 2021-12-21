// 初始默认的service，如果请求nacos，会被覆盖
window.$$config = {
  nacos: {{{ nacos }}},
  alone: false,
};

// runtimePublicPath，渲染到主应用后的子应用，比如图片需要改成绝对路径
window.publicPath = location.pathname;

(function () {
  function log(str) {
    console.log("%c"+str, "font-size:14px;color:#666;text-shadow:1px 1px 2px #ccc;");
  }

  function warn(str) {
    console.log("%c"+str, "font-size:14px;color:#dd9900;text-shadow:1px 1px 2px #eee;");
  }

  function addScript(src) {
    const script = document.createElement('script');
    script.setAttribute('src', 'alone/' + src);
    document.head.appendChild(script);
    return new Promise((resolve) => {
      script.addEventListener('load', function () {
        resolve(undefined);
      });
    });
  }

  function addLink(src, dir = 'alone/') {
    const link = document.createElement('link');
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', dir + src);
    document.head.appendChild(link);
  }

  /** 加载nacos配置，如果加载失败，则启用自身env的配置 */
  function getRuntimeConfig() {
    const nacosUrl = '{{{ nacosUrl }}}';
    if (nacosUrl) {
      log('请求nacos配置...');

      const fail = () => {
        warn('nacos加载失败，启用默认设置');
      }

      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 2000);

      return fetch(nacosUrl, { signal: controller.signal })
        .then((response) => {
          if (response.status === 200) {
            return response.text();
          }
          fail();
        })
        .then((text) => {
          const json = eval(`(${text})`);
          if (!json) {
            throw Error;
          }
          window.$$config.nacos = {...window.$$config.nacos, ...json};
        })
        .catch(() => {
          fail();
        });
    }
    return Promise.resolve();
  }

  // 使用portal的资源
  window.React = parent.React;
  window.ReactDOM = parent.ReactDOM;
  window.antd = parent.antd;
  window.moment = parent.moment;

  const allowAccessParentProp = [
    'HTMLCanvasElement',
    'document',
    'innerWidth',
    'innerHeight',
    'scrollX',
    'scrollY',
    'pageXOffset',
    'pageYOffset',
  ];
  
  const proxyWindow = new Proxy({}, {
    get(target, key) {
      // 针对paper.js: self.window
      if (key === 'window') {
        return proxyWindow;
      }
      if (allowAccessParentProp.includes(key)) {
        return parent[key];
      }
      const prop = Reflect.get(window, key);
      if (typeof prop === 'function' && !prop['prototype']) {
        return (...args) => {
          return Reflect.apply(prop, window, args);
        }
      }
      return prop;
    },
    set(target, key, value) {
      return Reflect.set(window, key, value);
    }
  });

  const antdThemes = {{{ antdThemes }}};

  window.addEventListener('bundleReady', function (event) {
    if (!window.React) {
      // 动态加载全局资源，此时作为独立应用或者Portal
      if (antdThemes.length > 0) {
        if (process.env.NODE_ENV === 'production') {
          const cssMatcer = /theme\-[\w\d\-]+\.css/;
          fetch('./asset-manifest.json')
            .then((res) => res.json())
            .then((json) => {
              const themes = Object.keys(json).reduce((prev, curr) => {
                if (cssMatcer.test(curr)) {
                  return [...prev, { name: curr.split('.')[0], chunk: json[curr] }];
                }
                return prev;
              }, []);

              window.$$config.antdThemes = themes;
              const defaultTheme = themes.find(
                (item) => item.name === 'theme-default',
              )?.chunk;
              if (defaultTheme) {
                addLink(defaultTheme, '');
              }
            });
        } else {
          window.$$config.antdThemes = antdThemes.map((key) => ({
            name: key,
            chunk: key + '.css',
          }));
          if (antdThemes.indexOf('default')) {
            addLink('theme-default.css', '');
          }
        }
      } else {
        addLink('antd.css');
      }

      addScript('react.js').then(() => {
        Promise.all([
          addScript('react-dom.js'),
          addScript('moment.js').then(() => {
            addScript('zh-cn.js');
          }),
          addScript('antd.js'),
          getRuntimeConfig(),
        ]).then(() => {
          // 独立运行
          window.$$config.alone = true;
          event.detail.run(window, document, window);
        });
      });
    } else {
      // 为应用在portal上面创建一个antd弹出层容器，应用离开后删除这个容器
      const doc = window.parent.document;
      if (!doc.querySelector('#{{{ appKey }}}')) {
        const antPopContainer = doc.createElement('div');
        antPopContainer.id = '{{{ appKey }}}';
        doc.body.appendChild(antPopContainer);
        window.addEventListener('unload', () => {
          doc.body.removeChild(antPopContainer);
        });
      }
      event.detail.run(proxyWindow, window.parent.document, proxyWindow);
    }
  });
})();
