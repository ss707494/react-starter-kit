/**
 * Created by Administrator on 12/6.
 */
import config from 'config'

export const storeName = 'activity';

const INIT_LIST = 'INIT_LIST';

export const mapDispatchtoProps = {}

mapDispatchtoProps.initList = listData => ({
  type: INIT_LIST,
  listData
})

mapDispatchtoProps.getListData = params => (dispatch, getState) => {
  fetch(config.baseApi('/activity/getList?currentPageNo=1&pageSize=20&orderType=1'))
    .then(data => data.json())
    .then(res => dispatch(mapDispatchtoProps.initList(res.rows || [])))
}

export const initialState = {
  name: '',
  listData: []
}

export const action_handlers = {
  [INIT_LIST]: (state, {listData}) => {
    return {...state, listData}
  }
}

