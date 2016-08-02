import React, {Component} from 'react'
import DuckImage from '../assets/Duck.jpg'
import classes from './HomeView.scss'
import flatpickr from 'flatpickr'
import css from 'flatpickr/dist/flatpickr.min.css'

export default class HomeView extends Component {

  componentDidMount() {
    flatpickr(document.getElementById("time"))
  }

  render () {
    return (
      <div>
        <h4>Welcome!</h4>
        <img
          alt='This is a duck, because Redux!'
          className={classes.duck}
          src={DuckImage} />
        <input id="time" />
        <h1>123</h1>
      </div>
    )
  }
}
