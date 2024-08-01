import { fi } from "element-plus/es/locale";
import request from "../utils/request";

export function register(data: any) {
    return request({
        url: '/register',
        method: 'post',
        data: data,
    })
}
export function login(data: any) {
    console.log(JSON.stringify(data));
    
    return request({
        url: '/login',
        method: 'post',
        data: data,
    })
}


