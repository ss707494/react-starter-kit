/**
 * Created by Administrator on 12/6.
 */

import immutable from 'immutable'

export const storeName = 'activity';

const INIT_LIST = 'INIT_LIST';

const CHANGE_TITLE = 'CHANGE_TITLE'

export const mapDispatchtoProps = {}

mapDispatchtoProps.initList = listData => ({
  type: INIT_LIST,
  listData
})

mapDispatchtoProps.changeTitle = showTitle => ({type: CHANGE_TITLE, showTitle})

export const action_handlers = {
  [INIT_LIST]: (state, {listData}) => {
    return {...state, listData}
  },
  [CHANGE_TITLE]: (state, {showTitle}) => ({...state, showTitle})
}

export const initialState = {
  name: '',
  listData: [],
  listData1: [
    {text: '1', value: '1'},
    {text: '1', value: '2'},
    {text: '1', value: '3'},
    {text: '1', value: '4'},
    {text: '1', value: '5'},
    {text: '1', value: '6'},
    {text: '1', value: '7'},
    {text: '1', value: '8'},
    {text: '1', value: '9'},
    {text: '1', value: '0'},
  ],
  showTitle: 1,
}


