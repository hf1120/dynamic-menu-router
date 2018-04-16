import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { getRouterDataSync } from './../../services/api.js';

const AppNoMenu = (WrappedComponent) => {

  @connect(state => ({
    global: state.global,
  }))
  class AppMenuInner extends Component {

    render() {
      const routerData = getRouterDataSync(this.props.global.routerConfig, []);
      if (!routerData || routerData.length <= 0) {
        return <Spin spinning={true}/>;
      } else {
        return <WrappedComponent {...this.props} routerData={routerData}/>;
      }
    }
  }

  return AppMenuInner;
};

export default AppNoMenu;