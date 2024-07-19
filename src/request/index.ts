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
    //确保config.headers存在且为对象，否则新建一个空对象
    config.headers=config.headers||{};
    //检查并设置token
    //先检查 localStorage 中是否存在名为 token 的项
    if(localStorage.getItem("token")){
        //如果存在，则将其复制给 config.headers.token，如果返回null或undefined，则设置为空字符串
        config.headers.token=localStorage.getItem("token")||""
    }
    //返回修改后的config对象
    return config
})

//响应拦截
//res 是服务器返回的响应对象。
service.interceptors.response.use((res)=>{
    //处理成功时响应
    //从响应数据中提取code字段，并赋值给code
    const code:number=res.data.code
    //如果code的值不等于200，则抛出错误
    if(code!=200){
        //返回一个被拒绝的Promise，并将响应数据作为拒绝的原因
        return Promise.reject(res.data)
    }
    //如果等于200，表示请求成功，返回响应数据
    return res.data
}),(err:any)=>{
    //处理错误响应
    console.log(err);
    
}
//导出axios实例
export default service