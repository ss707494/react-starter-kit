

import React, {Component} from 'react'

export default class searchBox extends Component {

  render() {
    const {navList, showName, navStrs, changeNavName} = this.props
    const _select = navList.find(e=>e.value===showName);
    return <div className="search_box">
      <nav className="search_nav">
        {navList.map(e => (<li key={e.value} onClick={changeNavName.bind(this, e.value)}>{e.name}</li>))}
      </nav>
      {(_=>{
        if (_select) {
          return <section className="search_select">
            {_select.selectList.map(e=>(<li key={e.value}>{e.text}</li>))}
          </section>
        }
      })()}
    </div>
  }
}
