import { connect } from 'react-redux'
import { fetchZen, clearZen } from '../modules/withdraw'

import WithdrawView from '../components/Withdraw'

const mapActionCreators = {
  fetchZen,
  clearZen
}

const mapStateToProps = (state) => ({
  withdraw: state.withdraw
})

export default connect(mapStateToProps, mapActionCreators)(WithdrawView)
