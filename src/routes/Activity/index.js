import {injectReducer} from 'customReducer'
// import List from './List';

export default (store) => ({

  path: 'activity',

  childRoutes: [
    'list'
  ].map(initRoutes(store)),
})

const initRoutes = store => path => ({
  path,
  getComponent (nextState, cb) {
    require.ensure(['baseUtil'], (require) => {
      const baseUtil = require('baseUtil');
      const {container} = require(`./${path}/containers`);
      const actions = require(`./${path}/actions`);
      const conta = baseUtil.initContainer(store)(container, actions);
      cb(null, conta)
    })
  }
})

