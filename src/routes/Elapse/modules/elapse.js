// ------------------------------------
// Constants
// ------------------------------------
export const PLUS = 'PLUS'
export const CLEAN = 'CLEAN'

// ------------------------------------
// Actions
// ------------------------------------

export function plus () {
  return {
    type: PLUS
  }
}

export const actions = {
  plus,
  clean(){
    return {type: CLEAN};
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PLUS]: (state) => {
    return state + 1
  },
  [CLEAN]: (state) => {
    return 0
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = 0
export default function elapseReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
