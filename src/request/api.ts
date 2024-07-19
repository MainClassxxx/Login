import service from "."

//定义登录接口
interface loginData{
    uname:string,
    password:string
}

//导出登录接口
export function login(data:loginData){
    return service({
        url:"/login",
        method:"post",
        data
    })
}