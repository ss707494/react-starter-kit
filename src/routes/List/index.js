import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'list',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const List = require('./containers/ListViewContainer').default
      const reducer = require('./modules/listView').default
      injectReducer(store, { key: 'list', reducer })
      cb(null, List)
    })
  }
})
