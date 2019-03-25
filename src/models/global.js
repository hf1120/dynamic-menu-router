import { queryNotices, getAuthMenus, getRouterData } from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    // 存储菜单数据(全局缓存)
    menus: [],
    // 存储路由数据(全局缓存)
    routerData: [],
  },

  effects: {
    *fetchMenus(_, { call, put, select }) {
      // 增加
      const menus = yield call(getAuthMenus);
      const routerConfig = yield select(state => state.global.routerConfig);
      const routerData = yield call(getRouterData, routerConfig, menus);
      yield put({
        type: 'saveMenus',
        payload: menus,
      });

      yield put({
        type: 'saveRouterData',
        payload: routerData,
      });
    },
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    saveMenus(state, { payload }) {
      return {
        ...state,
        menus: payload,
      };
    },
    saveRouterConfig(state, { payload }) {
      return {
        ...state,
        routerConfig: payload,
      };
    },
    saveRouterData(state, { payload }) {
      return {
        ...state,
        routerData: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
