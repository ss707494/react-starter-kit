import { connect } from 'react-redux'
import { changeType, fetchData } from '../modules/withdraw'

import WithdrawView from '../components/Withdraw'

const mapActionCreators = {
  changeType,
  fetchData
}

const mapStateToProps = (state) => ({
  withdraw: state.withdraw
})

export default connect(mapStateToProps, mapActionCreators)(WithdrawView)
