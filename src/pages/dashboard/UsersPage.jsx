import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { userService } from '../../services/userService';
import UsersTable from '../../components/users/UsersTable';
import UserModal from '../../components/users/UserModal';
import { Modal, ModalContent, Button } from '../../components/Modal.jsx';
import { toast } from 'react-hot-toast';
import { MdPersonAdd, MdGroup, MdVerified, MdAdminPanelSettings } from 'react-icons/md';

const Container = styled.div`
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    max-width: 100vw;
    overflow-x: hidden;

    @media (max-width: 768px) {
        padding-left: 0;
        padding-right: 0;
    }
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
    flex-wrap: wrap;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }
`;

const ControlsLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }
`;

const AddButton = styled.button`
    display: flex;
    align-items: center;
    gap: 7px;
    background-color: rgba(52, 152, 219, 0.08);
    color: #3498db;
    border: 1.5px solid #b8d6f4;
    padding: 9px 18px;
    border-radius: 7px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    box-shadow: none;
    transition: background 0.2s, color 0.2s, border 0.2s;
    outline: none;
    &:hover {
        background-color: rgba(52, 152, 219, 0.16);
        color: #217dbb;
        border-color: #7fbce9;
    }
`;

const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
`;

const SearchInputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 220px;
`;

const SearchInput = styled.input`
    padding: 6px 32px 6px 8px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
    margin-right: 0;

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

const ClearButton = styled.button`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #adb5bd;
    font-size: 16px;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    &:hover {
        color: #e74c3c;
    }
`;

const ToggleContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #f8f9fa;
    border-radius: 4px;
    padding: 0 8px 0 2px;
    overflow-x: auto;
    flex-wrap: nowrap;
`;

const ToggleButton = styled.button`
    display: flex;
    align-items: center;
    background-color: ${props =>
        props.$isActive && props.children === 'Верифицированные'
            ? 'rgba(40, 167, 69, 0.08)'
            : props.$isActive
                ? 'rgba(52, 152, 219, 0.08)'
                : 'transparent'};
    color: ${props =>
        props.$isActive && props.children === 'Верифицированные'
            ? '#28a745'
            : props.$isActive
                ? '#3498db'
                : '#495057'};
    border: none;
    padding: 6px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    transition: background-color 0.3s, color 0.3s;
    font-weight: 500;
    flex-shrink: 1;
    min-width: 0;
    &:hover {
        background-color: ${props =>
        props.children === 'Верифицированные'
            ? 'rgba(40, 167, 69, 0.13)'
            : 'rgba(52, 152, 219, 0.13)'};
        color: ${props =>
        props.children === 'Верифицированные'
            ? '#28a745'
            : '#217dbb'};
    }
`;

const ToggleButtonIcon = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-right: 6px;
    @media (max-width: 768px) {
        margin-right: 0;
    }
`;

const ToggleButtonText = styled.span`
    display: inline;
    @media (max-width: 768px) {
        display: none;
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
    const [showAdminsOnly, setShowAdminsOnly] = useState(false);
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

        // Фильтрация по администраторам
        if (showAdminsOnly) {
            result = result.filter(user => user.is_admin || user.is_superuser);
        }

        // Сортировка
        result.sort((a, b) => {
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
    }, [searchTerm, users, showVerifiedOnly, showAdminsOnly, sortConfig]);

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
                        <SearchInputWrapper>
                            <SearchInput
                                type="text"
                                placeholder="Поиск по имени или никнейму..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            {searchTerm && (
                                <ClearButton onClick={() => setSearchTerm(' ')} title="Очистить">
                                    ×
                                </ClearButton>
                            )}
                        </SearchInputWrapper>
                        <ToggleContainer>
                            <ToggleButton
                                $isActive={!showVerifiedOnly && !showAdminsOnly}
                                onClick={() => {
                                    setShowVerifiedOnly(false);
                                    setShowAdminsOnly(false);
                                }}
                            >
                                <ToggleButtonIcon><MdGroup /></ToggleButtonIcon>
                                <ToggleButtonText>Все пользователи</ToggleButtonText>
                            </ToggleButton>
                            <ToggleButton
                                $isActive={showVerifiedOnly}
                                onClick={() => {
                                    setShowVerifiedOnly(true);
                                    setShowAdminsOnly(false);
                                }}
                            >
                                <ToggleButtonIcon><MdVerified /></ToggleButtonIcon>
                                <ToggleButtonText>Верифицированные</ToggleButtonText>
                            </ToggleButton>
                            <ToggleButton
                                $isActive={showAdminsOnly}
                                onClick={() => {
                                    setShowVerifiedOnly(false);
                                    setShowAdminsOnly(true);
                                }}
                            >
                                <ToggleButtonIcon><MdAdminPanelSettings /></ToggleButtonIcon>
                                <ToggleButtonText>Администраторы</ToggleButtonText>
                            </ToggleButton>
                        </ToggleContainer>
                    </SearchContainer>
                </ControlsLeft>
                <AddButton onClick={handleAddUser}>
                    <MdPersonAdd size={20} />
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