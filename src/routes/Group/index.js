import Withdraw from './Withdraw'
import Reward from './Reward'
import Part from './Part'

export default (store) => ({
  path: 'group',
  indexRoute: Withdraw(store),
  childRoutes: [
    Part(store),
    Withdraw(store),
    Reward(store)
  ]
})
