import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';
import SuperUserToggle from '../common/SuperUserToggle';

const LayoutContainer = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: #f5f6fa;
`;

const MainContent = styled.main`
    flex: 1;
    margin-left: 250px;
    padding-top: 60px;
    padding-bottom: 20px;
    padding-left: 20px;
    padding-right: 20px;

    @media (max-width: 768px) {
        margin-left: 0;
        padding: 60px 15px 20px;
    }
`;

const DashboardLayout = ({ children }) => {
    return (
        <LayoutContainer>
            <Sidebar />
            <MainContent>
                <Header />
                <Outlet />
            </MainContent>
            <SuperUserToggle />
        </LayoutContainer>
    );
};

export default DashboardLayout;