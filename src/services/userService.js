import { apiService } from './api.service';
import { API_ENDPOINTS } from './api.config';
import axios from 'axios';

/**
 * Сервис для работы с пользователями
 */
export const userService = {
    /**
     * Получение списка всех пользователей
     * @param {Object} params - Параметры запроса (пагинация, фильтрация и т.д.)
     * @returns {Promise<Array>} - Список пользователей
     */
    async getUsers(params = {}) {
        try {
            return await apiService.get(API_ENDPOINTS.USERS.LIST, params);
        } catch (error) {
            console.error('Ошибка при получении списка пользователей:', error);
            throw error;
        }
    },

    /**
     * Получение списка всех верифицированных пользователей
     * @param {Object} params - Параметры запроса (пагинация, фильтрация и т.д.)
     * @returns {Promise<Array>} - Список верифицированных пользователей
     */
    async getVerifiedUsers(params = {}) {
        try {
            return await apiService.get(API_ENDPOINTS.USERS.LIST_VERIFIED, params);
        } catch (error) {
            console.error('Ошибка при получении списка верифицированных пользователей:', error);
            throw error;
        }
    },

    /**
     * Получение списка всех пользователей с ФИО
     * @returns {Promise<Array>} - Список пользователей
     */
    async getUsersOnlyFio() {
        try {
            return await apiService.get(API_ENDPOINTS.USERS.LIST_ONLY_FIO);
        } catch (error) {
            console.error('Ошибка при получении списка пользователей с ФИО:', error);
            throw error;
        }
    },

    /**
     * Получение информации о пользователе по ID
     * @param {number|string} userId - ID пользователя
     * @returns {Promise<Object>} - Информация о пользователе
     */
    async getUserById(userId) {
        try {
            return await apiService.get(API_ENDPOINTS.USERS.GET(userId));
        } catch (error) {
            console.error(`Ошибка при получении пользователя с ID ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Создание нового пользователя
     * @param {Object} userData - Данные нового пользователя
     * @returns {Promise<Object>} - Созданный пользователь
     */
    async createUser(userData) {
        try {
            return await apiService.post(API_ENDPOINTS.USERS.CREATE, userData);
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
            throw error;
        }
    },

    /**
     * Обновление информации о пользователе
     * @param {number|string} userId - ID пользователя
     * @param {Object} userData - Новые данные пользователя
     * @returns {Promise<Object>} - Обновленный пользователь
     */
    async updateUser(userId, userData) {
        try {
            return await apiService.put(API_ENDPOINTS.USERS.UPDATE(userId), userData);
        } catch (error) {
            console.error(`Ошибка при обновлении пользователя с ID ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Удаление пользователя
     * @param {number|string} userId - ID пользователя
     * @returns {Promise<Object>} - Результат удаления
     */
    async deleteUser(userId) {
        try {
            return await apiService.delete(API_ENDPOINTS.USERS.DELETE(userId));
        } catch (error) {
            console.error(`Ошибка при удалении пользователя с ID ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Поиск пользователей
     * @param {string} query - Поисковый запрос
     * @returns {Promise<Array>} - Список найденных пользователей
     */
    async searchUsers(query) {
        try {
            return await apiService.get(API_ENDPOINTS.USERS.LIST, { search: query });
        } catch (error) {
            console.error('Ошибка при поиске пользователей:', error);
            throw error;
        }
    },

    /**
     * Получение профиля текущего пользователя
     * @returns {Promise<Object>} - Информация о текущем пользователе
     */
    async getCurrentUser() {
        try {
            return await apiService.get(API_ENDPOINTS.USERS.PROFILE);
        } catch (error) {
            console.error('Ошибка при получении профиля пользователя:', error);
            throw error;
        }
    },

    /**
     * Получение статистики пользователя
     * @param {number|string} userId - ID пользователя
     * @returns {Promise<Object>} - Статистика пользователя
     */
    async getUserStats(userId) {
        try {
            return await apiService.get(`${API_ENDPOINTS.USERS.GET(userId)}/stats`);
        } catch (error) {
            console.error(`Ошибка при получении статистики пользователя с ID ${userId}:`, error);
            throw error;
        }
    },

    async removeFromChannel(userId) {
        try {
            const response = await axios.delete(`${API_URL}/users/${userId}/remove-from-channel`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};