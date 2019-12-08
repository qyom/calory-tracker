import axios from 'axios';

const instance = axios.create({
	// baseURL: 'http://192.168.1.114:8081/api',
	baseURL: 'http://localHost:4000/api',
});

export default instance;
