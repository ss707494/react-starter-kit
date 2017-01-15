import React, {Component} from 'react'
import config from 'config'

class Detail extends Component {

  componentDidMount() {
    const {routeParams, initData} = this.props;
    debugger
    fetch(config.baseApi('/activity/getDetails?activityId='+ routeParams.id))
      .then(data => data.json())
      .then(res => {
        initData(res.data || [])
      })
    ;
  }

  componentWillUnmount() {
  }

  render() {
    const {detail} = this.props
    const {data:d} = detail
    return (
      <div className="wrap" id="pullrefresh" data-bind="visible: showContent">
        <div className="" data-bind="with: detailsData">
          <div className="information floatfix">
            <div className="img">
              <img src={d.imgUrl} data-bind="attr: {src: imgUrl}"/>
                    <span className="status tag-blue"
                          data-bind="text: $parent.statusStr(status), css: $parent.statusColor"></span>
            </div>
            <div className="details">
              <h3 className="title" data-bind="text: title"></h3>
              <div className="tag" data-bind="foreach: fwlys">
                        <span className="tag-item tag-red"
                              data-bind="text: fwlyName, style: {backgroundColor: '#'+color}"></span>
              </div>
              <div className="qrcode floatfix">
                <img data-bind="visible: $parent.volunteerId == $parent.detailsData().activityLeaderId,attr: {src: QRcodeUrl},
                            click: $parent.alertQrcode"/>
              </div>
              <span className="address"><i className="ui-icon icon-location"></i><i data-bind="text: location"></i></span>
              <span className="people"><i className="ui-icon icon-my"></i><i data-bind="text: applyNo"></i>/<span
                data-bind="text: demandNo"></span></span>
              {/*<!-- ko if: integralType == 1 -->*/}
              {/*<span className="integral"><i data-bind="text: integralRule"></i>分/小时</span>*/}
              {/*<!-- /ko -->*/}
              {/*<!-- ko if: integralType == 2 -->*/}
              {/*<span className="integral"><i className="ui-icon icon-zhuanguijifen"></i><i*/}
                {/*data-bind="text: integralRule"></i>分</span>*/}
              {/*<!-- /ko -->*/}
              <span data-bind="visible: $parent.signUpStatus() == 2" className="success"><i className="ui-icon icon-roundcheck"></i><i data-bind="text: '报名成功'"></i></span>
              <span data-bind="visible: $parent.signUpStatus() == 1" className="joining"><i className="ui-icon icon-info"></i><i data-bind="text: '报名审核中'"></i></span>
            </div>
          </div>
          <div className="main">
            <ul className="activite-list">
              <a data-bind="attr: {href: personnelNumber>0 ? CONTEXTPATH + '/active/active-person?activityId=' + activityId + '&activityLeaderId=' + $parent.detailsData().activityLeaderId + '&status=' + $parent.detailsData().status: 'javascript:void(0);'}">
                <li>活动人员(<i data-bind="text: personnelNumber"></i>)<span className="ui-icon icon-right"></span></li>
              </a>
              <a href="javascript:void(0);" data-bind="visible: $parent.hasLog,
                    attr: {href: logNumber>0 ? CONTEXTPATH + '/active/active-diary?activityId=' + activityId : 'javascript:void(0);'}">
                <li data-bind=""> 活动日志(<i data-bind="text: logNumber"></i>) <span
                  className="ui-icon icon-right"></span></li>
              </a>
              <li><a href="javascript:void(0);">承办组织</a><span data-bind="text: orgName"></span></li>
              {/*<li><a href="javascript:void(0);">活动时间</a><span id="time" className="time"><span><!-- ko text: startTime -->*/}
                {/*<!-- /ko --> 至 <!-- ko text: endTime --><!-- /ko --></span></span></li>*/}
              <li><a href="javascript:void(0);">预计时长</a><span data-bind="text: expectTime"></span></li>
              <li><a href="javascript:void(0);">现场负责人</a><span><i data-bind="text: activityLeader"></i>(<i
                data-bind="text: !_userId_? '实名认证后显示联系方式': activityLeaderPhone"></i>)</span></li>
            </ul>
          </div>
          <div className="join">
            <ul className="activite-list">
              <li>活动介绍</li>
              <li className="introduce floatfix" data-bind="html: introduce"></li>
            </ul>
            <a data-bind="text: $parent.getSignStr,
                visible: $parent.showCancleBtn() == 1 && status != 6 && $parent.volunteerId != $parent.detailsData().activityLeaderId, click: $parent.signEvent()"></a>
            <div className="think-div" data-bind="visible: $parent.showCancleBtn() == 2">
              <a className="think" data-bind="text: '我再想想', click: function(){$parent.showCancleBtn(1);}"></a>
              <a className="cancle-btn" data-bind="text: $parent.getSignStr,
                 click: $parent.cancleSIgnEvent"></a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export {
  Detail as container
}

