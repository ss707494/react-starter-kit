/**
 * Created by Administrator on 12/6.
 */
import React, {Component} from 'react'

export default class Elapse extends Component {

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const {elapse = '123'} = this.props
    return (

      <div>
        <h1>
          Seconds Elapsed: {elapse}
        </h1>
        <button >componentWillUnmount</button>
      </div>
    )
  }
}

