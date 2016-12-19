/**
 * Created by Administrator on 12/6.
 */

export const storeName = 'detail';

const INIT_DATA = 'INIT_DATA';

export const mapDispatchtoProps = {}

mapDispatchtoProps.initData = data => ({
  type: INIT_DATA,
  data
})

export const initialState = {
  data: {},
  name: '',

  listData: []
}

export const action_handlers = {
  [INIT_DATA]: (state, action) => ({...state, data: action.data})
}

