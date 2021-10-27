import React from 'react';
import { Card, Button, Table, Form, Select, Modal, message, Switch, Input, DatePicker,Row,Col } from 'antd';
import { SearchOutlined, RedoOutlined, UserAddOutlined, ToolOutlined, UserDeleteOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import axios from '../../axios/index';
import Utils from '../../utils/utils';
import './index.less'
const FormItem = Form.Item;
const Option = Select.Option;

export default class AdminInfo extends React.Component {
  state = {
    list: [],
    selectedRowRecords:'',
    addModalShow: false,
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
        this.refs.formUpdateAdmin.resetFields(); 
      }, 0);
    }
  }

  // 默认请求我们的接口数据
  requestList = () => {
    const _this = this;
    axios.ajax({
      url: '/adminInfo/get?',
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
      url: '/adminInfo/get?',
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
  handleAdd = () => {
    const _this = this;
    const fieldValue = this.refs.formAddAdmin.getFieldsValue();
    console.log(fieldValue);
    if(!fieldValue.realName){
      message.error('请输入真实姓名！');
    } else if (!fieldValue.userName) {
      message.error('请输入用户名！');
    } else if (!fieldValue.userPassword) {
      message.error('请输入密码！');
    } else{
      axios.ajax({
        url: '/adminInfo/add?',
        method: 'get',
        data: {
          params: {
            ...fieldValue
          }
        }
      }).then((res) => {
        if(res.code === 200){
          message.success('添加成功！');
          _this.setState({
            addModalShow:false
          })
          _this.requestList();
        }else{
          message.warning('请检查网络！');
        }
      })
    }
  }
  handleDelete = () => {
    const _this = this;
    const rowRecord = _this.state.selectedRowRecords;
    if(rowRecord){
      rowRecord.userId = rowRecord.id; 
      Modal.confirm({
        title: '确定要删除这条管理员信息吗?',
        icon: <ExclamationCircleOutlined />,
        onOk() {
          axios.ajax({
            url: '/adminInfo/delete?',
            method: 'get',
            data: {
              params: {
                ...rowRecord
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
    const fieldValue = this.refs.formUpdateAdmin.getFieldsValue();
    fieldValue.id = _this.state.selectedRowRecords.id;
      axios.ajax({
        url: '/adminInfo/update?',
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
        title: '真实姓名',
        dataIndex: 'realName'
      },, {
        title: '用户名',
        dataIndex: 'userName'
      }, {
        title: '密码',
        dataIndex: 'userPassword'
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
                <FormItem label="真实姓名" name="realName"{...formItemLayout}>
                  {
                    <Input allowClear />
                  }
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="用户名" name="userName"{...formItemLayout}>
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
              icon={<UserAddOutlined />} 
              type="primary" 
              style={{ marginLeft:'15px' }}
              onClick={()=>{this.setState({addModalShow:true})}}>
                添加管理员
            </Button>
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
                删除管理员
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
          title="添加管理员"
          visible={this.state.addModalShow}
          onOk={this.handleAdd}
          onCancel={()=>this.setState({addModalShow:false})}
        >
          <Form  ref="formAddAdmin">
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
            <FormItem label="密码" name="userPassword" {...formItemLayout2}>
               {
                <Input allowClear type="password"/>
               }
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="修改管理员信息"
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
              userPassword: this.state.selectedRowRecords.userPassword
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
            <FormItem label="密码" name="userPassword" {...formItemLayout2}>
               {
                <Input allowClear type="password"/>
               }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
