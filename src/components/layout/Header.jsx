import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { MdLogout } from 'react-icons/md';
import { useMobileMenu } from '../../context/MobileMenuContext';

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

    @media (max-width: 768px) {
        left: 0;
        padding: 0 15px;
        justify-content: space-between;
    }
`;

const MobileMenuButton = styled.button`
    display: none;
    background: none;
    border: none;
    color: #2c3e50;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    margin-right: 15px;
    position: absolute;
    left: 15px;

    @media (max-width: 768px) {
        display: block;
    }
`;

const Title = styled.h1`
    font-size: 18px;
    color: #2c3e50;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    text-align: center;
    padding: 0 10px;

    @media (max-width: 768px) {
        font-size: 16px;
        max-width: 150px;
        text-align: left;
        margin-left: 40px;
    }

    @media (max-width: 480px) {
        font-size: 14px;
        max-width: 120px;
    }
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    flex-shrink: 0;

    @media (max-width: 768px) {
        gap: 10px;
        position: absolute;
        right: 15px;
    }
`;

const Username = styled.span`
    color: #2c3e50;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;

    @media (max-width: 768px) {
        max-width: 80px;
        font-size: 14px;
    }
`;

const LogoutButton = styled.button`
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    transition: color 0.3s;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;

    &:hover {
        color: #c0392b;
    }

    @media (max-width: 768px) {
        padding: 6px;
        font-size: 18px;
    }
`;

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = authService.getCurrentUser();
    const { toggleMobileMenu } = useMobileMenu();

    const getPageTitle = () => {
        const pathToTitle = {
            '/admin/dashboard': 'Главная',
            '/admin/posts': 'Посты',
            '/admin/users': 'Пользователи'
        };
        return pathToTitle[location.pathname] || 'УПД БЛПС';
    };

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    return (
        <HeaderContainer>
            <MobileMenuButton onClick={toggleMobileMenu}>☰</MobileMenuButton>
            <Title>{getPageTitle()}</Title>
            <UserInfo>
                <Username>{currentUser?.telegram_username || 'Гость'}</Username>
                <LogoutButton onClick={handleLogout} title="Выйти">
                    <MdLogout />
                </LogoutButton>
            </UserInfo>
        </HeaderContainer>
    );
};

export default Header;