import { connect } from 'react-redux'
import { actions } from './../modules/elapse'

import Elapse from './../components/Elapse'

const mapDispatchtoProps = {
  ...actions
}

const mapStateToProps = (state) => ({
  elapse: state.elapse
})

export default connect(mapStateToProps, mapDispatchtoProps)(Elapse)
