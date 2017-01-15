import {initRoutesAsyn, initContainer, initContainerArr} from 'baseUtil'
import React from 'react'

// export default (store) => ({
//   path: 'cc/:id',
//   getComponent (nextState, cb) {
//     require.ensure([], (require) => {
//       // const Route = require('../Route/components/Route').default
//       const Route = require('./Route').default
//       cb(null, Route)
//     })
//   }
// })
const _path = 'CheckDemo'
export default (store) => ({
  path: _path,
  getChildRoutes(location, callback) {
    require.ensure([], function (require) {
      const actions = require('./actions')
      const child = ['plist', 'clist'].map(e => {
        return require('./' + e + '/containers').container
      })
      const new_s = initContainerArr(store)(child, actions);
      const Plist = new_s[0];
      const Clist = new_s[1];
      callback(null, [{
        path: 'plist',
        component: Plist
      }, {
        path: 'clist/:id',
        component: Clist
      }
      ]);
    })

  },

})




