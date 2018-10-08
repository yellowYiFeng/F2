import Vue from 'vue'
import Axios from 'axios'
import Cookies from 'js-cookie'
import {
  HOST
} from './connection.js'
var  Base64 = require('js-base64').Base64;
// const userId ='c55cff0e-0e26-4e02-86b0-5f86062df101'// util.getQueryStringValue('userId');
// const token ='AE71568572B226DD2286D84F50C057C8CAB395774D8104991E72CB42BD7B7A448BC3F63C8D378DB8'// util.getQueryStringValue('token');
const request = Axios.create({
  baseURL: HOST,
  headers: {
    "Content-Type": "application/json",
  },
});
request.interceptors.request.use(config => {
    var requestData = config.data || {};
    //从缓存中获取level 没有则表示是getRoleLevel接口
    if(Cookies.get('level')){
        requestData.RoleLevel =  Cookies.get('level')
    }
	config.data = {
		data: requestData,
		userId: Cookies.get('userId'),
		token: Cookies.get('token'),
		platform: Cookies.get('platform')
    }
    config.data = Base64.encode(JSON.stringify(config.data));
  return config;
},
err => {
  return Promise.reject(err);
});

request.interceptors.response.use(function (response) {
    if (response.data.status.code == 0) {
       
      return response.data;
    } else {
      return Promise.reject(response.data);
    }
  },
  error => {
    return Promise.reject(error.response.data)
});


Vue.prototype.$axios = request;

export default request;



