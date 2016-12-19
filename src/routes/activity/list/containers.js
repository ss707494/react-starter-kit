import React, {Component} from 'react'
import config from 'config'
import './active-list.css'
import 'zepto'
// import 'fly'
import {browserHistory} from 'react-router'

const initList = (listData) => {
  return (
    listData.map(e => (
      <div key={e.activityId} className="my-activitie-box floatfix" onClick={goToDetail_2(e.activityId)}>
        <div className="img">
          <img src={e.imgUrl} data-bind="attr: {src: imgUrl}" alt=""/>
          <span className="status"
                data-bind="text: status), css: $parent.statusColor(status)">{e.status}</span>
        </div>
        <div className="details">
          <h3 className="title" data-bind="text: title">{e.title}</h3>
          <div className="time-person floatfix">
            <i className="ui-icon icon-time"></i>
            <span className="time" data-bind="text: startTime">{e.startTime}</span>
            <span className="person">
              <i className="ui-icon icon-my"></i>
              <i data-bind="text: applyNo, css: {online: applyNo>demandNo}"></i>/<i
              data-bind="text: demandNo"></i>
            </span>
          </div>
          <span className="address-box floatfix">
            <i className="ui-icon icon-location"></i>
            <span className="address" data-bind="text: location">{e.location}</span>
          </span>
        </div>
      </div>
    ))
  )
}

const goToDetail_2 = id => events => {
  browserHistory.push(config.baseUrl('/activity/detail/' + id));
}

class List extends Component {

  componentDidMount() {
    fetch(config.baseApi('/activity/getList?currentPageNo=1&pageSize=20&orderType=1'))
      .then(data => data.json())
      .then(res => this.props.initList(res.rows || []))
    // $("#pullrefresh").pullRefresh({
    //   down: {
    //     callback: function() {
    //       // getList({isNew: true});
    //     }
    //   },
    //   up: {
    //     callback: function() {
    //       // var searchParam = viewModel.searchParam;
    //       // searchParam.currentPageNo(searchParam.currentPageNo() + 1);
    //       // getList({isAdd: true});
    //     }
    //   }
    // });
  }

  componentWillUnmount() {
  }

  render() {
    const {name , listData} = this.props.activity
    return (
    <div id="pullrefresh" className="floatfix ui-scroll-wrapper_">
        <div className="my-activities floatfix ui-scroll">{initList(listData)}</div>
    </div>
    )
  }
}

export {
  List as container
}

