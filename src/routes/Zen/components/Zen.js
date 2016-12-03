import React, {Component} from 'react'
import classes from './Zen.scss'
import Loader from 'halogen/ClipLoader'

const child = (item) => (
  <h1 key={item.id}>{item.text}</h1>
)

const showImg = ({id, images}) => {
  return (
    <img key={id} src={images.medium} alt=""/>
  )
}

export default class Zen extends Component {

  renderLoading () {
    return (this.props.zen.fetching)
      ? <div className={classes.loader}><Loader color='#26A65B' /></div>
      : ''
  }

  render () {
    const { fetchZen, clearZen, zen } = this.props
    const { fetching, text, listData = [] } = zen

    return (
      <div>
        <div>
          <button className='btn btn-default' onClick={fetchZen}>
            {fetching ? 'Fetching...' : 'Fetch'}
          </button>
          &nbsp;&nbsp;
          <button className='btn btn-default' onClick={clearZen}>Clear</button>
        </div>
        {this.renderLoading()}
        <div>
          {text.map(child)}
        </div>
        <div>
          {listData.map(showImg)}
        </div>
      </div>
    )
  }
}

Zen.propTypes = {
  zen: React.PropTypes.object.isRequired
}
