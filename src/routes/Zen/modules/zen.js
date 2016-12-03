// ------------------------------------
// Constants
// ------------------------------------
const RECEIVE_ZEN = 'RECEIVE_ZEN'
const REQUEST_ZEN = 'REQUEST_ZEN'
const CLEAR_ZEN = 'CLEAR_ZEN'
const SHOW_LIST = 'SHOW_LIST';

import $ from 'jquery';
// ------------------------------------
// Actions
// ------------------------------------

function requestZen() {
  return {
    type: REQUEST_ZEN
  }
}

let avaliableId = 0
export const receiveZen = (value) => ({
  type: RECEIVE_ZEN,
  payload: {
    text: value,
    id: avaliableId++
  }
})

export const clearZen = () => ({
  type: CLEAR_ZEN
})

export const showList = (listData) => ({
  type: SHOW_LIST,
  listData
})

export function fetchZen() {
  return (dispatch, getState) => {
    if (getState().zen.fetching) return

    dispatch(requestZen());
    $.ajax('/v2/movie/top250')
      .done(res => {
        // debugger

      });
    return fetch('/v2/movie/top250')
      .then(data =>  data.json())
      // .then(data => {
      //   debugger
      //   dispatch(receiveZen(text))
      // })
      .then(data => dispatch(showList(data.subjects)))
  }
}

export const actions = {
  showList,
  requestZen,
  receiveZen,
  clearZen,
  fetchZen
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUEST_ZEN]: (state) => {
    return ({...state, fetching: true})
  },
  [RECEIVE_ZEN]: (state, action) => {
    return ({...state, fetching: false, text: state.text.concat(action.payload)})
  },
  [CLEAR_ZEN]: (state) => {
    return ({...state, text: []})
  },
  [SHOW_LIST]: (state, action) => {
    return ({...state, fetching: false, listData: action.listData})
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  fetching: false,
  text: [],
  listData: []
}
export default function (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
