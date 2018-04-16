import { createElement } from 'react';
import dynamic from 'dva/dynamic';
// import pathToRegexp from 'path-to-regexp';

let routerConfigCache;
/**
 * *
 * @description 通过自定义的module是否存在于命名空间，不存在就require让它存在于命名空间中
 * app._models就是所有的models  =>{effects, namespace, reducers, state, subscriptions}
 * 
 */
const modelNotExisted = (app, model) => 
  {
  	return (!app._models.some(({ namespace }) => {
    	return namespace === model.substring(model.lastIndexOf('/') + 1);
  	}))
  };

export const getRouterConfig = (app) => {
  const routerConfig = {
    '/': {
    	identity: 'root',
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/dashboard/analysis': {
    	identity: 'common',
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/monitor': {
    	identity: 'common',
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/dashboard/workplace': {
    	identity: 'common',
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
        import('../routes/Dashboard/Workplace')
      ),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // authority: 'admin',
    },
    '/form/basic-form': {
    	identity: 'common',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    },
    '/form/step-form': {
    	identity: 'common',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    },
    '/form/step-form/info': {
    	identity: 'common',
      name: '分步表单（填写转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    },
    '/form/step-form/confirm': {
    	identity: 'common',
      name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
    	identity: 'common',
      name: '分步表单（完成）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },
    '/form/advanced-form': {
    	identity: 'common',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    },
    '/list/table-list': {
    	identity: 'common',
      component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    },
    '/list/basic-list': {
    	identity: 'common',
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    },
    '/list/card-list': {
    	identity: 'common',
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    },
    '/list/search': {
    	identity: 'common',
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    },
    '/list/search/projects': {
    	identity: 'common',
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },
    '/list/search/applications': {
    	identity: 'common',
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
    	identity: 'common',
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    '/profile/basic': {
    	identity: 'common',
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    },
    '/profile/advanced': {
    	identity: 'common',
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/Profile/AdvancedProfile')
      ),
    },
    '/result/success': {
    	identity: 'common',
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
    	identity: 'common',
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
    	identity: 'common',
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
    	identity: 'common',
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
    	identity: 'common',
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
    	identity: 'common',
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    // demo
    '/demo/demo-one': {
	    component: dynamicWrapper(app, [], () =>
	       import('../routes/Demo/DemoOne')
	    ),
    },
    '/demo/demo-two': {
	    component: dynamicWrapper(app, [], () =>
	       import('../routes/Demo/DemoTwo')
	    ),
    },
    '/demo/demo-three': {
	    component: dynamicWrapper(app, [], () =>
	       import('../routes/Demo/DemoThree')
	    ),
    },
    '/user': {
    identity: 'common',
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
    	identity: 'common',
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
    	identity: 'common',
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
    	identity: 'common',
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
  };

	const { _store } = app;
  	_store.dispatch({
  		type: 'global/saveRouterConfig',
    	payload: routerConfig,
  	});

  return routerConfig;
};

// wrapper of dynamic
function dynamicWrapper(app, models, component) {
  // () => require('module')
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
    	// 动态设置请求，循环发送请求，如果没有请求就发送
      if (modelNotExisted(app, model)) {
        app.model(require(`../models/${model}`).default);
      }
    });
    // props => { history, location, match, staticContext }
    return (props) => {
      if (!routerConfigCache) {
        routerConfigCache = getRouterConfig(app);
      }
      return createElement(component().default, {
        ...props,
        routerConfig: routerConfigCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}`)
    ),
    // add routerData prop
    component: () => {
      if (!routerConfigCache) {
        routerConfigCache = getRouterConfig(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerConfig: routerConfigCache,
        });
      });
    },
  });
}