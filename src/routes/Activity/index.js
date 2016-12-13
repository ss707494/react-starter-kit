import {initRoutesAsyn} from 'baseUtil'

export default (store) => ({

  path: 'activity',

  childRoutes: [
    'list',
    'detail/:id'
  ].map(initRoutesAsyn(store)),
})




