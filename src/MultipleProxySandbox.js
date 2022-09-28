let activeSandboxCount = 0;

class MultipleProxySandbox {
  proxy = {};

  constructor(props) {
    const { fakeWindow, keysWithGetters } = this.createFakeWindow();

    this.proxy = new Proxy(fakeWindow, {
      set(target, key, value) {
        // 对于一些非原生的属性不做修改，因这些属性可能是用户自己改的
        // 这里只需要判断 target[key] 即可， 因为只有原生属性才会复制到 target 上
        if (!target[key] && window[key]) {
          return;
        }
        target[key] = value;
      },
      get(target, key) {
        // 判断从 window 取值还是从当前 fakeWindow 取值
        const actualTarget = keysWithGetters[key] ? window : key in target ? target : window;
        return actualTarget[key];
      }
    });
  }

  createFakeWindow() {
    const fakeWindow = {};
    const keysWithGetters = {};

    Object.getOwnPropertyNames(window)
      .filter((key) => {
        // 只要不可配置的的属性，这些不可配置属性也可以理解为原生属性（一般情况下）
        const descriptor = Object.getOwnPropertyDescriptor(window, key);
        return !descriptor?.configurable;
      })
      .forEach((key) => {
        // 复制 key-value
        fakeWindow[key] = window[key];
        // 同时记录这些 key
        keysWithGetters[key] = true;
      })

    return { fakeWindow, keysWithGetters };
  }

  active() {
    activeSandboxCount += 1;
  }

  inactive() {
    activeSandboxCount -= 1;
  }
}

module.exports = MultipleProxySandbox;
