const SingularProxySandbox = require('../src/SingularProxySandbox');

describe('SingularProxySandbox', () => {
  afterEach(() => {
    delete window.fixedValue;
    delete window.addedValue;
  })

  it('激活时可以正确记录对应的值', () => {
    window.fixedValue = '原始值';

    const sandbox = new SingularProxySandbox();

    sandbox.active();

    sandbox.proxy.fixedValue = '修改了';
    sandbox.proxy.addedValue = '新增的值';

    expect(sandbox.originMap.get('fixedValue')).toEqual('原始值');
    expect(sandbox.updatedMap.get('fixedValue')).toEqual('修改了');
    expect(sandbox.addedMap.get('addedValue')).toEqual('新增的值');

    sandbox.inactive();
  })

  it('激活时可以恢复微应用环境', () => {
    const sandbox = new SingularProxySandbox();

    // 模拟上一次微应用存的值
    sandbox.updatedMap.set('addedValue', 'added');
    sandbox.updatedMap.set('fixedValue', 'fixed');

    sandbox.active();

    // 检查 window 是否有对应的 key-value
    expect(window.addedValue).toEqual('added');
    expect(window.fixedValue).toEqual('fixed');

    // 检查 proxy 是否也有对应的 key-value
    expect(sandbox.proxy.addedValue).toEqual('added');
    expect(sandbox.proxy.fixedValue).toEqual('fixed');

    sandbox.inactive();
  })

  it('失活时会恢复原来的 window 环境', () => {
    // 原来 window 的环境
    window.fixedValue = '原始值';

    const sandbox = new SingularProxySandbox();

    sandbox.active();

    // 微应用环境下新增的 addedValue
    sandbox.proxy.addedValue = '新增的值';
    // 微应用修改了 fixedValue
    sandbox.proxy.fixedValue = '修改了';

    sandbox.inactive();

    expect(window.addedValue).toBeUndefined();
    expect(window.fixedValue).toEqual('原始值');
  })
});
