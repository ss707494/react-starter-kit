/**
 * Created by Administrator on 12/6.
 */
import Immutable from 'immutable'
import {combineReducers } from 'redux-immutablejs'

export const storeName = 'check';

window.immm = Immutable
const INIT_LIST = 'INIT_LIST';
const INIT_P_LIST = 'INIT_P_LIST';
const CHECK_BOX = 'CHECK_BOX';

export const mapDispatchtoProps = {}

mapDispatchtoProps.initPList = listData => ({
  type: INIT_P_LIST,
  listData
})
mapDispatchtoProps.checkBox = id => ({
  type: CHECK_BOX,
  id
})


export const initialState = Immutable.fromJS({
  name: 'ssss',
  pListData: [],
  cListData: []
})

export const action_handlers = {
  [INIT_P_LIST]: (state, {listData}) => state.set('pListData', Immutable.fromJS(listData)),
  [CHECK_BOX]: (state, {id}) => state.updateIn(id, v => !v)
}

