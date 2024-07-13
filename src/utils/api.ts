import { fi } from "element-plus/es/locale";
import request from "../utils/request";

export function register(data: any) {
    return request({
        url: 'api/register/',
        method: 'post',
        data: data,
    })
}
export function login(data: any) {
    return request({
        url: 'api/login/',
        method: 'post',
        data: data,
    })
}


