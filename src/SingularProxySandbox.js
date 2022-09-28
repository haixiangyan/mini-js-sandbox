class SingularProxySandbox {
  /** 沙箱期间新增的全局变量 */
  addedMap = new Map();
  /** 沙箱期间更新的全局变量 */
  originMap = new Map();
  /** 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做 snapshot */
  updatedMap = new Map();

  setWindowKeyValues(key, value, shouldDelete) {
    if (value === undefined || shouldDelete) {
      // 删除 key-value
      delete window[key];
    } else {
      window[key] = value;
    }
  }

  constructor() {
    const fakeWindow = Object.create(null);
    const { addedMap, originMap, updatedMap } = this;

    this.proxy = new Proxy(fakeWindow, {
      set(_, key, value) {
        // 记录以前的值
        const originValue = window[key];

        if (!window.hasOwnProperty(key)) {
          // 如果不存在，那么加入 addedMap（添加）
          addedMap.set(key, value);
        } else if (!originMap.has(key)) {
          // 如果当前 window 对象存在该属性，且 originMap 中未记录过，则记录该属性初始值（修改）
          originMap.set(key, originValue);
        }

        // 记录修改后的值
        updatedMap.set(key, value);

        // 修改值
        window[key] = value;
      },
      get(_, key) {
        return window[key];
      }
    });
  }

  active() {
    // 激活时，把上次微应用做更新/新增的 key-value 覆盖到 window 上
    this.updatedMap.forEach((value, key) => this.setWindowKeyValues(key, value));
  }

  inactive() {
    // 删除新增的 key-value
    this.addedMap.forEach((_, key) => this.setWindowKeyValues(key, undefined, true));
    // 覆盖上次全局变量的 key-value
    this.originMap.forEach((value, key) => this.setWindowKeyValues(key, value));
  }
}

module.exports = SingularProxySandbox;
