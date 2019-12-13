import axios from 'axios';
// const baseURL = 'http://localhost:8081/api';
const baseURL = 'http://192.168.1.114:8081/api';
// const baseURL = 'http://localHost:4000/api';

const axiosApi = axios.create({
	baseURL,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

let authTokenInterceptor;
let unAuthTokenInterceptor;
export function setAuthInterceptor() {
	authTokenInterceptor = axiosApi.interceptors.request.use(
		config => {
			const token = localStorage.getItem('jwt');
			config.headers['Authorization'] = `Bearer ${token}`;
			return config;
		},
		error => {
			return Promise.reject(error);
		},
	);
}
export function ejectAuthInterceptor() {
	if (authTokenInterceptor) {
		axiosApi.interceptors.request.eject(authTokenInterceptor);
	}
}
export function setUnAuthInterceptor(unAuthUserLocally, dispatch) {
	unAuthTokenInterceptor = axiosApi.interceptors.response.use(
		config => {
			return config;
		},
		error => {
			if (error.response.status === 401) {
				unAuthUserLocally(dispatch);
			}
			return Promise.reject(error);
		},
	);
}
export function ejectUnAuthInterceptor() {
	if (unAuthTokenInterceptor) {
		axiosApi.interceptors.response.eject(authTokenInterceptor);
	}
}
export default axiosApi;
