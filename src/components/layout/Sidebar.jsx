import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { authService } from '../../services/authService';
import {
    MdDashboard,
    MdPostAdd,
    MdPeople
} from 'react-icons/md';
import { useMobileMenu } from '../../context/MobileMenuContext';

const SidebarContainer = styled.div`
    width: 250px;
    background-color: #2c3e50;
    color: white;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    transition: transform 0.3s ease;
    z-index: 1000;
    box-sizing: border-box;

    @media (max-width: 768px) {
        width: 80%;
        max-width: 300px;
        transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    }
`;

const MobileMenuButton = styled.button`
    display: none;
    position: fixed;
    top: 20px;
    left: 20px;
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    z-index: 1001;
    padding: 8px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.2);

    @media (max-width: 768px) {
        display: block;
    }
`;

const Logo = styled.div`
    padding: 20px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    box-sizing: border-box;
`;

const MenuList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
`;

const MenuItem = styled.li`
    margin: 0;
    padding: 0 15px;
    box-sizing: border-box;
`;

const MenuLink = styled(NavLink)`
    display: flex;
    align-items: center;
    padding: 12px 15px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.3s ease;
    border-radius: 8px;
    margin: 5px 0;
    box-sizing: border-box;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        transform: translateX(5px);
    }

    &.active {
        background: rgba(255, 255, 255, 0.15);
        color: white;
        font-weight: 500;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
`;

const MenuIcon = styled.span`
    margin-right: 12px;
    font-size: 20px;
    width: 24px;
    text-align: center;
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    ${MenuLink}:hover & {
        transform: scale(1.1);
    }
`;

const Overlay = styled.div`
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;

    @media (max-width: 768px) {
        display: ${props => props.$isOpen ? 'block' : 'none'};
    }
`;

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu();

    const handleNavigation = (path) => {
        navigate(path);
        toggleMobileMenu();
    };

    const currentUser = authService.getCurrentUser();
    const isSuperUser = currentUser?.is_superuser;

    return (
        <>
            <Overlay $isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
            <SidebarContainer $isOpen={isMobileMenuOpen}>
                <Logo>УПД БЛПС</Logo>
                <MenuList>
                    <MenuItem>
                        <MenuLink to="/admin/dashboard" onClick={() => handleNavigation('/admin/dashboard')}>
                            <MenuIcon><MdDashboard /></MenuIcon>
                            Главная
                        </MenuLink>
                    </MenuItem>
                    <MenuItem>
                        <MenuLink to="/admin/posts" onClick={() => handleNavigation('/admin/posts')}>
                            <MenuIcon><MdPostAdd /></MenuIcon>
                            Посты
                        </MenuLink>
                    </MenuItem>
                    {isSuperUser && (
                        <MenuItem>
                            <MenuLink to="/admin/users" onClick={() => handleNavigation('/admin/users')}>
                                <MenuIcon><MdPeople /></MenuIcon>
                                Пользователи
                            </MenuLink>
                        </MenuItem>
                    )}
                </MenuList>
            </SidebarContainer>
        </>
    );
};

export default Sidebar;