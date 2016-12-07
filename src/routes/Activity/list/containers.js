import React, {Component} from 'react'
import config from 'config'
import './active-list.css'
// require('zepto')
// require('fly')
import 'zepto'
import 'fly'


const initList = listData => {
  return (
    listData.map(e => (
      <div key={e.activityId} className="my-activitie-box floatfix">
        <div className="img">
          <img src={e.imgUrl} data-bind="attr: {src: imgUrl}" alt=""/>
          <span className="status"
                data-bind="text: $parent.getStatusStrObj(status), css: $parent.statusColor(status)"></span>
        </div>
        <div className="details">
          <h3 className="title" data-bind="text: title"></h3>
          <div className="time-person floatfix">
            <i className="ui-icon icon-time"></i>
            <span className="time" data-bind="text: startTime"></span>
            <span className="person">
              <i className="ui-icon icon-my"></i>
              <i data-bind="text: applyNo, css: {online: applyNo>demandNo}"></i>/<i
              data-bind="text: demandNo"></i>
            </span>
          </div>
          <span className="address-box floatfix">
            <i className="ui-icon icon-location"></i>
            <span className="address" data-bind="text: location"></span>
          </span>
        </div>
      </div>
    ))
  )
}

class List extends Component {

  componentDidMount() {
    fetch(config.baseApi('/activity/getList?currentPageNo=1&pageSize=20&orderType=1&fwly=&status=4%2C5%2C6'))
      .then(data => data.json())
      .then(res => this.props.initList(res.rows || []))
    $("#pullrefresh").pullRefresh({
      down: {
        callback: function() {
          // getList({isNew: true});
        }
      },
      up: {
        callback: function() {
          // var searchParam = viewModel.searchParam;
          // searchParam.currentPageNo(searchParam.currentPageNo() + 1);
          // getList({isAdd: true});
        }
      }
    });
  }

  componentWillUnmount() {
  }

  render() {
    const {name , listData} = this.props.activity
    return (
    <div id="pullrefresh" className="floatfix ui-scroll-wrapper">
        <div className="my-activities floatfix ui-scroll">{initList(listData)}</div>
    </div>
    )
  }
}

export {
  List as container
}

