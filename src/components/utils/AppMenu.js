import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import styles from '../../index.less';

const AppMenu = (WrappedComponent) => {
  @connect(state => ({
    global: state.global,
  }))
  class AppMenuInner extends Component {

    componentDidMount() {
      if (this.props.global.menus.length <= 0) {
        this.props.dispatch({
          type: 'global/fetchMenus'
        });
      }
    }

    render() {
      const menus = this.props.global.menus;
      const routerData = this.props.global.routerData;
      if (menus.length <= 0 ||　routerData.length <= 0) {
        return <Spin size="large" className={styles.globalSpin} />;
      } else {
        return <WrappedComponent {...this.props} menus={menus} routerData={routerData}/>;
      }
    }
  }

  return AppMenuInner;
};

export default AppMenu;