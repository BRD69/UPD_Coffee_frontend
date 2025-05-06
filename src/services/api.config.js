// Базовый URL API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Ключ API
export const API_KEY = import.meta.env.VITE_API_KEY;

// Эндпойнты API
export const API_ENDPOINTS = {
    // Аутентификация
    AUTH: {
        LOGIN: '/login',
        LOGOUT: '/logout',
        REFRESH_TOKEN: '/refresh-token',
        REGISTER: '/register',
    },

    // Пользователи
    USERS: {
        PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile/update',
        CHANGE_PASSWORD: '/users/change-password',
        LIST: '/users',
        LIST_VERIFIED: '/users/verified',
        LIST_ONLY_FIO: '/users/only-fio',
        GET: (id) => `/users/${id}`,
        CREATE: '/users',
        UPDATE: (id) => `/users/${id}`,
        DELETE: (id) => `/users/${id}`,
    },

    // Посты
    POSTS: {
        LIST: '/posts',
        GET: (id) => `/posts/${id}`,
        CREATE: '/posts',
        UPDATE: (id) => `/posts/${id}`,
        DELETE: (id) => `/posts/${id}`,
        USER_POSTS: (userId) => `/users/${userId}/posts`,
        UPLOAD_IMAGE: '/posts/upload-image',
        POST_CHANNEL: '/posts/channel',
        PUBLISH: (id) => `/posts/${id}/publish`,
    },
};