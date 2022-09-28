const SnapshotSandbox = require('../src/SnapshotSandbox');

describe('SnapshotSandbox', () => {
  afterEach(() => {
    delete window.value;
  })

  it('激活时可以恢复微应用环境', () => {
    const sandbox = new SnapshotSandbox();

    // 假设以前有一个旧值 value: 1
    sandbox.modifiedMap = {
      value: 1 // 旧值
    }

    // 需要恢复 value: 1 -> window
    sandbox.active();

    expect(sandbox.proxy.value).toEqual(1);
  })

  it('失活时可以恢复以前 window 的环境', () => {
    const sandbox = new SnapshotSandbox();

    // 准备激活
    sandbox.proxy.value = 321;
    sandbox.active();
    expect(sandbox.windowSnapshot.value).toEqual(321);

    // 准备失活
    sandbox.proxy.value = 123;
    sandbox.inactive();
    expect(sandbox.modifiedMap.value).toEqual(123);
  })
});
