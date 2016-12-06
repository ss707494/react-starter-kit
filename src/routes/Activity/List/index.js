// import baseUtil from 'baseUtil'

export default (store) => ({
  path: 'list',
  getComponent (nextState, cb) {
    require.ensure(['baseUtil'], (require) => {
      const baseUtil = require('baseUtil');
      const {container} = require('./containers');
      const actions = require('./actions');
      const conta = baseUtil.initContainer(store)(container, actions);

      cb(null, conta)
    })
  }
})
