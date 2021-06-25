window.$$config = {
  service: {{{ service }}},
  nacos: '{{{ nacos }}}',
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

  window.addEventListener('bundleReady', function (event) {
    if (!window.React) {
      // 动态加载全局资源，此时作为独立应用
      Promise.all([
        addScript('react.js'),
        addScript('react-dom.js'),
        addScript('moment.js').then(() => {
          addScript('zh-cn.js')
        }),
        addScript('antd.js'),
        getRuntimeConfig(),
      ]).then(() => {
        window.$$config.alone = true;
        event.detail.run();
      });
      addLink('antd.css');
    } else {
      addScript('moment.js').then(() => {
        event.detail.run();
      });
    }
  });
})();
