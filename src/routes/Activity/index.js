import {injectReducer} from 'customReducer'
import List from './List';

export default (store) => ({

  path: 'activity',

  childRoutes: [
    List(store)
  ],
})
