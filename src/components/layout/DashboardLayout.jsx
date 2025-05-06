import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';
import SuperUserToggle from '../common/SuperUserToggle';

const LayoutContainer = styled.div`
    display: flex;
    min-height: 100vh;
`;

const MainContent = styled.main`
    flex: 1;
    margin-left: 250px; /* Ширина сайдбара */
    padding: 80px 20px 20px; /* Отступ сверху для заголовка */
`;

const DashboardLayout = () => {
    return (
        <LayoutContainer>
            <Sidebar />
            <Header />
            <MainContent>
                <Outlet />
            </MainContent>
            <SuperUserToggle />
        </LayoutContainer>
    );
};

export default DashboardLayout;