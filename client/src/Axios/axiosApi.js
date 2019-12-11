import axios from 'axios';

const instance = axios.create({
	baseURL: 'http://192.168.1.114:8081/api',
	// baseURL: 'http://localHost:4000/api',
});

instance.interceptors.request.use(
	config => {
		const jwt = localStorage.getItem('jwt');
		config.headers['Authorization'] = 'Bearer ' + jwt;
		config.headers['Accept'] = 'application/json';
		config.headers['Content-Type'] = 'application/json';
		return config;
	},
	error => {
		return Promise.reject(error);
	},
);
export default instance;
