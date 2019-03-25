import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import styles from '../../index.less';

const AppMenu = WrappedComponent => {
  @connect(state => ({
    global: state.global,
  }))
  class AppMenuInner extends Component {
    componentDidMount() {
      const {
        global: { menus },
        dispatch,
      } = this.props;
      if (menus.length <= 0) {
        dispatch({
          type: 'global/fetchMenus',
        });
      }
    }

    render() {
      const {
        global: { menus, routerData },
      } = this.props;
      if (menus.length <= 0 || routerData.length <= 0) {
        return <Spin size="large" className={styles.globalSpin} />;
      } else {
        return <WrappedComponent {...this.props} menus={menus} routerData={routerData} />;
      }
    }
  }

  return AppMenuInner;
};

export default AppMenu;
