import React, {Component} from 'react'
import Carousel from 'nuka-carousel'
import DuckImage from '../assets/Duck.jpg'
import classes from './HomeView.scss'

export default class HomeView extends Component {
  render () {
    return (
      <div>
        <h4>Welcome!</h4>
        <img
          alt='This is a duck, because Redux!'
          className={classes.duck}
          src={DuckImage} />
        <Carousel
          edgeEasing='easeInSine'
        >
          <img src="http://placehold.it/1000x400/cccccc/c0392b/&text=slide1"/>
          <img src="http://placehold.it/1000x400/aaaaaa/c0392b/&text=slide2"/>
          <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide3"/>
          <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide4"/>
          <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide5"/>
          <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide6"/>
        </Carousel>
      </div>
    )
  }
}
