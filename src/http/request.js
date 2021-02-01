import axios from 'axios'
import { showLoading, hideLoading } from '@/utils/loading'
import * as commonConstants from "@/constants/commonConstants"; //systemConstants系统常量

// create an axios instance
var baseURL = window.location.origin + '/dma' // window.location.origin + process.env.VUE_APP_ENV;
console.log(process.env.VUE_APP_ENV);
class http {
  constructor(API_URL) {
    this.API_URL = API_URL || baseURL
  }
  request(config) {
    axios.defaults.baseURL = this.API_URL
    // axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    const instance = axios.create({
      timeout: 30000,
    });

    // 添加请求拦截器
    instance.interceptors.request.use(function (config) {
      // 是否显示请求loading
      var isLoading;
      if (config.method == 'post') {
          const { ISLOADING = true } = config.data || {}
          isLoading = ISLOADING
          config.data && delete config.data.ISLOADING;
      } else {
          const { ISLOADING = true } = config.params || {}
          isLoading = ISLOADING
          config.params && delete config.params.ISLOADING;
      }

      if (isLoading) {
          showLoading();
      }

      // token
      // if (store.getters.token) {
      //   config.headers['X-Token'] = getToken()
      // }
      return config;
      
    }, function (error) {
      hideLoading();
      return Promise.reject(error)
    });

    // 添加响应拦截器
    instance.interceptors.response.use(function (response) {
      hideLoading();

      const res = response.data

      if (commonConstants.showError(res)) {
        
        //-- Re-Login
        // MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        //   confirmButtonText: 'Re-Login',
        //   cancelButtonText: 'Cancel',
        //   type: 'warning'
        // })
        // return Promise.reject(new Error(res.msg || 'Error'))
        res.msg = 'Error';
        return Promise.reject(res)  // 需写catch,不写的话，前端控制台会报错
      } else {
        return res
      }

    }, function (error) {
      hideLoading();
      return Promise.reject(error);
    });

    // 发送真正的网络请求
    return instance(config)
  }
  get(url, params) {
    return this.request({
      url: url,
      method: 'get',
      params: params
    })
  }
  post(url, params = {}, header) {
    return this.request({
      url: url,
      method: 'post',
      data: params,
      header: header || {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  }
  downloadFile(url) {
    return this.request({
      url: url,
      method: 'get',
      responseType: 'blob'
    })
  }
}
export default http;