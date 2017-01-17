/**
 * Created by Administrator on 1/17.
 */
import React, {Component} from 'react'
import './style.scss'
import {browserHistory} from 'react-router'

function goBack() {
  window.history.go(-1);
}

export default class Head extends Component {

  render() {
    const e = this.props
    return (
      <header className="head">
        <section onClick={goBack}>返回</section>
        <section>确定</section>
      </header>
    )
  }
}

Head.propTypes = {
}
Head.defaultProps = {
  // goToDetail_2(){return _=>console.log('goTo')},

}

