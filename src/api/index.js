import axios from 'axios';
export const Service = axios.create({
    baseURL: 'https://my-wallet.0l-network.workers.dev/',
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
