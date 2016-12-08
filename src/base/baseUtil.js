/**
 * Created by Administrator on 12/6.
 */

import { connect } from 'react-redux'
import { injectReducer } from 'customReducer'

export const initContainer = store => (containers, actions) => {
  const {storeName, initialState, mapDispatchtoProps, action_handlers} = actions;
  const mapStateToProps = (state) => ({
    [storeName]: state[storeName]
  });
  const reducer = initReducer(initialState, action_handlers);
  injectReducer(store, {key: storeName, reducer});
  return connect(mapStateToProps, mapDispatchtoProps)(containers);
}

const initReducer = (initialState, action_handlers) => (state, action) => {
  const handler = action_handlers[action.type]
  const _state = state || initialState;
  return handler ? handler(_state, action) : _state
}

export const initRoutesAsyn = store => (path, parentPath = '') => ({
  path,
  getComponent (nextState, cb) {
    const end = path.indexOf('/');
    const _path = (end !== -1 ? path.substring(0, end) : path) + parentPath;
    require.ensure([], (require) => {
      const baseUtil = require('baseUtil');
      const {container} = require('routes/'+_path+'/containers');
      const actions = require('routes/'+_path+'/actions');
      const conta = baseUtil.initContainer(store)(container, actions);
      cb(null, conta)
    })
  }
})
