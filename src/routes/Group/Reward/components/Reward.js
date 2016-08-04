import React, {Component} from 'react'
import classes from './Reward.scss'
import TopTab from 'components/TopTab'

export default class ListView extends Component {

  render () {

    return (
      <div>
        <TopTab></TopTab>
        <h1>我的奖励</h1>
      </div>
    )
  }
}
