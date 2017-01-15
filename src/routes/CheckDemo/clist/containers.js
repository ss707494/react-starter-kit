import React, {Component} from 'react'
import config from 'config'
import 'zepto'
import {browserHistory} from 'react-router'
import data from '../api.json'
import 'fly'
import CLi from '../components/CLi'
import { Link, withRouter } from 'react-router'


fly.config.router.disabled = false;
const goToDetail_2 = id => events => {
  // browserHistory.push(config.baseUrl('/activity/detail/' + id));
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

  }
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const props = this.props;
    const pListData = props.check.get('pListData')
    // const {name , pListData} = props.check.toJS()
    return (
      <div>
        {
          pListData.size && pListData.find(v => v.get('serviceTypeId')===props.params.id).get('children').toJS().map((e,i) => <CLi key={e.serviceTypeId} n={i} check={props.checkBox} {...e}/>)
        }
      </div>
    )
  }
}
let list = withRouter(List);
export {
  list as container
}
