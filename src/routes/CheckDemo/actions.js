/**
 * Created by Administrator on 12/6.
 */
import Immutable from 'immutable'
import {combineReducers} from 'redux-immutablejs'

export const storeName = 'check';

const INIT_LIST = 'INIT_LIST';
const INIT_P_LIST = 'INIT_P_LIST';
const CHECK_BOX = 'CHECK_BOX';
const CHECK_ALL_C_BOX = 'CHECK_ALL_C_BOX';
const CHECK_ALL_P_BOX = 'CHECK_ALL_P_BOX';

export const mapDispatchtoProps = {}

mapDispatchtoProps.initPList = listData => ({
  type: INIT_P_LIST,
  listData
})
mapDispatchtoProps.checkBox = id => ({
  type: CHECK_BOX,
  id
})
mapDispatchtoProps.checkAllCBox = (index, bool) => ({
  type: CHECK_ALL_C_BOX,
  index,
  bool
})
mapDispatchtoProps.checkAllPBox = _ => ({
  type: CHECK_ALL_P_BOX,
})


export const initialState = Immutable.fromJS({
  name: 'ssss',
  isall: true,
  pListData: [],
  cListData: []
})

function handle(state) {
  var isPAll = true;
  return state.update(state => state.update('pListData', pD => pD.map(e => {
    var num = e.get('children').count(e => e.get('ischecked'));
    if (isPAll && !num) isPAll = false;
    return e.set('num', num)
      .update(e => e.set('isall', e.get('num') === e.get('children').size))
      .update(e => e.set('ischecked', e.get('num') > 0))
  })).set('isall', isPAll));
}
function handleList(list) {
  if (!list) return Immutable.fromJS([])
  var res = list.map(e => {
    var num = e.get('children').count(e => e.get('ischecked'));
    if(isPAll && !num) isPAll = false;
    return e.set('num', num)
      .update(e => e.set('isall', e.get('num') === e.get('children').size))
      .update(e => e.set('ischecked', e.get('num') > 0))
  });
  return res.set('isall', isPAll);
}
function handleOneAll(p, bool=-1) {
  var _bool = bool == -1 ? !p.get('isall') : !bool;
  return p.update('children', c => c.map(e => e.set('ischecked', _bool)))
}

export const action_handlers = {
  [INIT_P_LIST]: (state, {listData}) => handle(state.set('pListData', Immutable.fromJS(listData))),
  [CHECK_BOX]: (state, {id}) => handle(state.updateIn(id, v => !v)),
  [CHECK_ALL_C_BOX]: (state, {index, bool}) => handle(state.updateIn(['pListData', index], p => handleOneAll(p))),
  [CHECK_ALL_P_BOX]: (state) => handle(state.update(state => state.update('pListData', e=>e.map((e, i) => handleOneAll(e, state.get('isall')))))),
};

