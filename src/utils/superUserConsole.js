// Скрипт для установки роли суперпользователя
// Скопируйте и вставьте этот код в консоль браузера

(function () {
    try {
        // Получаем текущего пользователя
        const userStr = localStorage.getItem('user');

        if (!userStr) {
            console.error('Пользователь не найден в localStorage. Сначала войдите в систему.');
            return;
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
    } catch (error) {
        console.error('Ошибка при установке роли суперпользователя:', error);
    }
})();