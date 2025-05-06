import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
    <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0e7ef 0%, #f8fafc 100%)',
        color: '#2c3e50',
        padding: '24px'
    }}>
        <div style={{ fontSize: '72px', marginBottom: '12px' }}>🚫</div>
        <h1 style={{ fontSize: '56px', margin: 0, fontWeight: 800, letterSpacing: '2px' }}>404</h1>
        <p style={{ fontSize: '20px', margin: '16px 0 32px 0', color: '#7f8c8d' }}>Страница не найдена</p>
        <Link
            to="/"
            style={{
                display: 'inline-block',
                padding: '12px 32px',
                background: '#1976d2',
                color: '#fff',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '18px',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
                transition: 'background 0.2s, box-shadow 0.2s',
            }}
        >
            На главную
        </Link>
    </div>
);

export default NotFoundPage;