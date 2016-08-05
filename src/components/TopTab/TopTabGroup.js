import React, {Component} from 'react'
import classes from './TopTab.scss'
import { Link } from 'react-router'

export default class TopTabGroup extends Component {
  render () {

    const conClass = [
      classes.con,
      'clearfix'
    ].join(' ')

    return (
      <div className={conClass}>
        <Link to='/group/reward' activeClassName={classes.active}>
          <div className={classes.tab}>我的奖励</div>
        </Link>
        <Link to='/group/part' activeClassName={classes.active}>
          <div className={classes.tab}>我的分成</div>
        </Link>
        <Link to='/group/withdraw' activeClassName={classes.active}>
          <div className={classes.tab}>我要提现</div>
        </Link>
      </div>
    )
  }
}
