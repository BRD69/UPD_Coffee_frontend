import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { authService } from '../../services/authService';

const SidebarContainer = styled.div`
    width: 250px;
    height: 100vh;
    background-color: #2c3e50;
    color: white;
    padding: 20px 0;
    position: fixed;
    left: 0;
    top: 0;
`;

const Logo = styled.div`
    padding: 0 20px;
    margin-bottom: 30px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
`;

const MenuList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const MenuItem = styled.li`
    margin-bottom: 5px;
`;

const MenuLink = styled(NavLink)`
    display: block;
    padding: 12px 20px;
    color: #ecf0f1;
    text-decoration: none;
    transition: background-color 0.3s;

    &:hover {
        background-color: #34495e;
    }

    &.active {
        background-color: #3498db;
    }
`;

const Sidebar = () => {
    const currentUser = authService.getCurrentUser();
    const isSuperUser = currentUser?.is_superuser;

    return (
        <SidebarContainer>
            <Logo>Админ-панель</Logo>
            <MenuList>
                <MenuItem>
                    <MenuLink to="/admin/dashboard" end>
                        Главная
                    </MenuLink>
                </MenuItem>
                <MenuItem>
                    <MenuLink to="/admin/posts">
                        Посты
                    </MenuLink>
                </MenuItem>
                {isSuperUser && (
                    <MenuItem>
                        <MenuLink to="/admin/users">
                            Пользователи
                        </MenuLink>
                    </MenuItem>
                )}
            </MenuList>
        </SidebarContainer>
    );
};

export default Sidebar;