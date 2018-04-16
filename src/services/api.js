import { stringify } from 'qs';
import request from '../utils/request';
import  * as menuConfig from './../common/menu';

import { menuData } from './../../mock/menuData';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

/* 自定义 */
export async function getAuthMenus() {
	return new Promise(function (resolve) {
			resolve(menuConfig.getMenuData(menuData));
		});
}
/*export async function getAuthMenus() {
	return request('/api/menuData').then(function(datas){
		return new Promise(function (resolve) {
			resolve(menuConfig.getMenuData(datas));
		});
	});
}*/

export async function getRouterData(routerConfig, menuData) {
    const flatMenuData = menuConfig.getFlatMenuData(menuData);
    return menuConfig.getRouterData(routerConfig, flatMenuData);
}

export function getRouterDataSync(routerConfig, menuData) {
    const flatMenuData = menuConfig.getFlatMenuData(menuData);
    return menuConfig.getRouterData(routerConfig, flatMenuData);
}