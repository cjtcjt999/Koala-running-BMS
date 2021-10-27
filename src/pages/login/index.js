import React from 'react';
import { Row, Col, Carousel, Form, Input, Button, Tabs, message  } from 'antd';
import { ChromeOutlined, IeOutlined } from '@ant-design/icons';
import axios from './../../axios/index';
import Utils from './../../utils/utils';
import './login.less';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
export default class Login extends React.Component {
  state = {
    username: '',
    password: '',
    isShowFirst: true,
    isShowSecond: false,
    isShowThird: false,
  };
  changeCarousel = current => {
    const this_ = this;
    const { isShowFirst, isShowSecond, isShowThird } = this_.state;
    if (current == 0) {
      this_.setState({
        isShowFirst: !isShowFirst,
        isShowSecond: false,
        isShowThird: false
      });
    } else if (current == 1) {
      this_.setState({
        isShowFirst: false,
        isShowSecond: !isShowSecond,
        isShowThird: false
      });
    } else if (current == 2) {
      this_.setState({
        isShowFirst: false,
        isShowSecond: false,
        isShowThird: !isShowThird
      });
    }
  };
  login = (e) =>{
    const _this = this;
    console.log(e);
    if(!e.userName){
      message.error('请输入用户名！');
    } else if (!e.userPassword) {
      message.error('请输入密码！');
    } else if (!e.captcha) {
      message.error('请输入验证码！');
    } else if (e.captcha !== '1234') {
      message.error('验证码错误！');
    } else{
      axios.ajax({
        url: '/login',
        method: 'post',
        data: {
          ...e
        }
      }).then((res) => {
        if(res.code === 200){
          localStorage.setItem("userInfo", JSON.stringify(res.data))
          localStorage.setItem("menuName", '首页')
          window.location.href=('/#/admin/dashBoard')
        }
      })
    }
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    const _this = this;
    const {
      isShowFirst,
      isShowSecond,
      isShowThird,
    } = _this.state;
    return (
    <Row>
        <Col span={24} className="bg_top">
          <div
            style={{
              width: '100%',
              maxWidth: '1400px',
              height: '100%',
              position: 'relative',
              margin: '0 auto'
            }}
          >
            <Carousel style={{ height: 640, width: '100%' }} autoplay={true}afterChange={_this.changeCarousel}>
            <div>
              <img
                id='slide1-1'
                src='/assets/login/login-slide1-1.png'
                style={{ position: 'absolute', top: 145, opacity: 1 }}
              />
              <img
                className={isShowFirst ? 'login_cur_first_animation' : ''}
                id='slide1-2'
                src='/assets/login/login-slide1-2.png'
                style={{
                  position: 'relative',
                  marginTop: 70,
                  left: 192,
                  opacity: 0
                }}
              />
            </div>
            <div>
              <img
                id='slide2-1'
                src='/assets/login/login-slide2-1.png'
                style={{ position: 'absolute', top: 145, opacity: 1 }}
              />
              <img
                className={isShowSecond ? 'login_cur_second_animation' : ''}
                id='slide2-2'
                src='/assets/login/login-slide2-2.png'
                style={{
                  position: 'relative',
                  marginTop: 20,
                  left: 206,
                  opacity: 0
                }}
              />
            </div>
            <div>
              <img
                id='slide3-1'
                src='/assets/login/login-slide3-1.png'
                style={{ position: 'absolute', top: 145, opacity: 1 }}
              />
              <img
                className={isShowThird ? 'login_cur_third_animation' : ''}
                id='slide3-2'
                src='/assets/login/login-slide3-2.png'
                style={{
                  position: 'relative',
                  marginTop: 95,
                  left: 120,
                  opacity: 0
                }}
              />
            </div>
          </Carousel>
          </div>
          <div
            style={{
              width: 280,
              height: 421,
              margin: '0 auto',
              position: 'relative',
              float: 'right',
              top: '-34em',
              left: '-15%'
            }}
          >
            <div
              style={{
                background: '#fff',
                width: 280,
                height: 370,
                borderRadius: 5,
                boxShadow: '0px 0px 55px',
                padding: '0px 28px'
              }}
            >
              <div className="sysname">
                <span style={{ color: '#43597a' }}>校园跑腿信息平台</span>
              </div>
              <Form
                initialValues={{
                  remember: true,
                }}
                onFinish={_this.login}
              >
                <Tabs className='mintabs-active'>
                  <TabPane tab='账号登录' key='1'>
                    <FormItem
                      name="userName"
                      className='login_form_item'
                      {...formItemLayout}
                      label={<span className={'login_label_color normal_text_size'}>用户名</span>}
                      colon={false}
                      style={{ margin: '0 !important', width: '100%' }}
                    >
                      <Input className={'login_input'} />
                    </FormItem>
                    <FormItem
                      name="userPassword"
                      className='login_form_item'
                      {...formItemLayout}
                      label={
                        <span className={'login_label_color normal_text_size'}>密&emsp;码</span>
                      }
                      colon={false}
                      style={{ margin: '0 !important', width: '100%' }}
                    >
                      <Input className={'login_input'} type='password' />
                    </FormItem>
                    <FormItem
                      name="captcha" 
                      className='login_form_item'
                      {...formItemLayout}
                      label={<span className={'login_label_color normal_text_size'}>验证码</span>}
                      colon={false}
                      style={{ margin: '0 !important', width: '100%' }}
                    >
                      <Input className={'login_input'} maxLength={4} />
                    </FormItem>
                    <img
                      className='account-captcha-img login_verity'
                      src="/assets/login/authcode.jpg"
                    />
                  </TabPane>
                  <TabPane className='normal_text_size' tab='手机号登录' key='2' disabled>

                  </TabPane>
                </Tabs>
                <FormItem className='login_form_item' style={{ textAlign: 'center' }}>
                  <Button
                    className='login-btn normal_text_size'
                    htmlType='submit'
                  >
                    登录
                    </Button>
                </FormItem>
              </Form>
            </div>
            <div style={{ marginTop: '26px',marginLeft:'18px' }}>
              <a
                style={{ color: '#fff', marginRight: '24px' ,fontSize:'13px'}}
                href='http://jnxszx.xsesc.com/Acme/webs/download/ChromeSetup.72_32.exe'
                target='_blank'
              >
                <ChromeOutlined /> 谷歌浏览器下载
              </a>
              <a
                style={{ color: '#fff', fontSize: '13px'}}
                href='http://jnxszx.xsesc.com/Acme/webs/download/360se10.0.1794.0.exe'
                target='_blank'
              >
                <IeOutlined /> 360浏览器下载
              </a>
            </div>
          </div>
        </Col>
        <Col span={24} className="bg_bottom">
            <img style={{display:"inline-block",width:"499px",height:"169px",margin:"0 auto"}}src="/assets/login/login-name.jpg"/>
        </Col>
    </Row>
    );
  }
}

