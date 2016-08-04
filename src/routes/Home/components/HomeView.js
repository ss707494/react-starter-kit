import React, {Component} from 'react'
import DuckImage from '../assets/Duck.jpg'
import classes from './HomeView.scss'

export default class HomeView extends Component {

  render () {
    return (
      <div>
        <h1 className={classes.center}>Welcome!</h1>
        <img
          title='This is a duck, because Redux!'
          class={classes.duck}
          src={DuckImage} />
      </div>
    )
  }
}
