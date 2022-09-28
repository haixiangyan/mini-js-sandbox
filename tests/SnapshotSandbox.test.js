const SnapshotSandbox = require('../src/SnapshotSandbox');

describe('SnapshotSandbox', () => {
  afterEach(() => {
    delete window.value;
  })

  it('可以激活环境', () => {
    const sandbox = new SnapshotSandbox();

    // 假设以前有一个旧值 value: 1
    sandbox.modifiedMap = {
      value: 1 // 旧值
    }

    // 需要恢复 value: 1 -> window
    sandbox.active();

    expect(window.value).toEqual(1);
  })

  it('可以在失活时记录环境', () => {
    const sandbox = new SnapshotSandbox();

    // 准备激活
    window.value = 321;
    sandbox.active();
    expect(sandbox.windowSnapshot.value).toEqual(321);

    // 准备失活
    window.value = 123;
    sandbox.inactive();
    expect(sandbox.modifiedMap.value).toEqual(123);
  })
});
