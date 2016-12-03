import React, {Component} from 'react'

export default class Elapse extends Component {

  componentDidMount() {
    this.interval = setInterval(this.props.plus, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const {elapse} = this.props
    return (

      <div>
  <h1>
        Seconds Elapsed: {elapse}
      </h1>
        <button onClick={this.props.clean}>componentWillUnmount</button>
      </div>
    )
  }
}

Elapse.propTypes = {
  elapse: React.PropTypes.number.isRequired,
  plus: React.PropTypes.func.isRequired
}
