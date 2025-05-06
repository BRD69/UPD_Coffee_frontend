import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import PostsPage from './pages/dashboard/PostsPage';
import UsersPage from './pages/dashboard/UsersPage';
import PrivateRoute from './components/common/PrivateRoute';
import HomePage from './pages/HomePage';
import './App.css';
import { Toaster } from 'react-hot-toast';
import NotFoundPage from './pages/NotFoundPage';
import { MobileMenuProvider } from './context/MobileMenuContext';

function App() {
  return (
    <Router>
      <MobileMenuProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<HomePage />} />

          {/* Маршруты админ-панели */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Защищенные маршруты дашборда */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index element={<DashboardHome />} />
          </Route>

          {/* Защищенные маршруты для постов и пользователей */}
          <Route path="/admin/posts" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index element={<PostsPage />} />
          </Route>

          <Route path="/admin/users" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }>
            <Route index element={<UsersPage />} />
          </Route>

          {/* Перенаправление с /admin на /admin/dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Редирект на /admin/login для любых других /admin/... если не авторизован */}
          <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />

          {/* Редирект с /login на /admin/login */}
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />

          {/* Страница 404 для всех некорректных ссылок */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MobileMenuProvider>
    </Router>
  );
}

export default App;
