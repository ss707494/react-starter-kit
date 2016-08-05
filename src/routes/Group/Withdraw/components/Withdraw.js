import React, {Component} from 'react'
import classes from './Withdraw.scss'
import TopTabGroup from 'components/TopTab'

import { Table, Icon, DatePicker } from 'antd'
const RangePicker = DatePicker.RangePicker

const columns = [{
  title: '申请日期',
  dataIndex: 'date'
}, {
  title: '申请金额',
  dataIndex: 'amount'
}, {
  title: '支付宝交易号',
  dataIndex: 'orderNo'
}, {
  title: '支付账号',
  dataIndex: 'orderName'
}, {
  title: '状态',
  dataIndex: 'state'
}, {
  title: '付款时间',
  dataIndex: 'orderTime'
}];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    date: `2016-06-0${i}`,
    amount: '$146.00',
    orderNo: '21000*****00000',
    orderName: '132*****655 (Alice)',
    state: '申请中',
    orderTime: '2016-06-06 11:16:32'
  });
}

export default class WithdrawView extends Component {

  render () {

    const { withdraw, changeType, fetchData } = this.props
    const { type } = withdraw
    fetchData()

    const onChange= (value, dateString) => {
      console.log(value)
      console.log(dateString)
    }

    const pagination = {
      total: data.length,
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize);
      },
      onChange(current) {
        console.log('Current: ', current);
      }
    }

    const changeTypeHandle = (type) => {
      changeType(type)
    }

    const moneyGroup = (
      <div className={classes.money_right}>
        <div className={classes.money_item}>
          <span>申请中的金额</span>
          <em>1,500</em>
        </div>
        <div className={classes.money_item}>
          <span>申请中的金额</span>
          <em>1,500</em>
        </div>
        <div className={classes.money_item}>
          <span>申请中的金额</span>
          <em>1,500</em>
        </div>
      </div>
    )

    const TypeTab = (
      <div className={classes.type}>
        <div onClick={changeTypeHandle.bind(this, 'all')} className={[classes.typeitem, type == 'all' ? classes.type_active : ''].join(' ')}>全部</div>
        <div onClick={changeTypeHandle.bind(this, 'processing')} className={[classes.typeitem, type == 'processing' ? classes.type_active : ''].join(' ')}>申请中</div>
        <div onClick={changeTypeHandle.bind(this, 'completed')} className={[classes.typeitem, type == 'completed' ? classes.type_active : ''].join(' ')}>已完成</div>
      </div>
    )

    return (
      <div>
        <TopTabGroup></TopTabGroup>

        <div className={[classes.money_con, 'clearfix'].join(' ')}>
          <div className={[classes.money_item, classes.money_left].join(' ')}>
            <span>账户余额</span>
            <em>1,500</em>
          </div>
          {moneyGroup}
        </div>

        <div className={classes.con}>
          <div className={[classes.table_top, 'clearfix'].join(' ')}>
            {TypeTab}
            <div className={classes.date}>
              <RangePicker style={{ width: 246 }} onChange={onChange} />
            </div>
            <div className={classes.btn}>
              <button type="button" className="button mr12">申请提现</button>
              <button type="button" className="button blue">消费记录</button>
            </div>
          </div>
          <Table columns={columns} dataSource={data} pagination={pagination}/>
        </div>
      </div>
    )
  }
}
