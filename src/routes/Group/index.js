import Withdraw from './Withdraw'
import Reward from './Reward'
import Part from './Part'

export default (store) => ({
  path: 'group',
  indexRoute: {
    onEnter (nextState, replace) {
      replace('/group/withdraw')
    }
  },
  childRoutes: [
    Part(store),
    Withdraw(store),
    Reward(store)
  ]
})
