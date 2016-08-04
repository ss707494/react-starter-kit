import { connect } from 'react-redux'
import { fetchZen, clearZen } from '../modules/listView'

import ListView from '../components/ListView'

const mapActionCreators = {
  fetchZen,
  clearZen
}

const mapStateToProps = (state) => ({
  list: state.list
})

export default connect(mapStateToProps, mapActionCreators)(ListView)
