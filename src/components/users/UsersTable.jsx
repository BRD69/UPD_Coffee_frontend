import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
    overflow-x: auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    table-layout: fixed;
`;

const TableHeader = styled.thead`
    background-color: #f8f9fa;
`;

const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f8f9fa;
    }

    &:hover {
        background-color: #e9ecef;
    }
`;

const TableHeaderCell = styled.th`
    padding: 12px 15px;
    text-align: left;
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
    cursor: pointer;
    position: relative;

    &:hover {
        background-color: #e9ecef;
    }
`;

const SortIcon = styled.span`
    margin-left: 5px;
    color: ${props => props.$active ? '#3498db' : '#adb5bd'};
    font-size: 12px;
`;

const TableCell = styled.td`
    padding: 12px 15px;
    border-bottom: 1px solid #dee2e6;
    color: #212529;
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    color: #3498db;
    cursor: pointer;
    padding: 4px 8px;
    font-size: 13px;
    transition: color 0.2s;

    &:hover {
        color: #2980b9;
    }
`;

const RemoveFromChannelButton = styled.button`
    background: none;
    border: 1px solid #e74c3c;
    color: #e74c3c;
    cursor: pointer;
    padding: 6px;
    font-size: 14px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    margin: 0 auto;

    &:hover {
        background-color: #e74c3c;
        color: white;
    }

    svg {
        width: 20px;
        height: 20px;
    }
`;

const StatusBadge = styled.span`
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    min-width: 80px;
`;

const BooleanBadge = styled(StatusBadge)`
    background-color: ${props => props.value ? '#d4edda' : '#f8d7da'};
    color: ${props => props.value ? '#155724' : '#721c24'};
`;

// Иконка верификации
const VerificationIcon = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${props => props.$verified ? '#d4edda' : '#f8d7da'};
    color: ${props => props.$verified ? '#155724' : '#721c24'};
    font-size: 14px;
    font-weight: bold;
`;

const UsersTable = ({ users, onEdit, onDelete, onRemoveFromChannel, onSort, sortConfig }) => {
    // Функция для форматирования даты в формат DD.MM.YYYY
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    const handleSort = (key) => {
        if (onSort) {
            onSort(key);
        }
    };

    const getSortIcon = (key) => {
        if (sortConfig && sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? '↑' : '↓';
        }
        return '↕';
    };

    return (
        <TableContainer>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell
                            className="verification-cell"
                            onClick={() => handleSort('is_verified')}
                        >
                            Вер.
                            <SortIcon $active={sortConfig?.key === 'is_verified'}>
                                {getSortIcon('is_verified')}
                            </SortIcon>
                        </TableHeaderCell>
                        <TableHeaderCell onClick={() => handleSort('telegram_username')}>
                            Никнейм
                            <SortIcon $active={sortConfig?.key === 'telegram_username'}>
                                {getSortIcon('telegram_username')}
                            </SortIcon>
                        </TableHeaderCell>
                        <TableHeaderCell onClick={() => handleSort('fio')}>
                            ФИО
                            <SortIcon $active={sortConfig?.key === 'fio'}>
                                {getSortIcon('fio')}
                            </SortIcon>
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Дата рождения
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Город
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Офис
                        </TableHeaderCell>
                        <TableHeaderCell onClick={() => handleSort('is_admin')}>
                            ADM
                            <SortIcon $active={sortConfig?.key === 'is_admin'}>
                                {getSortIcon('is_admin')}
                            </SortIcon>
                        </TableHeaderCell>
                        <TableHeaderCell onClick={() => handleSort('is_superuser')}>
                            SU
                            <SortIcon $active={sortConfig?.key === 'is_superuser'}>
                                {getSortIcon('is_superuser')}
                            </SortIcon>
                        </TableHeaderCell>
                        <TableHeaderCell onClick={() => handleSort('is_active')}>
                            Активный
                            <SortIcon $active={sortConfig?.key === 'is_active'}>
                                {getSortIcon('is_active')}
                            </SortIcon>
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Действия
                        </TableHeaderCell>
                        <TableHeaderCell>
                            Удалить из канала
                        </TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <tbody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <VerificationIcon $verified={user.is_verified}>
                                    {user.is_verified ? '✓' : '✕'}
                                </VerificationIcon>
                            </TableCell>
                            <TableCell>{user.telegram_username}</TableCell>
                            <TableCell>{user.last_name} {user.first_name} {user.sur_name}</TableCell>
                            <TableCell>{formatDate(user.date_of_birth)}</TableCell>
                            <TableCell>{user.city}</TableCell>
                            <TableCell>{user.office}</TableCell>
                            <TableCell>
                                <BooleanBadge value={user.is_admin}>
                                    {user.is_admin ? 'Да' : 'Нет'}
                                </BooleanBadge>
                            </TableCell>
                            <TableCell>
                                <BooleanBadge value={user.is_superuser}>
                                    {user.is_superuser ? 'Да' : 'Нет'}
                                </BooleanBadge>
                            </TableCell>
                            <TableCell>
                                <BooleanBadge value={user.is_active}>
                                    {user.is_active ? 'Да' : 'Нет'}
                                </BooleanBadge>
                            </TableCell>
                            <TableCell>
                                <ActionButton onClick={() => onEdit(user)}>
                                    Редактировать
                                </ActionButton>
                                <ActionButton onClick={() => onDelete(user)}>
                                    Удалить
                                </ActionButton>
                            </TableCell>
                            <TableCell>
                                <RemoveFromChannelButton
                                    onClick={() => onRemoveFromChannel(user)}
                                    title="Удалить пользователя из канала"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
                                    </svg>
                                </RemoveFromChannelButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>
        </TableContainer>
    );
};

export default UsersTable;