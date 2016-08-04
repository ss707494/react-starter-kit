import React, {Component} from 'react'
import classes from './Part.scss'
import TopTab from 'components/TopTab'

export default class PartView extends Component {

  render () {

    return (
      <div>
        <TopTab></TopTab>
        <h1>我的分成</h1>
      </div>
    )
  }
}
