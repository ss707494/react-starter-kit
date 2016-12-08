import {injectReducer} from 'customReducer'
// import List from './List';

export default (store) => ({

  path: 'activity',

  childRoutes: [
    'list',
    'detail/:id'
  ].map(initRoutes(store)),
})

const initRoutes = store => path => ({
  path,
  getComponent (nextState, cb) {
    const end = path.indexOf('/');
    const _path = end !== -1 ? path.substring(0, end) : path;
    require.ensure(['baseUtil'], (require) => {
      const baseUtil = require('baseUtil');
      const {container} = require(`./${_path}/containers`);
      const actions = require(`./${_path}/actions`);
      const conta = baseUtil.initContainer(store)(container, actions);
      cb(null, conta)
    })
  }
})

