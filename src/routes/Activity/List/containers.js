import React, {Component} from 'react'
import config from 'config'

class List extends Component {

  componentDidMount() {
    this.props.dispatch
    fetch(config.baseApi('/activity/getList?currentPageNo=1&pageSize=20&orderType=1&fwly=&status=4%2C5%2C6'))
      .then(data => data.text())
      // .then(text => this.props.dispatch(this.props.initList(text)))

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
        <button>componentWillUnmount</button>
      </div>
    )
  }
}

export {
  List as container
}

