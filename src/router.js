import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterConfig } from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';
import { hasPermission } from './utils/authority';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerConfig = getRouterConfig(app);
  const UserLayout = routerConfig['/user'].component;
  const BasicLayout = routerConfig['/'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            authority={() => hasPermission('root')}
            redirectPath="/user/login"
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
