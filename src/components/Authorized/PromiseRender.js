import React from 'react';
import { Spin } from 'antd';

export default class PromiseRender extends React.PureComponent {
  state = {
    component: null,
  };
  componentDidMount() {
    this.setRenderComponent(this.props);
  }
  componentWillReceiveProps(nextProps) {
    // new Props enter
    this.setRenderComponent(nextProps);
  }
  // set render Component : ok or error
  setRenderComponent(props) {
    const ok = this.checkIsInstantiation(props.ok);
    const error = this.checkIsInstantiation(props.error);
    props.promise
      .then(() => {
        this.setState({
          component: ok,
        });
      })
      .catch(() => {
        this.setState({
          component: error,
        });
      });
  }
  // 确定传入组件是否已实例化。
  // AuthorizedRoute已经实例化
  // 已授权的呈现已经实例化，未实例化孩子。
  // 未实例化安全的
  checkIsInstantiation = target => {
    if (!React.isValidElement(target)) {
      return target;
    }
    return () => target;
  };
  render() {
    const Component = this.state.component;
    return Component ? (
      <Component {...this.props} />
    ) : (
      <div
        style={{
          width: '100%',
          height: '100%',
          margin: 'auto',
          paddingTop: 50,
          textAlign: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
}
