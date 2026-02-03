import axios from 'axios';
import { api } from '../common/constants';

const instance = axios.create({
    baseURL: api.baseURL,
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 123',
    },
});

instance.interceptors.response.use((res) => res.data);

export default instance;