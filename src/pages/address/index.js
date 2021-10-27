import React from 'react';
import { Card, Button, Table, Form, Select, Modal, message, Switch, Input, DatePicker,Row,Col } from 'antd';
import { SearchOutlined, RedoOutlined, UserAddOutlined, ToolOutlined, UserDeleteOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import axios from '../../axios/index';
import Utils from '../../utils/utils';
const FormItem = Form.Item;
const Option = Select.Option;

export default class Address extends React.Component {
  state = {
    list: [],
    selectedRowRecords:'',
    updateModalShow:false
  }
  params = {
    currentPage: 1
  }

  componentDidMount() {
    this.requestList();
  }

  componentDidUpdate(preProps,preState) {
    //点击修改回填信息
    if (preState.updateModalShow !== this.state.updateModalShow && this.state.updateModalShow) {
      setTimeout(() => {
        this.refs.formUpdateAddress.resetFields(); 
      }, 0);
    }
  }

  // 默认请求我们的接口数据
  requestList = () => {
    const _this = this;
    axios.ajax({
      url: '/addressInfo/get?',
      method:'get',
      data: {
        params: {
          currentPage: this.params.currentPage
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
    this.setState({
      params:e
    })
    if (!setFirst) {
      this.params.currentPage = 1;
    }
    const _this = this;
    axios.ajax({
      url: '/addressInfo/get?',
      method: 'get',
      data: {
        params: {
          currentPage: this.params.currentPage,
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
        title: '确定要删除这条地址信息吗?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          axios.ajax({
            url: '/addressInfo/delete?',
            method: 'get',
            data: {
              params: {
                id: rowRecord.id
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
  handleUpdate = () => {
    const _this = this;
    const fieldValue = this.refs.formUpdateAddress.getFieldsValue();
    fieldValue.id = _this.state.selectedRowRecords.id;
      axios.ajax({
        url: '/addressInfo/update?',
        method: 'get',
        data: {
          params: {
          ...fieldValue
          }
        }
      }).then((res) => {
        if(res.code === 200){
          message.success('修改成功！');
          _this.setState({
            updateModalShow:false
          })
          _this.requestList();
        }
      })
  }
  handleReset = () => {
    this.refs.formSearch.resetFields(); 
  }
  render() {
    const columns = [
      {
        title: '用户ID',
        dataIndex: 'userId'
      }, {
        title: '真实姓名',
        dataIndex: 'realName'
      }, {
        title: '用户名',
        dataIndex: 'userName'
      }, {
        title: '地址信息',
        children: [
          {
            title: '收货地址',
            dataIndex: 'address'
          }, {
            title: '联系人',
            dataIndex: 'contacts'
          }, {
            title: '联系人电话',
            dataIndex: 'contactsPhone',
            render: (text) => {
              return <span style={{ color: '#073eb9' }}>{text}</span>
            }
          },
        ],
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
        span: 5,
      },
      wrapperCol: {
        span: 19
      }
    }
    const { selectedRowKeys } = this.state;
    return (
      <div className="container">
        <Card style={{marginBottom:'10px'}}>
          <Form ref="formSearch" onFinish={this.handleShowDetail}>
            <Row>
              <Col span="8">
                <FormItem label="真实姓名" name="realName"{...formItemLayout}>
                  {
                    <Input allowClear />
                  }
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="用户名" name="userName"{...formItemLayout}>
                  {
                    <Input allowClear />
                  }
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="联系人" name="contacts"{...formItemLayout}>
                  {
                    <Input allowClear />
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="联系人电话" name="contactsPhone"{...formItemLayout}>
                  {
                    <Input allowClear />
                  }
                </FormItem>
              </Col>
            </Row>
            <Row justify="center"style={{marginTop:"6px"}}>
              <FormItem>
                <Button icon={<SearchOutlined />} htmlType='submit' type="primary" style={{ margin: '0 20px' }}>查询</Button>
                <Button icon={<RedoOutlined />} onClick={this.handleReset}>重置</Button>
              </FormItem>
            </Row>
          </Form>
        </Card>
        <Card className="btn_card">
            <Button 
              icon={<ToolOutlined />} 
              type="primary" 
              style={{ marginLeft:'15px' }}
              onClick={()=>{
                if(this.state.selectedRowRecords){
                  this.setState({updateModalShow:true});
                }else{
                  message.warning('请选择一条数据！');
                }
                }
              }>
                修改信息
              </Button>
              <Button 
                icon={<UserDeleteOutlined />} 
                type="primary" 
                style={{ marginLeft:'15px' }}
                onClick={this.handleDelete}>
                删除地址
              </Button>
        </Card>
        <div className="content-wrap">
          <Table
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
          />
        </div>
        <Modal
          title="修改地址信息"
          visible={this.state.updateModalShow}
          onOk={this.handleUpdate}
          onCancel={()=>{
              this.setState({updateModalShow:false});
          }}
        >  
          <Form 
            ref="formUpdateAddress"
            initialValues={{
              address: this.state.selectedRowRecords.address,
              contacts: this.state.selectedRowRecords.contacts,
              contactsPhone: this.state.selectedRowRecords.contactsPhone
            }}
          >
            <FormItem label="收件地址" name="address" {...formItemLayout2}>
               {
                <Input allowClear />
               }
            </FormItem>
            <FormItem label="联系人" name="contacts" {...formItemLayout2}>
               {
                <Input allowClear />
               }
            </FormItem>
            <FormItem label="联系人电话" name="contactsPhone" {...formItemLayout2}>
               {
                <Input allowClear />
               }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
