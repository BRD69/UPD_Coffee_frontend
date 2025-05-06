import React from 'react';
import styled from 'styled-components';
import { authService } from '../../services/authService';

const ToggleContainer = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
`;

const ToggleButton = styled.button`
    background-color: #2c3e50;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;

    &:hover {
        background-color: #34495e;
    }
`;

const SuperUserToggle = () => {
    const currentUser = authService.getCurrentUser();
    const isSuperUser = currentUser?.is_superuser;

    const toggleSuperUser = () => {
        try {
            if (!currentUser) {
                console.error('Пользователь не найден. Сначала войдите в систему.');
                return;
            }

            // Создаем копию пользователя
            const updatedUser = { ...currentUser };

            // Переключаем роль
            updatedUser.is_superuser = !isSuperUser;

            // Сохраняем обновленные данные
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Перезагружаем страницу для применения изменений
            window.location.reload();
        } catch (error) {
            console.error('Ошибка при переключении роли:', error);
        }
    };

    // Показываем кнопку только в режиме разработки
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <ToggleContainer>
            <ToggleButton onClick={toggleSuperUser}>
                {isSuperUser ? 'Отключить суперпользователя' : 'Включить суперпользователя'}
            </ToggleButton>
        </ToggleContainer>
    );
};

export default SuperUserToggle;