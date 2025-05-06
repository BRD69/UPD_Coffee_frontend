import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, API_KEY } from './api.config';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
    },
});

// Добавляем перехватчик для добавления токена к запросам
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        // if (user?.token) {
        //     config.headers.Authorization = `Bearer ${user.token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    async login(username, password) {
        try {
            const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
                username,
                password
            });
            localStorage.setItem('user', JSON.stringify(response.data.data));
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Ошибка при авторизации' };
        }
    },

    async logout() {
        try {
            await api.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        } finally {
            localStorage.removeItem('user');
        }
    },

    async refreshToken() {
        try {
            const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            this.logout();
            throw error;
        }
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    },

    isAuthenticated() {
        return !!this.getCurrentUser();
    }
};