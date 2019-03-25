// use localStorage to store the authority info, which might be sent from server in actual project.
import store from '../index';

/**
 * 获取token
 */
export function getAuthority() {
  const token = getToken();
  // 判断token是否过期
  if (!token) {
    return null;
  }
  const nowTime = new Date() - 0;
  if (token.expireIn > nowTime) {
    return token.token;
  }
  return null;
}

export function setToken(token) {
  return localStorage.setItem('security.token', JSON.stringify(token));
}

export function getToken() {
  const tokenStr = localStorage.getItem('security.token');
  if (!tokenStr) {
    return null;
  }

  const token = JSON.parse(tokenStr);
  return token;
}

export function setTokenExpired() {
  localStorage.removeItem('security.token');
}

/**
 * 判断是否有权限
 * @param {string} [authorityIdentity]
 */
export function hasPermission(authorityIdentity) {
  // 通用页面直接允许通过
  if (authorityIdentity === 'common') {
    return true;
  }

  const token = getAuthority();
  if (!authorityIdentity || !token) {
    return false;
  }

  const rootIdentity = 'root';
  // 已登录且是首页
  if (authorityIdentity === rootIdentity && token) {
    return true;
  }

  if (!store) {
    return false;
  }

  // 从redux中获取菜单
  const {
    global: { menus },
  } = store.getState();
  if (!menus || menus.length <= 0) {
    return false;
  }
  return checkAuth(authorityIdentity, menus);
}

function checkAuth(identity, menus) {
  if (!menus || menus.length <= 0) {
    return false;
  }
  let result = false;
  for (let i = 0; i < menus.length; i += 1) {
    const menu = menus[i];
    if (identity === menu.identity) {
      return true;
    }
    if (menu.children && menu.children.length) {
      result = checkAuth(identity, menu.children);
      if (result) {
        return true;
      }
    }
  }

  return false;
}
