// 只需要导入必要的模块在初始化加载
import CoreLayout from '../layouts/CoreLayout/CoreLayout'
import Home from './Home'
import CounterRoute from './Counter'
import ZenRoute from './Zen'
import ElapseRoute from './Elapse'
import RouteRoute from './Route'
import PageNotFound from './PageNotFound'
import Redirect from './PageNotFound/redirect'
import Group from './Group'

export const createRoutes = (store) => ({
  path: '/',
  component: CoreLayout,
  indexRoute: Home,
  childRoutes: [
    CounterRoute(store),
    ZenRoute(store),
    ElapseRoute(store),
    RouteRoute(store),
    Group(store),
    PageNotFound(),
    Redirect
  ]
})

export default createRoutes
