import React, {Component} from 'react'
import './style.scss'

export default class CLi extends Component {

  render() {
    const e = this.props
    return (
      <li className="box-li" >
        <span className="box-name" onClick={e.goToDetail_2(e.serviceTypeId)} >{e.serviceTypeName}</span>
        <span className="box-nu" onClick={e.check}>
          {e.num?e.num:''}
        <input type="checkbox" className="ui-checkbox" checked={e.ischecked} readOnly="readOnly"/>
          <icon className="box-right"> >  </icon>
        </span>
      </li>
    )
  }
}

CLi.propTypes = {
}
CLi.defaultProps = {
  goToDetail_2(){return _=>console.log('goTo')},
  check(){},
  serviceTypeName: '全部',

}

