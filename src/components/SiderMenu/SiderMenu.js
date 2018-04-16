import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { Link } from 'dva/router';
import styles from './index.less';
import { urlToList } from '../utils/pathTools';

const { Sider } = Layout;
const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};
/**
 * @description 验证path是否在flatMenuKeys中
 * @param {Attay} flatMenuKeys
 * @param {String} path
 */
export const getMeunMatcheys = (flatMenuKeys, path) => {
  return flatMenuKeys.filter((item) => {
    return pathToRegexp(item).test(path);
  });
};

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = props.menuData;
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
    /**
     * openKeys:[/list, /list/search] 当前展开的数组父级
     */
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }
  componentWillReceiveProps(nextProps) {
  	/* 第一个是当前的地址，第二个是从哪里过来的地址 */
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps),
      });
    }
  }
  /**
   * openkeys转换路径名
   * /list/search/articles = > ['list','/list/search']
   * @param  props
   */
  getDefaultCollapsedSubMenus(props) {
    const { location: { pathname } } = props || this.props;
    return urlToList(pathname)
      .map((item) => {
        return getMeunMatcheys(this.flatMenuKeys, item)[0];
      })
      .filter(item => item);
  }
  /**
   * 获取所有的path放在一个数组中
   * [{path:'/list'},{path:'/list/search'}] => {'/list','/list/search'}
   * @param  menus
   */
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach((item) => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }
  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = (item) => {
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
        onClick={
          this.props.isMobile
            ? () => {
                this.props.onCollapse(true);
              }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };
  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item) => {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children);
      // 当无子菜单时就不展示菜单
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span>{item.name}</span>
                </span>
              ) : (
                  item.name
                )
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    } else {
      return (
        <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>
      );
    }
  };
  /**
   * @description 获取菜单节点并排列
   * @param {Array} menusData   =>menuData
   */
  getNavMenuItems = (menusData) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map((item) => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };
  /* 获取当前选定的菜单  =>[/a, /a/b, /a/b/c, ...] */
  getSelectedMenuKeys = () => {
    const { location: { pathname } } = this.props;
    return urlToList(pathname).map(itemPath =>
      {
      	return getMeunMatcheys(this.flatMenuKeys, itemPath).pop();
      }
    );
  };
  // conversion Path
  // 转化路径
  conversionPath = (path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  };
  /* 检查数据过滤掉带有authority的导航 */
  checkPermissionItem = (authority, ItemDom) => {
    if (this.props.Authorized && this.props.Authorized.check) {
      const { check } = this.props.Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };
  /**
   * @description 判断链接是否在mainMenu中
   * @param {String} key   => '/list'
   */
  isMainMenu = (key) => {
    return this.menus.some(
      item =>
        key && (item.key === key || item.path === key),
    );
  }
  /**
   * @description SubMenu 展开/关闭的回调 如果有多个元素在mainMenu中，则就选择刚打开的那个mainMenu
   * @param {Array} openKeys 如果是二级菜单 =>['/list', '/list/search'] Submenu切换时： =>['/list','/form']
   */
  handleOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
    });
  };
  render() {
    const { logo, collapsed, onCollapse } = this.props;
    const { openKeys } = this.state;
    // 菜单栏折叠时不要显示弹出菜单
    const menuProps = collapsed
      ? {}
      : {
        openKeys,
      };
    // 如果路径不匹配，使用最近的父级的key
    let selectedKeys = this.getSelectedMenuKeys();
    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    return (
      <Sider
        trigger={null}
        collapsible // 是否可收起
        collapsed={collapsed} // 当前可收起的状态
        breakpoint="lg"
        onCollapse={onCollapse}  // 展开-收起时的回调函数，有点击 trigger 以及响应式反馈两种方式可以触发
        width={256}
        className={styles.sider}
      >
        <div className={styles.logo} key="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>Ant Design Pro</h1>
          </Link>
        </div>
        <Menu
          key="Menu"
          theme="dark"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleOpenChange} // 展开/关闭的回调
          selectedKeys={selectedKeys} // 当前选中的菜单项 key 数组
          style={{ padding: '16px 0', width: '100%' }}
        >
          {this.getNavMenuItems(this.menus)}
        </Menu>
      </Sider>
    );
  }
}
