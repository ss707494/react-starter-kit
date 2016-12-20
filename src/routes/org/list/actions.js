/**
 * Created by Administrator on 12/6.
 */
import config from 'config'

export const storeName = 'activity';

const INIT_LIST = 'INIT_LIST';
const CHANGE_NAME = 'CHANGE_NAME';

export const mapDispatchtoProps = {
  changeNavName(name) {
    return {type: CHANGE_NAME, name}
  }
}

mapDispatchtoProps.initList = listData => ({
  type: INIT_LIST,
  listData
})
mapDispatchtoProps.getListData = params => (dispatch, getState) => {
  fetch(config.baseApi('/activity/getList?currentPageNo=1&pageSize=20&orderType=1'))
    .then(data => data.json())
    .then(res => dispatch(mapDispatchtoProps.initList(res.rows || [])))
}

export const action_handlers = {
  [INIT_LIST]: (state, {listData}) => {
    return {...state, listData}
  },
  [CHANGE_NAME]: (state, {name}) => {
    const searchBoxData0 = state.searchBoxData;
    const searchBoxData = {...searchBoxData0, showName: name === searchBoxData0.showName ? '' : name}
    return {...state, searchBoxData}
  }
}

export const initialState = {
  name: '',
  listData: []
  , searchBoxData: {
    showName: ''
    , navList: [
      {
        name: '公益类型'
        , value: 'type'
        , selectList: [
        {text: '123', value: '123'}
        , {text: '555', value: '555'}
      ]
      },
      {
        name: '排序'
        , value: 'label'
        , selectList: [
        {text: '123', value: '123'}
        , {text: '555', value: '555'}
      ]
      }
      , {
        name: '全市'
        , value: 'community'
        , selectList: [
          {text: '234', value: '234'}
          , {text: 'sdf', value: 'sdf'}
        ]
      }
    ]
  }
}

