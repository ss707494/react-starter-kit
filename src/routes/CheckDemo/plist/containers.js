import React, {Component} from 'react'
import config from 'config'
import 'zepto'
import {browserHistory} from 'react-router'
import data from '../api.json'
import 'fly'
import CLi from '../components/CLi'
import Head from '../components/Head'
import { Link, withRouter } from 'react-router'

fly.config.router.disabled = false;
const goToDetail_2 = id => events => {
  browserHistory.push(config.baseUrl('/CheckDemo/clist/' + id));
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const getListData = async initPList => {
  const dat = data
  await sleep(500);
  const res = await dat;
  initPList(res.data)
}

class List extends Component {

  constructor (props) {
    super(props)
  }

  componentWillMount() {
    const {initPList} = this.props
    !this.props.check.get('pListData').size && getListData(initPList);
  }
  componentDidMount() {
  }

  render() {
    const props = this.props;
    const {name , pListData, isall} = props.check.toJS()
    const nums = props.check.get('pListData').toJS();
    return (
      <div>
        <Head />
        <section>
          <CLi ischecked={isall} check={props.checkAllPBox}/>
        {
          nums.map((e,i) => <CLi key={i} n={i} goToDetail_2= {goToDetail_2(e.serviceTypeId)} check={props.checkBox.bind(this, ['pListData',i,'ischecked'])} {...e}/>)
        }
        </section>
      </div>
    )
  }
}

let list = withRouter(List);
export {
list as container
}

