import { isUrl } from '../utils/utils';
import pathToRegexp from 'path-to-regexp';

/* 格式化处理menuData中的所有path,如果children中没有authority，就用父级的覆盖 */
function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

/*将menuData里面的数据展开  =>类似于router里面的routerConfig */
export function getFlatMenuData(menusFormatterData) {
  let keys = {};
  menusFormatterData.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

/**
 * 将mune里面的menuData(name,authority)和routerConfig进行合并得出新的routerData
 * get {name, authority} form getMenuData()
 * return {name, authority, ...routerConfig}
 * 
 * @author 何方
 */
export const getRouterData = (routerConfig, menuData) => {
  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      identity: router.identity || menuItem.identity,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  
  return routerData;
};

export const getMenuData = (menuData) => formatter(menuData);
