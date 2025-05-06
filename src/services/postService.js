import { apiService } from './api.service';
import { API_ENDPOINTS } from './api.config';
import { authService } from './authService';

/**
 * Сервис для работы с постами
 */
export const postService = {
    /**
     * Получение списка всех постов
     * @param {Object} params - Параметры запроса (пагинация, фильтрация и т.д.)
     * @returns {Promise<Array>} - Список постов
     */
    async getPosts(params = {}) {
        try {
            return await apiService.get(API_ENDPOINTS.POSTS.LIST, params);
        } catch (error) {
            console.error('Ошибка при получении списка постов:', error);
            throw error;
        }
    },

    /**
     * Получение поста по ID
     * @param {number|string} postId - ID поста
     * @returns {Promise<Object>} - Информация о посте
     */
    async getPostById(postId) {
        try {
            return await apiService.get(API_ENDPOINTS.POSTS.GET(postId));
        } catch (error) {
            console.error(`Ошибка при получении поста с ID ${postId}:`, error);
            throw error;
        }
    },

    /**
     * Получение постов конкретного пользователя
     * @param {number|string} userId - ID пользователя
     * @param {Object} params - Параметры запроса (пагинация, фильтрация и т.д.)
     * @returns {Promise<Array>} - Список постов пользователя
     */
    async getUserPosts(userId, params = {}) {
        try {
            return await apiService.get(API_ENDPOINTS.POSTS.USER_POSTS(userId), params);
        } catch (error) {
            console.error(`Ошибка при получении постов пользователя с ID ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Создание нового поста
     * @param {Object} postData - Данные нового поста
     * @returns {Promise<Object>} - Созданный пост
     */
    async createPost(postData) {
        try {
            return await apiService.post(API_ENDPOINTS.POSTS.CREATE, postData);
        } catch (error) {
            console.error('Ошибка при создании поста:', error);
            throw error;
        }
    },

    /**
     * Обновление поста
     * @param {number|string} postId - ID поста
     * @param {Object} postData - Новые данные поста
     * @returns {Promise<Object>} - Обновленный пост
     */
    async updatePost(postId, postData) {
        try {
            return await apiService.put(API_ENDPOINTS.POSTS.UPDATE(postId), postData);
        } catch (error) {
            console.error(`Ошибка при обновлении поста с ID ${postId}:`, error);
            throw error;
        }
    },

    /**
     * Удаление поста
     * @param {number|string} postId - ID поста
     * @returns {Promise<Object>} - Результат удаления
     */
    async deletePost(postId) {
        try {
            return await apiService.delete(API_ENDPOINTS.POSTS.DELETE(postId));
        } catch (error) {
            console.error(`Ошибка при удалении поста с ID ${postId}:`, error);
            throw error;
        }
    },

    /**
     * Публикация поста
     * @param {number|string} postId - ID поста
     * @returns {Promise<Object>} - Результат публикации
     */
    async publishPost(postId) {
        try {
            return await apiService.post(API_ENDPOINTS.POSTS.PUBLISH(postId));
        } catch (error) {
            console.error(`Ошибка при публикации поста с ID ${postId}:`, error);
            throw error;
        }
    },

    /**
     * Загрузка изображения для поста
     * @param {File} imageFile - Файл изображения
     * @param {string} color - Цвет рамки изображения
     * @returns {Promise<Object>} - Информация о загруженном изображении
     */
    async uploadImage(imageFile, color) {
        try {
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('color', color);

            return await apiService.uploadFile(API_ENDPOINTS.POSTS.UPLOAD_IMAGE, formData);
        } catch (error) {
            console.error('Ошибка при загрузке изображения:', error);
            throw error;
        }
    },

    /**
     * Получение постов с канала
     * @returns {Promise<Array>} - Список постов
     */
    async getPostsFromChannel() {
        try {
            const response = await apiService.get(API_ENDPOINTS.POSTS.POST_CHANNEL);
            console.log('response', response);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении постов с канала:', error);
            throw error;
        }
    },

    /**
     * Форматирование текста поста для Telegram
     * @param {string} text - Исходный текст поста
     * @param {Array} taggedUsers - Массив отмеченных пользователей
     * @param {Array} tags - Массив тегов
     * @param {string} title - Заголовок поста
     * @returns {string} - Отформатированный текст для Telegram
     */
    formatTextForTelegram(text, taggedUsers = [], tags = [], title = '') {
        let formattedText = '';

        // Добавляем заголовок (жирный текст)
        if (title) {
            formattedText += `<strong>${title}</strong>\n`;
        }

        // Добавляем перенос строки после заголовка
        formattedText += '\n';

        // Добавляем основной текст
        formattedText += text;

        // Добавляем перенос строки после основного текста
        formattedText += '\n';

        // Добавляем отмеченных пользователей
        if (taggedUsers.length > 0) {
            taggedUsers.forEach(user => {
                formattedText += `@${user.username} `;
            });
        }

        // Добавляем два переноса строки
        formattedText += '\n\n';

        // Добавляем теги
        if (tags.length > 0) {
            tags.forEach(tag => {
                formattedText += `#${tag} `;
            });
        }

        return formattedText;
    },

    /**
     * Подготовка данных поста для отправки на сервер
     * @param {Object} postData - Данные поста
     * @param {string} postData.title - Заголовок поста
     * @param {string} postData.content - Содержимое поста
     * @param {Array} postData.tags - Теги поста
     * @param {Array} postData.taggedUsers - Отмеченные пользователи
     * @param {File} postData.image - Изображение поста
     * @param {string} color - Цвет рамки изображения
     * @returns {Promise<Object>} - Данные поста, готовые для отправки
     */
    async preparePostData(postData, color, scheduledDate = null) {
        const { title, content, tags, taggedUsers, image } = postData;

        // Получаем текущего авторизованного пользователя
        const currentUser = authService.getCurrentUser();
        const userTelegramId = currentUser?.telegram_id;

        // Форматируем текст для Telegram
        const resultContent = this.formatTextForTelegram(content, taggedUsers, tags, title);

        // Загружаем изображение, если оно есть
        let imageUrl = { 'file_path': '', 'file_url': '', 'filename': '' };
        if (image) {
            const uploadResult = await this.uploadImage(image, color);
            console.log('uploadResult', uploadResult);
            imageUrl = uploadResult.data;
        }

        let return_data = {
            title,
            content: resultContent,
            image_path: imageUrl,
            user_telegram_id: userTelegramId,
            color_border: color,
        };
        
        if (scheduledDate) {
            return_data.date_publish = scheduledDate;
        }

        // Формируем данные для отправки
        return return_data;
    },
};