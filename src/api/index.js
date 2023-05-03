import axios from 'axios';
export const Service = axios.create({
    baseURL: 'http://100.21.134.51:8080',
    timeout: 1000 * 30,
    headers: {
        'Content-Type': 'application/json',
    },
});
// 添加响应拦截器
Service.interceptors.response.use(
    (response) => {
        let data = response.data;
        return data;
    },
    (error) => {
        // console.log(error);
        return Promise.reject(error);
    }
);
export function post(data) {
    return Service.request({
        data,
        method: 'post',
    });
}
