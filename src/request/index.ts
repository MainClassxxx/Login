import axios from 'axios'

// 创建axios实例
const service = axios.create({
    baseURL:"http://localhost:8088/user",    // 请求的基础路径
    timeout:5000,   // 请求超时时间
    //请求后返回一个token值
    headers:{
        "Content-Tyoe":"applocation/json;charset=utf-8"
    }
})

//请求拦截
service.interceptors.request.use((config)=>{
    config.headers=config.headers||{}
    if(localStorage.getItem("token")){
        config.headers.token=localStorage.getItem("token")||""
    }
    return config
})

//响应拦截
service.interceptors.response.use((res)=>{
    const code:number=res.data.code
    if(code!=200){
        return Promise.reject(res.data)
    }
    return res.data
}),(err:any)=>{
    console.log(err);
    
}

export default service