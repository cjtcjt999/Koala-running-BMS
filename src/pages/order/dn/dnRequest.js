import React from 'react';
import { Card, Button, Table, Form, Select, Modal, message, Switch, Input, DatePicker, Row, Col, Radio } from 'antd';
import { SearchOutlined, RedoOutlined, UserDeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from './../../../axios/index';
import Utils from './../../../utils/utils';
const FormItem = Form.Item;
const Option = Select.Option;

export default class DnRequest extends React.Component {
  state = {
    selectedRowRecords:'',
    list: [],
    isShowOpenCity: false
  }
  params = {
    currentPage: 1
  }
  componentDidMount() {
    this.requestList();
  }
  // 默认请求我们的接口数据
  requestList = () => {
    let _this = this;
    axios.ajax({
      url: '/orderInfo/get',
      data: {
        params: {
          currentPage: this.params.currentPage,
          type: 'DN',
          orderStatus: '待接单'
        }
      }
    }).then((res) => {
      let list = res.data.result.map((item, index) => {
        item.key = index;
        return item;
      });
      this.setState({
        list: list,
        pagination: Utils.pagination(res, (current) => {
          _this.params.currentPage = current;
          _this.requestList();
        })
      })
    })
  }

  handleShowDetail = (e, setFirst) => {
    if (!setFirst) {
      this.params.currentPage = 1;
      e.major = e.major && e.major[e.major.length - 1]
    }
    this.setState({
      params:e
    })
    const _this = this;
    axios.ajax({
      url: '/orderInfo/get?',
      method: 'get',
      data: {
        params: {
          currentPage: this.params.currentPage,
          type: 'DN',
          orderStatus: '待接单',
          ...e
        }
      }
    }).then((res) => {
      let list = res.data.result.map((item, index) => {
        item.key = index;
        return item;
      }).filter(v => v);
      this.setState({
        list: list,
        pagination: Utils.pagination(res, (current) => {
          _this.params.currentPage = current;
          _this.handleShowDetail(this.state.params, true);
        })
      })
    })
  }

  handleDelete = () => {
    const _this = this;
    const rowRecord = _this.state.selectedRowRecords;
    if(rowRecord){
      Modal.confirm({
        title: '确定要删除这条订单吗?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          axios.ajax({
            url: '/orderInfo/delete?',
            method: 'get',
            data: {
              params: {
                orderId: rowRecord.orderId
              }
            }
          }).then((res) => {
            if(res.code === 200){
              message.success('删除成功!');
              _this.requestList();
            }
          })
        },
        onCancel() {
        },
      });
    } else{
      message.warning('请选择一条数据！');
    }
  }

  handleReset = () => {
    this.refs.formSearch.resetFields(); 
  }

  render() {
    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderId'
      }, {
        title: '用户名',
        dataIndex: 'userName'
      }, {
        title: '真实姓名',
        dataIndex: 'realName'
      }, {
        title: '取件信息',
        children: [
          {
            title: '取件地址',
            dataIndex: 'takeAddress'
          }, {
            title: '联系人',
            dataIndex: 'takeContacts'
          }, {
            title: '联系人电话',
            dataIndex: 'takeContactsPhone',
            render: (text) => {
              return <span style={{ color: '#073eb9' }}>{text}</span>
            }
          },
        ],
      }, {
        title: '收件信息',
        children: [
          {
            title: '收货地址',
            dataIndex: 'receiveAddress'
          }, {
            title: '联系人',
            dataIndex: 'receiveContacts'
          }, {
            title: '联系人电话',
            dataIndex: 'receiveContactsPhone',
            render: (text) => {
              return <span style={{ color: '#073eb9' }}>{text}</span>
            }
          },
        ],
      }, {
        title: '取件时间',
        dataIndex: 'takeTime'
      }, {
        title: '代拿物品',
        dataIndex: 'commodity'
      }, {
        title: '备注',
        dataIndex: 'remarks'
      }, {
        title: '小费(元)',
        dataIndex: 'tips',
        sorter: (a, b) => a.tips - b.tips,
        render: (text) => {
          return Number(text).toFixed(2)
        }
      }, {
        title: '总费用(元)',
        dataIndex: 'totalFee',
        sorter: (a, b) => a.totalFee - b.totalFee,
        render: (text) => {
          return Number(text).toFixed(2)
        }
      }, {
        title: '支付方式',
        dataIndex: 'paymentMethod'
      }, {
        title: '下单时间',
        dataIndex: 'orderTime'
      }
    ]
    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17
      }
    }
    const formItemLayout2 = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16
      }
    }
    const { selectedRowKeys } = this.state;
    return (
      <div className="container">
        <Card style={{ marginBottom: '10px' }}>
          <Form ref="formSearch" onFinish={this.handleShowDetail}>
            <Row>
              <Col span="8">
                <FormItem label="订单号" name="orderId"{...formItemLayout2}>
                  {
                    <Input allowClear />
                  }
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="用户名" name="userName"{...formItemLayout2}>
                  {
                    <Input allowClear />
                  }
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="真实姓名" name="realName"{...formItemLayout2}>
                  {
                    <Input allowClear />
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
            <Col span="8">
                <FormItem label="取件联系人" name="takeContacts"{...formItemLayout2}>
                  {
                    <Input allowClear />
                  }
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="收件联系人" name="receiveContacts"{...formItemLayout2}>
                  {
                    <Input allowClear />
                  }
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="支付方式" name="paymentMethod"{...formItemLayout2}>
                  {
                    <Radio.Group value={'微信支付'}>
                      <Radio value={'微信支付'}>微信支付</Radio>
                      <Radio value={'支付宝'}>支付宝</Radio>
                    </Radio.Group>
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              {/* <Col span="8">
                <FormItem label="商品价格" name="commodityPrice"{...formItemLayout2}>
                  {
                    <Input.Group>
                      <Input
                        style={{ width: 100, textAlign: 'center' }}
                      />
                      <Input
                        style={{
                          width: 40,
                          borderLeft: 0,
                          borderRight: 0,
                          pointerEvents: 'none'
                        }}
                        placeholder="至"
                        disabled
                      />
                      <Input
                        style={{
                          width: 100,
                          textAlign: 'center',
                        }}
                      />
                    </Input.Group>
                  }
                </FormItem>
              </Col> */}
              {/* <Col span="8">
                <FormItem label="跑腿费" name="expenses"{...formItemLayout2}>
                  {
                    <Input.Group>
                      <Input
                        style={{ width: 100, textAlign: 'center' }}
                      />
                      <Input
                        style={{
                          width: 40,
                          borderLeft: 0,
                          borderRight: 0,
                          pointerEvents: 'none'
                        }}
                        placeholder="至"
                        disabled
                      />
                      <Input
                        style={{
                          width: 100,
                          textAlign: 'center',
                        }}

                      />
                    </Input.Group>
                  }
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="下单时间" name="orderTime"{...formItemLayout2}>
                  {
                    <Input.Group compact>
                      <DatePicker.RangePicker />
                    </Input.Group>
                  }
                </FormItem>
              </Col> */}
            </Row>
            <Row justify="center" style={{ marginTop: "6px" }}>
              <FormItem>
                <Button icon={<SearchOutlined />} htmlType='submit' type="primary" style={{ margin: '0 20px' }}>查询</Button>
                <Button icon={<RedoOutlined />} onClick={this.handleReset}>重置</Button>
              </FormItem>
            </Row>
          </Form>
        </Card>
        <Card className="btn_card">
          <Button 
            icon={<UserDeleteOutlined />} 
            type="primary" 
            style={{ marginLeft:'15px' }}
            onClick={this.handleDelete}>
            删除订单
          </Button>
        </Card>
        <div className="content-wrap">
          <Table
            size="small"
            bordered
            rowSelection={{
              type: 'radio',
              selectedRowKeys
            }}
            onRow={(record, index) => {
              return {
                onClick: () => {
                  let selectKey = [index];
                  this.setState({
                    selectedRowRecords:record,
                    selectedRowKeys: selectKey
                  })
                } // 点击行
              };
            }}
            columns={columns}
            dataSource={this.state.list}
            pagination={this.state.pagination}
            scroll={{ x: 1500 }}
          />
        </div>
      </div>
    )
  }
}
