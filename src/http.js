import axios from 'axios'
//开发 Vue 插件 设置拦截器
import { Message } from 'element-ui';
const HttpServer = {}
HttpServer.install = function (Vue) {

    axios.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        // axios拦截器 请求路径不是login的请求 都设置登录后的token
        if (config.url !== 'login') {
            const AUTH_TOKEN = localStorage.getItem("token");
            config.headers["Authorization"] = AUTH_TOKEN;
        }
        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });
    // 响应拦截器
    axios.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        const {meta:{status,msg}} = response.data
        if(status !== 200 && status !==201) {
                Message.error(msg)
        }
        return response;
      }, function (error) {
        // 对响应错误做点什么
        return Promise.reject(error);
      });
    //设置token

    axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    Vue.prototype.$http = axios

}
export default HttpServer;