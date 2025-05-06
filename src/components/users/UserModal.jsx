import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { userService } from '../../services/userService';

// Оверлей модального окна
const ModalOverlay = styled.div`
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

// Контейнер модального окна
const ModalContent = styled.div`
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
`;

const ModalHeader = styled.div`
    padding: 15px 20px;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ModalTitle = styled.h3`
    margin: 0;
    color: #2c3e50;
    font-size: 16px;
    font-weight: 600;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #6c757d;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    transition: background-color 0.2s;

    &:hover {
        background-color: #f8f9fa;
        color: #343a40;
    }
`;

const ModalBody = styled.div`
    padding: 15px 20px;
`;

const FormGroup = styled.div`
    margin-bottom: 15px;
`;

const FormRow = styled.div`
    display: flex;
    gap: 12px;
    margin-bottom: 15px;
`;

const FormColumn = styled.div`
    flex: 1;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    color: #495057;
    font-size: 13px;
`;

const Input = styled.input`
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 13px;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.25);
    }

    &:disabled {
        background-color: #f8f9fa;
        cursor: not-allowed;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 13px;
    background-color: white;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.25);
    }
`;

const ToggleGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 8px;
`;

const ToggleGroupTitle = styled.h4`
    margin: 0 0 8px 0;
    color: #495057;
    font-size: 13px;
    font-weight: 600;
`;

const ToggleItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
`;

const ToggleLabel = styled.label`
    font-size: 13px;
    color: #495057;
    cursor: pointer;
    user-select: none;
`;

const ToggleSwitch = styled.label`
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
`;

const ToggleInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .toggle-slider {
        background-color: #3498db;
    }

    &:checked + .toggle-slider:before {
        transform: translateX(20px);
    }

    &:focus + .toggle-slider {
        box-shadow: 0 0 1px #3498db;
    }

    &:not(:checked) + .toggle-slider {
        background-color: #ced4da;
    }

    &:not(:checked) + .toggle-slider:before {
        transform: translateX(0);
    }
`;

const ToggleSlider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ced4da;
    transition: .4s;
    border-radius: 20px;

    &:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;

const PasswordContainer = styled.div`
    display: flex;
    gap: 8px;
    position: relative;
`;

const PasswordInput = styled(Input)`
    padding-right: 70px;
`;

const PasswordButton = styled.button`
    background: none;
    border: none;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #6c757d;
    transition: color 0.2s;

    &:hover {
        color: #495057;
    }
`;

const PasswordButtonGroup = styled.div`
    display: flex;
    gap: 4px;
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
`;

const GenerateButton = styled.button`
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
    border-radius: 6px;
    padding: 0 10px;
    font-size: 13px;
    color: #495057;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.2s;

    &:hover {
        background-color: #e9ecef;
    }
`;

const ModalFooter = styled.div`
    padding: 15px 20px;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`;

const Button = styled.button`
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;

    &:active {
        transform: translateY(1px);
    }
`;

const CancelButton = styled(Button)`
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #495057;

    &:hover {
        background-color: #e9ecef;
    }
`;

const SaveButton = styled(Button)`
    background-color: #3498db;
    border: none;
    color: white;

    &:hover {
        background-color: #2980b9;
    }
`;

const AutocompleteContainer = styled.div`
    position: relative;
`;

const AutocompleteInput = styled(Input)`
    width: 100%;
`;

const SuggestionsList = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ced4da;
    border-radius: 6px;
    margin-top: 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SuggestionItem = styled.div`
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
    color: #495057;
    transition: background-color 0.2s;

    &:hover {
        background-color: #f8f9fa;
    }
`;

const UserModal = ({ isOpen, onClose, onSave, user = null }) => {
    const [formData, setFormData] = useState({
        telegram_id: '',
        telegram_username: '',
        fio: '',
        date_of_birth: '',
        city: '',
        office: '',
        supervisor: '',
        email: '',
        password: '',
        is_verified: false,
        is_active: false,
        is_admin: false,
        is_superuser: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [users, setUsers] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (user) {
            const supervisor = users.find(u => u.id === user.supervisor);
            const formattedDate = formatDateForInput(user.date_of_birth);
            setFormData({
                telegram_id: user.telegram_id || '',
                telegram_username: user.telegram_username || '',
                fio: user.fio || '',
                date_of_birth: formattedDate,
                city: user.city || '',
                office: user.office || '',
                supervisor: supervisor ? supervisor.fio : '',
                email: user.email || '',
                password: user.password || '',
                is_verified: user.is_verified || false,
                is_active: user.is_active || false,
                is_admin: user.is_admin || false,
                is_superuser: user.is_superuser || false
            });
        } else {
            setFormData({
                telegram_id: '',
                telegram_username: '',
                fio: '',
                date_of_birth: '',
                city: '',
                office: '',
                supervisor: '',
                email: '',
                password: '',
                is_verified: false,
                is_active: false,
                is_admin: false,
                is_superuser: false
            });
        }
    }, [user, users]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Здесь должен быть ваш API-запрос для получения списка пользователей
                const response = await userService.getUsersOnlyFio();
                // console.log('response', response);
                setUsers(response.data);

                // Временные данные для примера
                // setUsers([
                //     { id: 1, fio: 'Иванов Иван Иванович' },
                //     { id: 2, fio: 'Петров Петр Петрович' },
                //     { id: 3, fio: 'Сидоров Сидор Сидорович' }
                // ]);
            } catch (error) {
                console.error('Ошибка при загрузке пользователей:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };
            return newData;
        });
    };

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({
            ...formData,
            password
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSupervisorChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            supervisor_name: value,
            supervisor: ''
        }));

        if (value.trim()) {
            const filtered = users.filter(user =>
                user.fio.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (user) => {
        setFormData(prev => ({
            ...prev,
            supervisor: user.id,
            supervisor_name: user.fio
        }));
        setShowSuggestions(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.autocomplete-container')) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    // Функция для форматирования даты в формат YYYY-MM-DD
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        // Если дата уже в формате YYYY-MM-DD, возвращаем как есть
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>{user ? 'Редактировать пользователя' : 'Добавить пользователя'}</ModalTitle>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </ModalHeader>
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <FormRow>
                            <FormColumn>
                                <FormGroup>
                                    <Label htmlFor="telegram_id">ID (Telegram)</Label>
                                    <Input
                                        type="text"
                                        id="telegram_id"
                                        name="telegram_id"
                                        value={formData.telegram_id}
                                        disabled
                                    />
                                </FormGroup>
                            </FormColumn>
                            <FormColumn>
                                <FormGroup>
                                    <Label htmlFor="telegram_username">Имя пользователя (Telegram)</Label>
                                    <Input
                                        type="text"
                                        id="telegram_username"
                                        name="telegram_username"
                                        value={formData.telegram_username}
                                        disabled
                                    />
                                </FormGroup>
                            </FormColumn>
                        </FormRow>

                        <FormRow>
                            <FormColumn style={{ flex: '3' }}>
                                <FormGroup>
                                    <Label htmlFor="fio">ФИО</Label>
                                    <Input
                                        type="text"
                                        id="fio"
                                        name="fio"
                                        value={formData.fio}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </FormColumn>
                            <FormColumn style={{ flex: '1' }}>
                                <FormGroup>
                                    <Label htmlFor="date_of_birth">Дата рождения</Label>
                                    <Input
                                        type="date"
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </FormColumn>
                        </FormRow>

                        <FormRow>
                            <FormColumn>
                                <FormGroup>
                                    <Label htmlFor="city">Город</Label>
                                    <Input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </FormColumn>
                            <FormColumn>
                                <FormGroup>
                                    <Label htmlFor="office">Офис</Label>
                                    <Input
                                        type="text"
                                        id="office"
                                        name="office"
                                        value={formData.office}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                            </FormColumn>
                        </FormRow>

                        <FormGroup>
                            <Label htmlFor="supervisor">Руководитель</Label>
                            <AutocompleteContainer className="autocomplete-container">
                                <AutocompleteInput
                                    type="text"
                                    id="supervisor"
                                    name="supervisor_name"
                                    value={formData.supervisor_name}
                                    onChange={handleSupervisorChange}
                                    placeholder="Начните вводить имя руководителя"
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                    <SuggestionsList>
                                        {suggestions.map(user => (
                                            <SuggestionItem
                                                key={user.id}
                                                onClick={() => handleSuggestionClick(user)}
                                            >
                                                {user.fio}
                                            </SuggestionItem>
                                        ))}
                                    </SuggestionsList>
                                )}
                            </AutocompleteContainer>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="password">Пароль</Label>
                            <PasswordContainer>
                                <PasswordInput
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <PasswordButtonGroup>
                                    <PasswordButton
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        title={showPassword ? "Скрыть пароль" : "Показать пароль"}
                                    >
                                        {showPassword ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor" />
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z" fill="currentColor" />
                                            </svg>
                                        )}
                                    </PasswordButton>
                                    <PasswordButton
                                        type="button"
                                        onClick={generatePassword}
                                        title="Сгенерировать пароль"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 8L15 12H18C18 15.31 15.31 18 12 18C11 18 10.03 17.75 9.2 17.3L7.74 18.76C8.97 19.54 10.43 20 12 20C16.42 20 20 16.42 20 12H23L19 8ZM6 12C6 8.69 8.69 6 12 6C13 6 13.97 6.25 14.8 6.7L16.26 5.24C15.03 4.46 13.57 4 12 4C7.58 4 4 7.58 4 12H1L5 16L9 12H6Z" fill="currentColor" />
                                        </svg>
                                    </PasswordButton>
                                </PasswordButtonGroup>
                            </PasswordContainer>
                        </FormGroup>

                        <ToggleGroup>
                            <ToggleGroupTitle>Права доступа</ToggleGroupTitle>
                            <ToggleItem>
                                <ToggleLabel htmlFor="is_verified">Верификация</ToggleLabel>
                                <ToggleSwitch>
                                    <ToggleInput
                                        type="checkbox"
                                        id="is_verified"
                                        name="is_verified"
                                        checked={formData.is_verified}
                                        onChange={handleChange}
                                    />
                                    <ToggleSlider className="toggle-slider" />
                                </ToggleSwitch>
                            </ToggleItem>
                            <ToggleItem>
                                <ToggleLabel htmlFor="is_active">Активный</ToggleLabel>
                                <ToggleSwitch>
                                    <ToggleInput
                                        type="checkbox"
                                        id="is_active"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                    />
                                    <ToggleSlider className="toggle-slider" />
                                </ToggleSwitch>
                            </ToggleItem>
                            <ToggleItem>
                                <ToggleLabel htmlFor="is_admin">Администратор</ToggleLabel>
                                <ToggleSwitch>
                                    <ToggleInput
                                        type="checkbox"
                                        id="is_admin"
                                        name="is_admin"
                                        checked={formData.is_admin}
                                        onChange={handleChange}
                                    />
                                    <ToggleSlider className="toggle-slider" />
                                </ToggleSwitch>
                            </ToggleItem>
                            <ToggleItem>
                                <ToggleLabel htmlFor="is_superuser">Суперпользователь</ToggleLabel>
                                <ToggleSwitch>
                                    <ToggleInput
                                        type="checkbox"
                                        id="is_superuser"
                                        name="is_superuser"
                                        checked={formData.is_superuser}
                                        onChange={handleChange}
                                    />
                                    <ToggleSlider className="toggle-slider" />
                                </ToggleSwitch>
                            </ToggleItem>
                        </ToggleGroup>
                    </ModalBody>

                    <ModalFooter>
                        <CancelButton type="button" onClick={onClose}>
                            Отмена
                        </CancelButton>
                        <SaveButton type="submit">
                            {user ? 'Сохранить' : 'Добавить'}
                        </SaveButton>
                    </ModalFooter>
                </form>
            </ModalContent>
        </ModalOverlay>
    );
};

export default UserModal;