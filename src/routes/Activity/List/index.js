export default (store) => ({
  path: 'list',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Route = require('./components/List').default
      cb(null, Route)
    })
  }
})
