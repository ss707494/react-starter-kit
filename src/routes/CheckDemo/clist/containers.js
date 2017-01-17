import React, {Component} from 'react'
import config from 'config'
import 'zepto'
import {browserHistory} from 'react-router'
import data from '../api.json'
import 'fly'
import CLi from '../components/CLi'
import { Link, withRouter } from 'react-router'
import Head from '../components/Head'

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

function checkAll() {

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

  componentWillUnmount() {
  }

  render() {
    const props = this.props;
    const pListData = props.check.get('pListData')
    const pid = props.params.id;
    const _find = v => v.get('serviceTypeId')===pid
    const index = pListData.findIndex(_find);
    const cListData = pListData.getIn([index,'children']).toJS();
    return (
      <div>
        <Head />
        <section>
          <CLi ischecked={pListData.getIn([index,'isall'])} check={props.checkAllCBox.bind(null, index)} />
        {
          cListData && cListData.map((e, i) => <CLi key={e.serviceTypeId} n={i} goToDetail_2={props.checkBox.bind(this, ['pListData',index,'children',i,'ischecked'])} check={props.checkBox.bind(this, ['pListData',index,'children',i,'ischecked'])} {...e}/>)
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

