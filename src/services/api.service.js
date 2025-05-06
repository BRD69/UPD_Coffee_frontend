import axios from 'axios';
import { API_BASE_URL, API_KEY } from './api.config';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
    },
});

// Добавляем перехватчик для обработки ошибок
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Если ошибка 401 и это не повторный запрос
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Пытаемся обновить токен
                const user = JSON.parse(localStorage.getItem('user'));
                if (user?.refreshToken) {
                    const response = await api.post('/refresh-token', {
                        refreshToken: user.refreshToken
                    });

                    if (response.data.token) {
                        localStorage.setItem('user', JSON.stringify(response.data));
                        originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Если не удалось обновить токен, выходим из системы
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export const apiService = {
    // GET запрос
    async get(endpoint, params = {}) {
        try {
            const response = await api.get(endpoint, { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    /**
     * Отправка POST-запроса
     * @param {string} endpoint - Конечная точка API
     * @param {Object} data - Данные для отправки
     * @param {Object} config - Дополнительная конфигурация запроса
     * @returns {Promise<Object>} - Ответ от сервера
     */
    async post(endpoint, data, config = {}) {
        try {
            const response = await api.post(endpoint, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    },

    // PUT запрос
    async put(endpoint, data = {}) {
        try {
            const response = await api.put(endpoint, data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // DELETE запрос
    async delete(endpoint) {
        try {
            const response = await api.delete(endpoint);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    /**
     * Загрузка файла на сервер
     * @param {string} endpoint - Конечная точка API для загрузки файла
     * @param {FormData} formData - FormData с файлом
     * @returns {Promise<Object>} - Ответ от сервера
     */
    async uploadFile(endpoint, formData) {
        try {
            const response = await api.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    },

    // Обработка ошибок
    handleError(error) {
        if (error.response) {
            // Сервер вернул ошибку
            return {
                status: error.response.status,
                message: error.response.data.message || 'Произошла ошибка на сервере',
                data: error.response.data
            };
        } else if (error.request) {
            // Запрос был сделан, но ответ не получен
            return {
                status: 0,
                message: 'Не удалось получить ответ от сервера',
                data: null
            };
        } else {
            // Ошибка при настройке запроса
            return {
                status: 0,
                message: 'Ошибка при выполнении запроса',
                data: null
            };
        }
    }
};