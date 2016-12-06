/**
 * Created by Administrator on 12/6.
 */

export const storeName = 'activity';

const INIT_LIST = 'INIT_LIST';

export const mapDispatchtoProps = {}

mapDispatchtoProps.initList = listData => ({
  type: INIT_LIST,
  action: {
    listData
  }
})

export const initialState = {
  name: '',
  listData: []
}

export const action_handlers = {
  [INIT_LIST]: (state, action) => {
    return ({...state, listData: action.listData})
  }
}

