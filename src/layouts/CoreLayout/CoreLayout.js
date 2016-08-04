import React, { Component } from 'react'
import './CoreLayout.scss'
import '../../styles/core.scss'

import { Menu, Breadcrumb, Icon } from 'antd'
import 'antd/dist/antd.css'

import { Link } from 'react-router'

class CoreLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapse: true
    }
  }

  onCollapseChange() {
    this.setState({
      collapse: !this.state.collapse
    })
  }

  render() {
    const collapse = this.state.collapse
    return (
      <div className={collapse ? "ant-layout-aside ant-layout-aside-collapse" : "ant-layout-aside"}>
        <aside className="ant-layout-sider">
          <div className="ant-layout-logo"></div>
          <Menu mode="inline" theme="dark" defaultSelectedKeys={['user']}>
            <Menu.Item key="user">
              <Link to='/'>
                <Icon type="user" /><span className="nav-text">导航一</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="setting">
              <Link to='/list'>
                <Icon type="setting" /><span className="nav-text">导航二</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="laptop">
              <Icon type="laptop" /><span className="nav-text">导航三</span>
            </Menu.Item>
            <Menu.Item key="notification">
              <Icon type="notification" /><span className="nav-text">导航四</span>
            </Menu.Item>
            <Menu.Item key="folder">
              <Icon type="folder" /><span className="nav-text">导航五</span>
            </Menu.Item>
          </Menu>
          <div className="ant-aside-action" onClick={this.onCollapseChange.bind(this)}>
            {collapse ? <Icon type="right" /> : <Icon type="left" />}
          </div>
        </aside>
        <div className="ant-layout-main">
          <div className="ant-layout-header">
            <div className="ant-title">童书馆管理中心</div>
          </div>
          <div className="ant-layout-container">
            <div className="ant-layout-content">
              <div>
                {this.props.children}
              </div>
            </div>
          </div>
          <div className="ant-layout-footer">
            Shenzhen Caldecott Cultural Communications Co.,Ltd.<br />
            © 2009-2016 深圳市凯迪克文化传播有限公司旗下 孩宝小镇 版权所有 <a href="http://www.miitbeian.gov.cn" target="_blank">粤ICP备12087424号-2</a>
          </div>
        </div>
      </div>
    );
  }
}

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default CoreLayout
