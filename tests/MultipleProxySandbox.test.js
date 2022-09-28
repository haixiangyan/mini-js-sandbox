const MultipleProxySandbox = require('../src/MultipleProxySandbox');

describe('MultipleProxySandbox', () => {
  it('不会修改非原生属性', () => {
    window.a = 1;

    const sandbox = new MultipleProxySandbox();

    sandbox.active();
    sandbox.proxy.a = 2;

    expect(window.a).toEqual(1);

    sandbox.inactive();
  })
});
