import { connect } from 'react-redux'
import { fetchZen, clearZen } from '../modules/part'

import PartView from '../components/Part'

const mapActionCreators = {
  fetchZen,
  clearZen
}

const mapStateToProps = (state) => ({
  reward: state.reward
})

export default connect(mapStateToProps, mapActionCreators)(PartView)
