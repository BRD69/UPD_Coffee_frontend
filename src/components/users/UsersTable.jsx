import React, { useState } from 'react';
import styled from 'styled-components';
import { MdDelete, MdArrowUpward, MdArrowDownward } from 'react-icons/md';

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

    @media (max-width: 768px) {
        display: none;
    }
`;

const MobileCardsContainer = styled.div`
    display: none;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    width: 100%;
    box-sizing: border-box;

    @media (max-width: 768px) {
        display: flex;
    }
`;

const UserCard = styled.div`
    background-color: ${props => props.$verified ? 'rgba(40, 167, 69, 0.08)' : 'white'};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
`;

const CardHeader = styled.div`
    padding: 12px;
    background-color: transparent;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    box-sizing: border-box;
`;

const CardTitle = styled.div`
    display: flex;
    flex-direction: column;
    max-width: calc(100% - 30px);
`;

const CardFullName = styled.span`
    font-weight: 500;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const CardUsername = styled.span`
    color: #6c757d;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const CardContent = styled.div`
    padding: ${props => props.$isOpen ? '12px' : '0'};
    max-height: ${props => props.$isOpen ? '500px' : '0'};
    overflow: hidden;
    transition: all 0.3s ease;
    box-sizing: border-box;
`;

const CardRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #e9ecef;
    box-sizing: border-box;

    &:last-child {
        border-bottom: none;
    }
`;

const CardLabel = styled.span`
    color: #6c757d;
    font-size: 14px;
    flex: 1;
    max-width: 40%;
`;

const CardValue = styled.span`
    font-size: 14px;
    text-align: right;
    flex: 1;
    max-width: 60%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const CardActions = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e9ecef;
    box-sizing: border-box;
`;

const ExpandIcon = styled.span`
    transition: transform 0.3s ease;
    transform: rotate(${props => props.$isOpen ? '180deg' : '0deg'});
    flex-shrink: 0;
    width: 20px;
    text-align: center;
`;

const TableHeader = styled.thead`
    background-color: #f8f9fa;

    @media (max-width: 768px) {
        th:nth-child(4),
        th:nth-child(5) {
            display: none;
        }
    }
`;

const TableRow = styled.tr`
    background-color: ${props => props.$verified ? 'rgba(40, 167, 69, 0.08)' : 'white'};
    &:nth-child(even) {
        background-color: ${props => props.$verified ? 'rgba(40, 167, 69, 0.08)' : '#f8f9fa'};
    }
    &:hover {
        background-color: #e9ecef;
    }
    @media (max-width: 768px) {
        td:nth-child(4),
        td:nth-child(5) {
            display: none;
        }
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

    @media (max-width: 768px) {
        padding: 8px 10px;
    }
`;

const TableCell = styled.td`
    padding: 12px 15px;
    border-bottom: 1px solid #dee2e6;
    color: #212529;

    @media (max-width: 768px) {
        padding: 8px 10px;
    }
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
`;

const UserName = styled.span`
    font-weight: 500;
`;

const UserUsername = styled.span`
    color: #6c757d;
    font-size: 12px;
`;

const VerifiedBadge = styled.span`
    background-color: rgba(40, 167, 69, 0.2);
    color: #28a745;
    padding: 2px 6px;
    border-radius: 50%;
    font-size: 10px;
    margin-left: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 1px solid rgba(40, 167, 69, 0.3);
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

    @media (max-width: 768px) {
        padding: 2px 4px;
        font-size: 12px;
    }
`;

const RemoveFromChannelButton = styled.button`
    background: none;
    border: 1.5px solid #e74c3c;
    color: #e74c3c;
    cursor: pointer;
    padding: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    margin-left: auto;
    transition: background 0.2s, color 0.2s, border-color 0.2s;

    &:hover {
        background-color: #e74c3c;
        color: white;
        border-color: #e74c3c;
    }

    svg {
        width: 16px;
        height: 16px;
        pointer-events: none;
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

const SortIcon = styled.span`
    margin-left: 5px;
    color: ${props => props.$active ? '#3498db' : '#adb5bd'};
    font-size: 12px;
`;

const RoleBadge = styled.span`
    display: inline-block;
    margin-left: 6px;
    padding: 1px 5px;
    border-radius: 5px;
    font-size: 9px;
    font-weight: 600;
    background-color: transparent;
    color: ${props => props.$active ? '#28a745' : '#adb5bd'};
    letter-spacing: 1px;
`;

const UsernameWithBadges = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

const MobileSortContainer = styled.div`
    display: none;
    @media (max-width: 768px) {
        display: flex;
        margin: 10px 0 10px 0;
        justify-content: flex-end;
        padding: 0 18px;
    }
`;

const MobileSortButton = styled.button`
    background: none;
    border: none;
    color: #6c757d;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 0;
    box-shadow: none;
    outline: none;
`;

const MobileSortArrow = styled.span`
    font-size: 16px;
    color: ${props => props.$active ? '#3498db' : '#adb5bd'};
    transition: color 0.2s;
    margin-left: 1px;
    display: flex;
    align-items: center;
`;

const TableActions = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    @media (max-width: 768px) {
        justify-content: space-between;
        gap: 0;
        width: 100%;
    }
`;

const OfficeText = styled.div`
    color: #adb5bd;
    font-size: 13px;
    margin-top: 2px;
`;

const RoleText = styled.div`
    color: #adb5bd;
    font-size: 12px;
    margin-top: 2px;
`;

const UsersTable = ({ users, onEdit, onRemoveFromChannel, onSort, sortConfig }) => {
    const [expandedCards, setExpandedCards] = useState({});

    const toggleCard = (userId) => {
        setExpandedCards(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    return (
        <TableContainer>
            <Table>
                <TableHeader>
                    <tr>
                        <TableHeaderCell onClick={() => handleSort('fio')}>
                            ФИО
                            <SortIcon $active={sortConfig?.key === 'fio'}>
                                {getSortIcon('fio')}
                            </SortIcon>
                        </TableHeaderCell>
                        <TableHeaderCell onClick={() => handleSort('email')}>
                            Email
                            <SortIcon $active={sortConfig?.key === 'email'}>
                                {getSortIcon('email')}
                            </SortIcon>
                        </TableHeaderCell>
                        <TableHeaderCell>Дата рождения</TableHeaderCell>
                        <TableHeaderCell>Город</TableHeaderCell>
                        <TableHeaderCell>Действия</TableHeaderCell>
                    </tr>
                </TableHeader>
                <tbody>
                    {users.map(user => (
                        <TableRow key={user.id} $verified={user.is_verified}>
                            <TableCell>
                                <div style={{ fontWeight: 500, fontSize: 15 }}>
                                    {(user.last_name || '') + ' ' + (user.first_name || '') + ' ' + (user.sur_name || '')}
                                </div>
                                <UsernameWithBadges style={{ marginTop: 2 }}>
                                    <UserUsername>@{user.telegram_username}</UserUsername>
                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: 3 }}>
                                        <RoleBadge $active={user.is_admin}>ADM</RoleBadge>
                                        <RoleBadge $active={user.is_superuser}>SU</RoleBadge>
                                    </div>
                                </UsernameWithBadges>
                                <RoleText>
                                    {user.is_superuser ? 'Суперпользователь' : user.is_admin ? 'Администратор' : 'Пользователь'}
                                </RoleText>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{formatDate(user.birthday)}</TableCell>
                            <TableCell>
                                <div>{user.city}</div>
                                <OfficeText>Офис: {user.office}</OfficeText>
                            </TableCell>
                            <TableCell>
                                <TableActions>
                                    <ActionButton onClick={() => onEdit(user)}>Редактировать</ActionButton>
                                    {!user.is_superuser && (
                                        <RemoveFromChannelButton onClick={() => onRemoveFromChannel(user)}>
                                            <MdDelete />
                                        </RemoveFromChannelButton>
                                    )}
                                </TableActions>
                            </TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </Table>

            {/* Mobile sort button */}
            <MobileSortContainer>
                <MobileSortButton onClick={() => handleSort('fio')}>
                    {sortConfig?.key === 'fio' && sortConfig?.direction === 'asc' ? 'А-Я' : 'Я-А'}
                    <MobileSortArrow $active={sortConfig?.key === 'fio'}>
                        {sortConfig?.key === 'fio' && sortConfig?.direction === 'asc' ? <MdArrowUpward /> : <MdArrowDownward />}
                    </MobileSortArrow>
                </MobileSortButton>
            </MobileSortContainer>
            <MobileCardsContainer>
                {users.map(user => (
                    <UserCard key={user.id} $verified={user.is_verified}>
                        <CardHeader onClick={() => toggleCard(user.id)}>
                            <CardTitle>
                                <CardFullName>
                                    {user.last_name} {user.first_name} {user.sur_name}
                                </CardFullName>
                                <UsernameWithBadges>
                                    <CardUsername>@{user.telegram_username}</CardUsername>
                                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: 3 }}>
                                        <RoleBadge $active={user.is_admin}>ADM</RoleBadge>
                                        <RoleBadge $active={user.is_superuser}>SU</RoleBadge>
                                    </div>
                                </UsernameWithBadges>
                            </CardTitle>
                            <ExpandIcon $isOpen={expandedCards[user.id]}>▼</ExpandIcon>
                        </CardHeader>
                        <CardContent $isOpen={expandedCards[user.id]}>
                            <CardRow>
                                <CardLabel>Email</CardLabel>
                                <CardValue>{user.email}</CardValue>
                            </CardRow>
                            <CardRow>
                                <CardLabel>День рождения</CardLabel>
                                <CardValue>{formatDate(user.birthday)}</CardValue>
                            </CardRow>
                            <CardRow>
                                <CardLabel>Роль</CardLabel>
                                <CardValue>
                                    {user.is_superuser ? 'Суперпользователь' : user.is_admin ? 'Администратор' : 'Пользователь'}
                                </CardValue>
                            </CardRow>
                            <CardRow>
                                <CardLabel>Город</CardLabel>
                                <CardValue>{user.city}</CardValue>
                            </CardRow>
                            <CardRow>
                                <CardLabel>Офис</CardLabel>
                                <CardValue>{user.office}</CardValue>
                            </CardRow>
                            <CardActions>
                                <TableActions>
                                    <ActionButton onClick={() => onEdit(user)}>Редактировать</ActionButton>
                                    {!user.is_superuser && (
                                        <RemoveFromChannelButton
                                            onClick={() => onRemoveFromChannel(user)}
                                            title="Удалить из канала"
                                        >
                                            <MdDelete />
                                        </RemoveFromChannelButton>
                                    )}
                                </TableActions>
                            </CardActions>
                        </CardContent>
                    </UserCard>
                ))}
            </MobileCardsContainer>
        </TableContainer>
    );
};

export default UsersTable;