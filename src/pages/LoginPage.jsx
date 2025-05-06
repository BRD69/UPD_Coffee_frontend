import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authService } from '../services/authService';

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
`;

const LoginForm = styled.form`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
`;

const Title = styled.h1`
    text-align: center;
    color: #333;
    margin-bottom: 2rem;
`;

const FormGroup = styled.div`
    margin-bottom: 1rem;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: #4a90e2;
    }
`;

const Button = styled.button`
    width: 100%;
    padding: 0.75rem;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #357abd;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.div`
    color: #dc3545;
    margin-top: 1rem;
    text-align: center;
`;

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const userData = await authService.login(username, password);
            console.log('Login successful, user data:', userData);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'Ошибка при авторизации');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LoginContainer>
            <LoginForm onSubmit={handleSubmit}>
                <Title>Вход в систему</Title>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <FormGroup>
                    <Label htmlFor="username">Логин</Label>
                    <Input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </FormGroup>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Вход...' : 'Войти'}
                </Button>
            </LoginForm>
        </LoginContainer>
    );
};

export default LoginPage;