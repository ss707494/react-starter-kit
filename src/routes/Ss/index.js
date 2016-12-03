/**
 * Created by Administrator on 2016/11/27.
 */

export default (store) => ({
  path: 'ss',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      var ss = require('./containers/ss').default;
      cb(null, ss);
    })
  }
});
// export default () => ({
//   path: 'ss',
//   getComponent (nextState, cb) {
//     require.ensure([], (require) => {
//       const PageNotFound = require('./components/PageNotFound').default
//       cb(null, PageNotFound)
//     })
//   }
// })
