import { injectReducer } from '../../store/reducers'
import ZenRoute from '../Zen'

export default (store) => ({
  path: 'list/withdraw',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const List = require('./containers/ListViewContainer').default
      const reducer = require('./modules/listView').default
      injectReducer(store, { key: 'list', reducer })
      cb(null, List)
    })
  },
  childRoutes: [
    ZenRoute(store)
  ]
})
