// 初始默认的service，如果请求nacos，会被覆盖
window.$$config = {
  nacos: '{{{ nacos }}}',
  service: {{{ service }}},
  appPath: '{{{ appPath }}}',
  sso: {{{ sso }}},
  alone: false,
};

(function () {
  try {
    window.document.domain = window.location.host
      .split('.')
      .slice(-2)
      .join('.')
      .split(':')[0];
  } catch (er) {
    console.warn('domain设置失败。');
  }

  function log(str) {
    console.log("%c"+str, "font-size:14px;color:#666;text-shadow:1px 1px 2px #ccc;");
  }

  function warn(str) {
    console.log("%c"+str, "font-size:14px;color:#dd9900;text-shadow:1px 1px 2px #eee;");
  }

  function getRootWindow(win) {
    try {
      if (win.parent === win) return win;
      // @ts-ignore
      if (win.parent['$$_K2_SDK']) return win.parent;
      return getRootWindow(win.parent);
    } catch (error) {
      return window;
    }
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

  function addLink(src) {
    const link = document.createElement('link');
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'alone/' + src);
    document.head.appendChild(link);
  }

  /** 加载nacos配置，如果加载失败，则启用自身env的配置 */
  function getRuntimeConfig() {
    if ($$config.nacos) {
      log('请求nacos配置...');

      const fail = () => {
        warn('nacos加载失败，启用默认设置');
      }

      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 2000);

      return fetch($$config.nacos, { signal: controller.signal })
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
          window.$$config = json;
        })
        .catch(() => {
          fail();
        });
    }
    return Promise.resolve();
  }

  window.$$K2RootWindow = getRootWindow(window);

  // 使用portal的资源
  window.React = window.$$K2RootWindow.React;
  window.ReactDOM = window.$$K2RootWindow.ReactDOM;
  window.antd = window.$$K2RootWindow.antd;
  try {
    // portal的antd引用portal的moment，为了保证antd的moment受控，应用内也要引用它
    window.moment = $$K2RootWindow.$$_K2_SDK.lib.basis.moment;
  } catch {}

  const proxyWindow = new Proxy({}, {
    get(target, key) {
      // 防止有的代码会以window.document来访问document
      if (key === 'document') {
        return window.parent.document;
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

  window.addEventListener('bundleReady', function (event) {
    if ({{{ integrated }}}) {
      if (!window.React) {
        // 动态加载全局资源，此时作为独立应用
        addLink('antd.css'),
        Promise.all([
          addScript('react.js'),
          addScript('react-dom.js'),
          addScript('moment.js').then(() => {
            addScript('zh-cn.js')
          }),
          addScript('antd.js'),
          getRuntimeConfig(),
        ]).then(() => {
          // 独立运行
          window.$$config.alone = true;
          event.detail.run(window, document);
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
        
        if (window.moment) {
          // portal的moment没有加载中文语言包，这里加载一下会导致portal所有应用都有中文moment
          if (moment.locale() === 'en') {
            addScript('zh-cn.js');
          }
          event.detail.run(proxyWindow, window.parent.document);
        } else {
          // 引用应用的未必是portal
          addScript('moment.js').then(() => {
            addScript('zh-cn.js');
            event.detail.run(proxyWindow, window.parent.document);
          });
        }
      }
    } else {
      // 独立运行，自身含有依赖文件
      window.$$config.alone = true;
      event.detail.run(window, document);
    }
  });
})();
