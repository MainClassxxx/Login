//定义接口
export interface LoginFromInt{
    uname:string
    password:string
}
//定义类,导出
export class LoginData {
    //实例化
    ruleForm:LoginFromInt={
        uname:"",
        password:""
    }
}