import React, {Component} from 'react'
import classes from './Reward.scss'
import TopTabGroup from 'components/TopTab'

export default class ListView extends Component {

  render () {

    return (
      <div>
        <TopTabGroup />
        <h1>我的奖励</h1>
      </div>
    )
  }
}
