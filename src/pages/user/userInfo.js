import React from 'react';
import { Card, Button, Table, Form, Select, Modal, message, Switch, Input, Cascader ,Row,Col } from 'antd';
import { SearchOutlined, RedoOutlined, ToolOutlined } from '@ant-design/icons';
import axios from '../../axios/index';
import Utils from '../../utils/utils';
import { majorList } from '../../config/majorList'
import './index.less'
const FormItem = Form.Item;
const Option = Select.Option;

export default class UserInfo extends React.Component {
  state = {
    list: [],
    selectedRowRecords:'',
    isShowOpenCity: false,
    updateModalShow:false,
    selectMajor: ''
  }
  params = {
    page: 1
  }

  componentDidMount() {
    this.requestList();
  }

  componentDidUpdate(preProps,preState) {
    //点击修改回填信息
    if (preState.updateModalShow !== this.state.updateModalShow && this.state.updateModalShow) {
      setTimeout(() => {
        this.refs.formUpdateAdmin.resetFields(); 
      }, 0);
    }
  }

  // 默认请求我们的接口数据
  requestList = () => {
    let _this = this;
    axios.ajax({
      url: '/userInfo/get',
      data: {
        params: {
          currentPage: this.params.page
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
          _this.params.page = current;
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
      url: '/userInfo/get?',
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

  handleUpdate = () => {
    const _this = this;
    const fieldValue = this.refs.formUpdateAdmin.getFieldsValue();
    fieldValue.id = _this.state.selectedRowRecords.id;
      axios.ajax({
        url: '/userInfo/update?',
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
        dataIndex: 'id'
      }, {
        title: '用户名',
        dataIndex: 'userName'
      }, {
        title: '真实姓名',
        dataIndex: 'realName'
      }, {
        title: '学号',
        dataIndex: 'studentNumber'
      }, {
        title: '专业',
        dataIndex: 'major'
      }, {
        title: '手机号码',
        dataIndex: 'phoneNumber'
      }, {
        title: '余额',
        dataIndex: 'blance',
        sorter: (a, b) => a.blance - b.blance,
        render: (text) => {
          return Number(text).toFixed(2)
        }
      }, {
        title: '注册时间',
        dataIndex: 'registerTime'
      },{
        title: '用户权限',
        dataIndex: 'permission',
        fixed: 'right',
        render(permission) {
          return permission == 1 ? <Switch defaultChecked="true" /> : <Switch />;
        }
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
              <Col span="6">
                <FormItem label="用户名" name="userName"{...formItemLayout}>
                  {
                    <Input allowClear />
                  }
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="真实姓名" name="realName"{...formItemLayout}>
                  {
                    <Input allowClear />
                  }
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="手机号码" name="phoneNumber"{...formItemLayout}>
                  {
                    <Input allowClear />
                  }
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="学号" name="studentNumber"{...formItemLayout}>
                  {
                    <Input allowClear />
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="6">
                <FormItem label="专业" name="major"{...formItemLayout}>
                  {
                    <Cascader
                      options={majorList}
                      placeholder="请选择专业"
                    />
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
          title="修改用户信息"
          visible={this.state.updateModalShow}
          onOk={this.handleUpdate}
          onCancel={()=>{
              this.setState({updateModalShow:false});
          }}
        >  
          <Form 
            ref="formUpdateAdmin"
            initialValues={{
              realName: this.state.selectedRowRecords.realName,
              userName: this.state.selectedRowRecords.userName,
              major: this.state.selectedRowRecords.major,
              phoneNumber: this.state.selectedRowRecords.phoneNumber,
            }}
          >
            <FormItem label="真实姓名" name="realName"{...formItemLayout2}>
               {
                <Input allowClear />
               }
            </FormItem>
            <FormItem label="用户名" name="userName"{...formItemLayout2}>
               {
                <Input allowClear />
               }
            </FormItem>
            <FormItem label="专业" name="major" {...formItemLayout2}>
               {
                <Input allowClear />
               }
            </FormItem>
            <FormItem label="手机号码" name="phoneNumber" {...formItemLayout2}>
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
