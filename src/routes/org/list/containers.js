import React, {Component} from 'react'
import config from 'config'
import './style.scss'
import {browserHistory} from 'react-router'

import SearchBox from './searchBox'
import ListItem from './components/listItem'

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

async function getData() {
  const _url = await fetch(config.baseApi('/organization/getList?fwlyIds=&label=0&community=&currentPageNo=1&pageSize=20'));
  return await _url.json();
}

class List extends Component {

  componentDidMount() {
    const data = getData();
    data.then(e => {
    });
    this.props.getListData();
  }

  componentWillUnmount() {
  }

  render() {
    const {name, listData, searchBoxData} = this.props.activity
      , changeNavName = this.props.changeNavName
    return (
      <div id="pullrefresh" className="floatfix ui-scroll-wrapper_">
        <header className="top">
          <span className="" id="back"> {'<'}</span>
          <section></section>
        </header>
        <SearchBox {...{...searchBoxData, changeNavName}} />
        <ListItem listData={listData}/>
      </div>
    )
  }
}

export {
  List as container
}

