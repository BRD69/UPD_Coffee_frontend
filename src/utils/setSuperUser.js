/**
 * Устанавливает роль суперпользователя в локальном хранилище
 * Использование:
 * 1. Импортируйте этот файл в консоли браузера
 * 2. Вызовите функцию setSuperUser()
 */
export const setSuperUser = () => {
    try {
        // Получаем текущего пользователя
        const userStr = localStorage.getItem('user');

        if (!userStr) {
            console.error('Пользователь не найден в localStorage. Сначала войдите в систему.');
            return false;
        }

        // Парсим данные пользователя
        const user = JSON.parse(userStr);

        // Устанавливаем роль суперпользователя
        user.role = 'superuser';

        // Сохраняем обновленные данные
        localStorage.setItem('user', JSON.stringify(user));

        console.log('Роль суперпользователя успешно установлена!');
        console.log('Текущий пользователь:', user);

        // Перезагружаем страницу для применения изменений
        window.location.reload();

        return true;
    } catch (error) {
        console.error('Ошибка при установке роли суперпользователя:', error);
        return false;
    }
};

// Автоматически выполняем функцию при импорте
setSuperUser();