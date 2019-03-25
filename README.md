## dynamic-menu-router

ant design pro动态路由权限，目前基于ant design pro1.4.4版本，只用于左侧菜单权限的设置，后续会有按钮权限的设置，以及最新版本权限的更新，敬请留意。

## 对common中menu.js和router.js的拆分和组合(具体细节请参考代码)。

  1.将menu.js中的menuData提取出去，暂时放在mock数据中（menuData.js），因为这些数据要用真实的接口来获取。

  2.在router.js中getRouterConfig的底部增加以下代码。目的是将routerConfig对象通过reducer传入到models/global中备用。
  
---
  // eslint-disable-next-line
  app._store.dispatch({
    type: 'global/saveRouterConfig',
    payload: routerConfig,
  });
---

  3.将router.js中getFlatMenuData方法提取到menu.js中(getFlatMenuData:将数据处理为以路径为键的数据)。

  4.将router.js中routerConfig和menuData进行合并处理的函数提取到menu.js中，变为getRouterData(getRouterData:将routerConfig和menuData进行合并)。

  5.在models/global.js中的effects中加入fetchMenus（用于获取最终处理好的路由），在reducers中加入saveRouterConfig（用于将router.js中getRouterConfig放到reduce中）。

  6.在components/utils中加入AppMenu高阶组件，用于获取最终的路由列表。

  ## 权限校验
    重写utils/authority，这个主要用于权限的校验。
