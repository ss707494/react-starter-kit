import {initRoutesAsyn} from 'baseUtil'

const _path = 'activity'
export default (store) => ({
  path: _path,
  childRoutes: [
    'list',
    'detail/:id'
  ].map(e => initRoutesAsyn(store)(e, _path)),
})




