import React, {Component} from 'react'
import classes from './ListView.scss'
import TopTab from 'components/TopTab'

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


export default class ListView extends Component {

  render () {

    const onChange= (value, dateString) => {
      console.log(value)
      console.log(dateString)
    }

    return (
      <div>
        <TopTab></TopTab>

        <div className={[classes.money_con, 'clearfix'].join(' ')}>
          <div className={[classes.money_item, classes.money_left].join(' ')}>
            <span>账户余额</span>
            <em>1,500</em>
          </div>
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
        </div>

        <div className={classes.con}>
          <div className={[classes.table_top, 'clearfix'].join(' ')}>
            <div className={classes.type}>
              <div className={classes.typeitem}>全部</div>
              <div className={[classes.typeitem, classes.typeactive].join(' ')}>申请中</div>
              <div className={classes.typeitem}>已完成</div>
            </div>
            <div className={classes.date}>
              <RangePicker style={{ width: 246 }} onChange={onChange} />
            </div>
            <div className={classes.btn}>
              <button type="button" className="button mr12">申请提现</button>
              <button type="button" className="button blue">消费记录</button>
            </div>
          </div>
          <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
        </div>
      </div>
    )
  }
}
