// use localStorage to store the authority info, which might be sent from server in actual project.
import store from '../index';

/* 没有登录时guest, 登录是用户名 */
export function getAuthority() {
	return localStorage.getItem('antd-pro-authority') || 'admin';
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', authority);
}

/**
 * 判断是否有权限
 * @param {string} [authorityIdentity] 
 */
export function hasPermission(authorityIdentity) {
  // 通用页面直接允许通过
  if (authorityIdentity === 'common') { return true; }

  let token = getAuthority();
  if (!authorityIdentity || !token) { return false; }

  const rootIdentity = 'root';
  // 已登录且是首页
  if (authorityIdentity === rootIdentity && token) {
    return true;
  }

  if (!store) { return false; }

  // 从redux中获取菜单
  var menus = store.getState().global.menus;
  if (!menus || menus.length <= 0) {
    return false;
  }
  return checkAuth(authorityIdentity, menus);
}

function checkAuth(identity, menus) {
  if (!menus || menus.length <= 0) { return false; }
  let result = false;
  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i];
    if (identity === menu.identity) { return true; }
    if (menu.children && menu.children.length) {
      result = checkAuth(identity, menu.children);
      if (result) { return true; }
    }
  }

  return false;
}