import React, {Component} from 'react'
import classes from './ListView.scss'
import TopTab from 'components/TopTab'

import { Table } from 'antd'

const columns = [{
  title: '申请日期',
  dataIndex: 'date',
  width: 150
}, {
  title: '申请金额',
  dataIndex: 'amount',
  width: 150
}, {
  title: '支付宝交易号',
  dataIndex: 'orderNo'
}, {
  title: '支付宝账号',
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
    return (
      <div>
        <TopTab></TopTab>
        <div className={classes.con}>
          <div>
            <div>全部</div>
            <div>申请中</div>
            <div>已完成</div>
          </div>
          <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
        </div>
      </div>
    )
  }
}
