import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { userService } from '../../services/userService';
import UsersTable from '../../components/users/UsersTable';
import UserModal from '../../components/users/UserModal';
import { Modal, ModalContent, Button } from '../../components/Modal.jsx';
import { toast } from 'react-hot-toast';

const Container = styled.div`
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
`;

const Title = styled.h2`
    color: #2c3e50;
    margin-bottom: 20px;
`;

const ControlsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const ControlsLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const AddButton = styled.button`
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #2980b9;
    }
`;

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
`;

const SearchInput = styled.input`
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
    width: 250px;
    margin-right: 10px;

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.25);
    }
`;

const SearchIcon = styled.span`
    color: #6c757d;
    margin-right: 8px;
`;

const ToggleContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #f8f9fa;
    border-radius: 4px;
    padding: 5px;
`;

const ToggleButton = styled.button`
    background-color: ${props => props.$isActive ? '#3498db' : 'transparent'};
    color: ${props => props.$isActive ? 'white' : '#495057'};
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;

    &:hover {
        background-color: ${props => props.$isActive ? '#2980b9' : '#e9ecef'};
    }
`;

const LoadingSpinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 18px;
    color: #6c757d;
`;

const ErrorMessage = styled.div`
    color: #e74c3c;
    padding: 10px;
    background-color: #fdf3f2;
    border-radius: 4px;
    margin-bottom: 20px;
`;

const ConfirmModal = styled(Modal)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ConfirmModalContent = styled(ModalContent)`
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
    padding: 20px;
    margin: 20px;
`;

const ConfirmModalTitle = styled.h3`
    margin: 0 0 15px 0;
    color: #2c3e50;
    font-size: 18px;
`;

const ConfirmModalText = styled.p`
    margin: 0 0 20px 0;
    color: #34495e;
    font-size: 14px;
    line-height: 1.5;
`;

const ConfirmModalButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

const ConfirmButton = styled(Button)`
    background-color: #e74c3c;
    color: white;
    border: none;

    &:hover {
        background-color: #c0392b;
    }
`;

const CancelButton = styled(Button)`
    background-color: #95a5a6;
    color: white;
    border: none;

    &:hover {
        background-color: #7f8c8d;
    }
`;

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
    const [sortConfig, setSortConfig] = useState({
        key: 'sortPriority',
        direction: 'desc'
    });
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);

    // Загрузка пользователей при монтировании компонента
    useEffect(() => {
        fetchUsers();
    }, []);

    // Сортировка и фильтрация пользователей
    useEffect(() => {
        let result = [...users];

        // Фильтрация по поисковому запросу
        if (searchTerm.trim() !== '') {
            result = result.filter(user =>
                (user.fio && user.fio.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (user.telegram_username && user.telegram_username.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Фильтрация по верификации
        if (showVerifiedOnly) {
            result = result.filter(user => user.is_verified);
        }

        // Сортировка
        result.sort((a, b) => {
            // Сначала сортируем по приоритету (суперпользователи, администраторы, остальные)
            const priorityA = getPriority(a);
            const priorityB = getPriority(b);

            if (priorityA !== priorityB) {
                return priorityB - priorityA;
            }

            // Затем по выбранному полю
            if (sortConfig.key === 'fio') {
                const fioA = (a.last_name || '') + ' ' + (a.first_name || '') + ' ' + (a.sur_name || '');
                const fioB = (b.last_name || '') + ' ' + (b.first_name || '') + ' ' + (b.sur_name || '');
                return sortConfig.direction === 'asc'
                    ? fioA.localeCompare(fioB)
                    : fioB.localeCompare(fioA);
            }

            if (sortConfig.key === 'telegram_username') {
                const usernameA = a.telegram_username || '';
                const usernameB = b.telegram_username || '';
                return sortConfig.direction === 'asc'
                    ? usernameA.localeCompare(usernameB)
                    : usernameB.localeCompare(usernameA);
            }

            if (sortConfig.key === 'is_verified') {
                return sortConfig.direction === 'asc'
                    ? (a.is_verified ? 1 : 0) - (b.is_verified ? 1 : 0)
                    : (b.is_verified ? 1 : 0) - (a.is_verified ? 1 : 0);
            }

            if (sortConfig.key === 'is_admin') {
                return sortConfig.direction === 'asc'
                    ? (a.is_admin ? 1 : 0) - (b.is_admin ? 1 : 0)
                    : (b.is_admin ? 1 : 0) - (a.is_admin ? 1 : 0);
            }

            if (sortConfig.key === 'is_superuser') {
                return sortConfig.direction === 'asc'
                    ? (a.is_superuser ? 1 : 0) - (b.is_superuser ? 1 : 0)
                    : (b.is_superuser ? 1 : 0) - (a.is_superuser ? 1 : 0);
            }

            if (sortConfig.key === 'is_active') {
                return sortConfig.direction === 'asc'
                    ? (a.is_active ? 1 : 0) - (b.is_active ? 1 : 0)
                    : (b.is_active ? 1 : 0) - (a.is_active ? 1 : 0);
            }

            return 0;
        });

        setFilteredUsers(result);
    }, [searchTerm, users, showVerifiedOnly, sortConfig]);

    // Функция для определения приоритета пользователя
    const getPriority = (user) => {
        if (user.is_superuser) return 3;
        if (user.is_admin) return 2;
        return 1;
    };

    // Функция для загрузки пользователей
    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await userService.getUsers();
            setUsers(data.data);
        } catch (err) {
            setError('Не удалось загрузить пользователей. Пожалуйста, попробуйте позже.');
            console.error('Ошибка при загрузке пользователей:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user) => {
        // console.log('user', user);
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setModalAction('delete');
        setShowConfirmModal(true);
    };

    const handleSaveUser = async (userData) => {
        try {
            if (selectedUser) {
                // Редактирование существующего пользователя
                console.log('userData', userData);
                await userService.updateUser(selectedUser.id, userData);
            } else {
                // Добавление нового пользователя
                await userService.createUser(userData);
            }
            // Обновляем список пользователей после сохранения
            fetchUsers();
            setIsModalOpen(false);
        } catch (err) {
            alert('Не удалось сохранить пользователя. Пожалуйста, попробуйте позже.');
            console.error('Ошибка при сохранении пользователя:', err);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleToggleVerified = () => {
        setShowVerifiedOnly(!showVerifiedOnly);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleRemoveFromChannel = (user) => {
        setSelectedUser(user);
        setModalAction('removeFromChannel');
        setShowConfirmModal(true);
    };

    const confirmAction = async () => {
        try {
            if (modalAction === 'delete') {
                await userService.deleteUser(selectedUser.id);
                toast.success('Пользователь успешно удален');
            } else if (modalAction === 'removeFromChannel') {
                await userService.removeFromChannel(selectedUser.id);
                toast.success('Пользователь успешно удален из канала');
            }
            setShowConfirmModal(false);
            setSelectedUser(null);
            setModalAction(null);
            fetchUsers();
        } catch (error) {
            console.error(`Error ${modalAction === 'delete' ? 'deleting' : 'removing from channel'} user:`, error);
            toast.error(`Ошибка при ${modalAction === 'delete' ? 'удалении' : 'удалении из канала'} пользователя`);
        }
    };

    const getModalTitle = () => {
        return modalAction === 'delete'
            ? 'Подтверждение удаления пользователя'
            : 'Подтверждение удаления из канала';
    };

    const getModalText = () => {
        return modalAction === 'delete'
            ? `Вы уверены, что хотите удалить пользователя ${selectedUser?.fio}? Это действие нельзя отменить.`
            : `Вы уверены, что хотите удалить пользователя ${selectedUser?.fio} из канала? Это действие нельзя отменить.`;
    };

    return (
        <Container>
            <Title>Управление пользователями</Title>
            <ControlsContainer>
                <ControlsLeft>
                    <SearchContainer>
                        <SearchIcon>🔍</SearchIcon>
                        <SearchInput
                            type="text"
                            placeholder="Поиск по имени или никнейму..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </SearchContainer>
                    <ToggleContainer>
                        <ToggleButton
                            $isActive={!showVerifiedOnly}
                            onClick={() => setShowVerifiedOnly(false)}
                        >
                            Все пользователи
                        </ToggleButton>
                        <ToggleButton
                            $isActive={showVerifiedOnly}
                            onClick={() => setShowVerifiedOnly(true)}
                        >
                            Верифицированные
                        </ToggleButton>
                    </ToggleContainer>
                </ControlsLeft>
                <AddButton onClick={handleAddUser}>
                    Добавить пользователя
                </AddButton>
            </ControlsContainer>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {isLoading ? (
                <LoadingSpinner>Загрузка пользователей...</LoadingSpinner>
            ) : (
                <UsersTable
                    users={filteredUsers}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    onRemoveFromChannel={handleRemoveFromChannel}
                    onSort={handleSort}
                    sortConfig={sortConfig}
                />
            )}

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                user={selectedUser}
            />

            {showConfirmModal && (
                <ConfirmModal>
                    <ConfirmModalContent>
                        <ConfirmModalTitle>{getModalTitle()}</ConfirmModalTitle>
                        <ConfirmModalText>{getModalText()}</ConfirmModalText>
                        <ConfirmModalButtons>
                            <CancelButton onClick={() => {
                                setShowConfirmModal(false);
                                setSelectedUser(null);
                                setModalAction(null);
                            }}>
                                Отмена
                            </CancelButton>
                            <ConfirmButton onClick={confirmAction}>
                                {modalAction === 'delete' ? 'Удалить' : 'Удалить из канала'}
                            </ConfirmButton>
                        </ConfirmModalButtons>
                    </ConfirmModalContent>
                </ConfirmModal>
            )}
        </Container>
    );
};

export default UsersPage;