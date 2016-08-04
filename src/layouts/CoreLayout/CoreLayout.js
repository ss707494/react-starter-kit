import React, { Component } from 'react'
import '../../styles/core.scss'
import classes from './CoreLayout.scss'
import logoImg from './logo.png'
import headImg from './head.png'

import { Menu, Breadcrumb, Icon } from 'antd'
import 'antd/dist/antd.css'

import { IndexLink, Link } from 'react-router'

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
          <div className="ant-menu ant-menu-inline ant-menu-dark ant-menu-root">
            <IndexLink to='/' className="ant-menu-item" activeClassName='ant-menu-item-selected'>
              <i className="anticon anticon-home"/><span class="nav-text">首页</span>
            </IndexLink>
            <Link to='/list' className="ant-menu-item" activeClassName='ant-menu-item-selected'>
              <i className="anticon anticon-tag"/><span class="nav-text">团购</span>
            </Link>
            <Link to='/a' className="ant-menu-item" activeClassName='ant-menu-item-selected'>
              <i className="iconfont icon-logo"/><span class="nav-text">自定义书单</span>
            </Link>
            <Link to='/a' className="ant-menu-item" activeClassName='ant-menu-item-selected'>
              <i className="iconfont icon-book"/><span class="nav-text">童书</span>
            </Link>
            <Link to='/a' className="ant-menu-item" activeClassName='ant-menu-item-selected'>
              <i className="anticon anticon-file-text"/><span class="nav-text">订单</span>
            </Link>
            <Link to='/a' className="ant-menu-item" activeClassName='ant-menu-item-selected'>
              <i className="anticon anticon-pay-circle"/><span class="nav-text">奖励</span>
            </Link>
            <Link to='/a' className="ant-menu-item" activeClassName='ant-menu-item-selected'>
              <i className="anticon anticon-team"/><span class="nav-text">推广伙伴</span>
            </Link>
            <Link to='/a' className="ant-menu-item" activeClassName='ant-menu-item-selected'>
              <i className="iconfont icon-family"/><span class="nav-text">阅读家庭</span>
            </Link>
            <Link to='/a' className="ant-menu-item" activeClassName='ant-menu-item-selected'>
              <i className="anticon anticon-line-chart"/><span class="nav-text">统计</span>
            </Link>
            <Link to='/a' className="ant-menu-item" activeClassName='ant-menu-item-selected'>
              <i className="anticon anticon-setting"/><span class="nav-text">设置</span>
            </Link>
          </div>
          <div className={classes.service}>在线客服</div>
          <div className="ant-aside-action" onClick={this.onCollapseChange.bind(this)}>
            {collapse ? <Icon type="right" /> : <Icon type="left" />}
          </div>
        </aside>
        <div className="ant-layout-main">
          <div className="ant-layout-header clearfix">
            <div class={classes.header_left}>
              <div className="ant-title">童书馆管理中心</div>
              <div className={classes.spa}></div>
              <div className={classes.header_qr}>
                <i className="iconfont icon-qr"/>
              </div>
            </div>
            <div className={classes.header_right}>
              <div className={classes.header_icon}>
                <i className="iconfont icon-notifications"/>
                <span>2</span>
              </div>
              <div className={classes.header_icon}>
                <i className="iconfont icon-visibility"/>
              </div>
              <div className={classes.header_icon}>
                <i className="iconfont icon-reply"/>
              </div>
              <div className={classes.user_con}>
                <div className={classes.header_name}>Hi,  Alice</div>
                <img className={classes.header_img} src={headImg}/>
                <Icon type="down" className={classes.header_down} />
              </div>
            </div>
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
