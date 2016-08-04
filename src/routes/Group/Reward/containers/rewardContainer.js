import { connect } from 'react-redux'
import { fetchZen, clearZen } from '../modules/reward'

import RewardView from '../components/Reward'

const mapActionCreators = {
  fetchZen,
  clearZen
}

const mapStateToProps = (state) => ({
  reward: state.reward
})

export default connect(mapStateToProps, mapActionCreators)(RewardView)
