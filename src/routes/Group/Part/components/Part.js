import React, {Component} from 'react'
import classes from './Part.scss'
import TopTabGroup from 'components/TopTab'

export default class PartView extends Component {
  render () {
    return (
      <div>
        <TopTabGroup />
        <h1>我的分成</h1>
      </div>
    )
  }
}
