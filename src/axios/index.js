import axios from 'axios'
import {Modal} from 'antd'
export default class Axios{
    static ajax(options){
      let loading;
      if(options.data && options.data.isShowLoading !=false){
        loading = document.getElementById('ajaxLoading');
        loading.style.display = 'block';
      }
      let baseApi = '/v1/admin'
      return new Promise((resolve,reject)=>{
        axios({
          url:options.url,
          method:options.method,
          data: {
            ...options.data
          },
          // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          baseURL:baseApi,
          timeout:5000,
          params:(options.data && options.data.params) ||''
        }).then((response)=>{
          if(options.data && options.data.isShowLoading !=false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'none';
          }
          if(response.status == '200'){
              let res = response.data;
              if(res.code == '200'){
                  resolve(res);
              } else{
                Modal.error({
                  title:"提示",
                  content:res.msg
                })
              }
          } else{
            reject(response.data);
          }
        })
      });
    }
}