import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const HeaderContainer = styled.header`
    height: 60px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    position: fixed;
    top: 0;
    right: 0;
    left: 250px; /* Ширина сайдбара */
    z-index: 100;
`;

const Title = styled.h1`
    font-size: 18px;
    color: #2c3e50;
    margin: 0;
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
`;

const Username = styled.span`
    margin-right: 15px;
    color: #2c3e50;
`;

const LogoutButton = styled.button`
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #c0392b;
    }
`;

const Header = () => {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    return (
        <HeaderContainer>
            <Title>Панель администратора: {currentUser?.telegram_username || 'Гость'}</Title>
            <UserInfo>
                <Username>{currentUser?.telegram_username || 'Гость'}</Username>
                <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
            </UserInfo>
        </HeaderContainer>
    );
};

export default Header;