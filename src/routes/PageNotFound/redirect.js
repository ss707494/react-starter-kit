export default {
  path: '*',
  indexRoute: {
    onEnter (nextState, replace) {
      replace('/iFly-SS-APP/404')
    }
  }
}
