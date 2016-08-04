import React, { Component } from 'react'
import '../../styles/core.scss'
import classes from './CoreLayout.scss'
import logoImg from './logo.png'

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
          <div className="ant-name-con">
            <div className="ant-layout-logo">
              <img src={logoImg} />
            </div>
            <span class="logo-name">
              <span className="logo-user">Alice...</span>童书馆
            </span>
          </div>
          <Menu mode="inline" theme="dark" defaultSelectedKeys={['user']}>
            <Menu.Item key="home">
              <Link to='/'>
                <Icon type="home" /><span className="nav-text">首页</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="tag">
              <Link to='/list' activeClassName='ant-menu-item-selected'>
                <Icon type="tag" /><span className="nav-text">团购</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="book">
              <i className="iconfont icon-book"></i><span className="nav-text">自定义书单</span>
            </Menu.Item>
            <Menu.Item key="notification">
              <Icon type="notification" /><span className="nav-text">童书</span>
            </Menu.Item>
            <Menu.Item key="text">
              <Icon type="file-text" /><span className="nav-text">订单</span>
            </Menu.Item>
            <Menu.Item key="reward">
              <Icon type="pay-circle" /><span className="nav-text">奖励</span>
            </Menu.Item>
            <Menu.Item key="team">
              <Icon type="team" /><span className="nav-text">推广伙伴</span>
            </Menu.Item>
            <Menu.Item key="family">
              <Icon type="file-text" /><span className="nav-text">阅读家庭</span>
            </Menu.Item>
            <Menu.Item key="chart">
              <Icon type="file-text" /><span className="nav-text">统计</span>
            </Menu.Item>
            <Menu.Item key="setting">
              <Icon type="setting" /><span className="nav-text">设置</span>
            </Menu.Item>
          </Menu>
          <div className={classes.service}>在线客服</div>
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
