import axios from 'axios';
import { errorCodeType } from '../utils/error-code-type'
import { ElMessage, ElLoading } from 'element-plus';
import { AxiosRequestConfig,AxiosResponse } from 'axios';

//创建axios实例
const service = axios.create({
    //服务接口请求
    // baseURL: process.env.VUE_APP_BASE_API,
    baseURL:"http://localhost:8088/user",

    //超时时间
    timeout:1500,

    headers:{
        'Content-Type':'application/json;charset=utf-8'
    }
})

let loading:any;
//正在请求的数量
let requestCount=0
//显示loading
const showLoading = () => {
    if(requestCount ===0&&!loading){
        loading = ElLoading.service({
            text:"正在拼命加载，请稍后...",
            background:"rgba(0,0,0,0,0.1)",
            spinner:'el-icon-Loading',
        })
    }
    requestCount++;
}

//隐藏loading
const hideLoading = () =>{
    requestCount--;
    if(requestCount ===0){
        loading.close()
    }
}

//请求拦截器
service.interceptors.request.use(config => {
    showLoading();
    //是否需要设置token
    //config.headers['Authorization] = 'Bearer '+getToken() //让每个请求携带自定义token 
    //get请求映射params参数
    if(config.method === 'get' && config.params){
        let url = config.url + '?';
        for(const propName of Object.keys(config.params)){
            const value = config.params[propName];
            const part = encodeURIComponent(propName) + "=";
            if(value !==null &&typeof (value) !== "undefined"){
                if(typeof value === "object") {
                    for(const key of Object.keys(value)){
                        const params = propName + '['+key+']';
                        const subPart = encodeURIComponent(params)+"=";
                        url += subPart +encodeURIComponent(value[key])+"&";
                    }
                } else {
                    url += part + encodeURIComponent(value)+"&";
                }
            }
        }
        url = url.slice(0,-1);
        config.params = {};
        config.url = url;
    }
    return config;
},error => {
    console.log(error);
    Promise.reject(error);
});

//响应拦截器
service.interceptors.response.use((res: any)=>{
    hideLoading()
    //未设置状态码啧默认成功状态
    const code = res.data['code']||200;

    //获取错误信息
    const msg = errorCodeType(code)||res.data['msg']||errorCodeType('default');
    if(code === 200||code === '0') {
        return Promise.resolve(res.data);

    } else {
        ElMessage.error(msg);
        return Promise.reject(res.data)
    }
},error=>{
    console.log('err'+error)
    hideLoading()
    let { message } = error;
    if(message == "Network Error") {
        message = "后端接口链接异常"
    }
    else if(message.includee("timeout")){
        message = "系统接口请求超时";
    }
    else if(message.includes(" Request failed with status code ")){
        message = "系统接口"+message.substr(message.length-3)+"异常";
    }
    ElMessage.error({
        message:message,
        duration:5*1000
    })
    return Promise.reject(error)
}
)
export default service;