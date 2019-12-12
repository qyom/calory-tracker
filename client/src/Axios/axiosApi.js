import axios from 'axios';
const baseURL = 'http://localhost:8081/api';
//const baseURL = 'http://192.168.1.114:8081/api';
// const baseURL = 'http://localHost:4000/api';

export const axiosApiPure = axios.create({ baseURL });

const axiosApi = axios.create({ baseURL });
axiosApi.interceptors.request.use(
	config => {
		const jwt = localStorage.getItem('jwt');
		config.headers['Authorization'] = `Bearer ${jwt}`;
		config.headers['Accept'] = 'application/json';
		config.headers['Content-Type'] = 'application/json';
		return config;
	},
	error => {
		return Promise.reject(error);
	},
);
export default axiosApi;
