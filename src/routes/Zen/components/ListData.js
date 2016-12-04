/**
 * Created by Administrator on 2016/12/4.
 */

import React, { Component } from 'react'

 class ListData extends Component {
  render(){
    const {listData = []} = this.props;
    const list_ = listData.map(e =>
      3
    )
    const map = listData.map(e => (
      <li>
        <img src={e.images.medium}/>
        <span>{e.title}</span>
      </li>
    ));

    return (
      <div>
        {map}
      </div>
    )
  }
}

export default ListData;

