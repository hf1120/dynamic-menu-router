import React, { Component } from 'react';
import { Button, Alert } from 'antd';

export default class DemoOne extends Component {
  /**
   * @description 验证是否有操作按钮的权限
   * @param {String} item 按钮
   */
  verifyAuthority = item => {
    const { actions } = this.props;
    return actions.indexOf(item) > -1;
  };

  render() {
    return (
      <div>
        <h3>demo-one</h3>
        <Alert message="以下是按钮权限展示，编辑没有权限" type="success" />
        {this.verifyAuthority('add') && <Button>添加</Button>}
        {this.verifyAuthority('edit') && <Button>编辑</Button>}
        {this.verifyAuthority('save') && <Button>保存</Button>}
      </div>
    );
  }
}
