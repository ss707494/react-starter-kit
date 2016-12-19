import React, {Component} from 'react'
import config from 'config'
// import './active-list.css'
import 'zepto'
// import 'fly'
import {browserHistory} from 'react-router'
import './box.css'

const styles = {
  box: {
    display: 'flex',
  },
  boxdiv: {
    flex: 'auto',
    maxHeight: '10rem',
    overflow: 'auto'
  },
  boxli: {
    margin: '1px',
    background: '#cce8cf',
  }
};

class ListData extends Component {
  render() {
    const {listData1, changeTitle, style, num} = this.props
    return <div style={style}>
      {listData1.map(e => (
        <li style={styles.boxli} key={num + e.value} onClick={changeTitle.bind(this, num)}>{e.text}</li>))}
    </div>
  }
}

const showList = _ => {
  return [1, 2, 3].map(e => (
    <ListData {...this.props.activity} changeTitle={this.props.changeTitle} style={this.getLiStyle(e)}
              num={numList[e]}/>
  ))
}


class List extends Component {

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  getLiStyle = n => {
    return this.props.activity.showTitle >= n
      ? styles.boxdiv
      : {visibility: 'hidden', flex: 'auto'}
  }

  render() {
    const {name, listData1} = this.props.activity
    const numList = [0, 2, 3, 1]
    const secName0 = 'flex flex--col flex--reverse'
    const secName = ''
    return (
      <div>
        <h1>test flex</h1>
        <main className={secName0}>
          <section className={secName}>123</section>
          <section className={secName}>456</section>
          <section className={secName}>789</section>
        </main>
      </div>
    )
  }
}

export {
  List as container
}

