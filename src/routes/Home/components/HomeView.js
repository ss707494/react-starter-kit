import React from 'react'
import DuckImage from '../assets/Duck.jpg'
import './HomeView.scss'
import {IndexLink, Link} from 'react-router'
import config from 'config'

export class HomeView extends React.Component {

  static propTypes: {
  }

  constructor(props) {
    super(props);
    this.state = {
      url: ''
    }
  }

  urlChange = (event) => {
    this.setState({url: event.target.value})
  }

  render() {
    return <div className="box">
      <h4>Welcome!</h4>
      <Link to={config.baseUrl('/todoDemo')} >todoDemo</Link>
      <h2>{this.state.url}</h2>
      <input type="text" onChange={this.urlChange.bind(this)}/>
      <Link to={config.baseUrl('/'+this.state.url)} activeClassName='route--active'>
        <img
          alt='This is a duck, because Redux!'
          className='duck'
          src={DuckImage}/>
      </Link>
    </div>
  }
}

export default HomeView
