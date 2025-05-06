import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import { postService } from '../../services/postService';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Регистрируем компоненты Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const DashboardContainer = styled.div`
    padding: 20px;
`;

const WelcomeCard = styled.div`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
`;

const DashboardTitle = styled.h2`
    color: #2c3e50;
    margin-bottom: 15px;
`;

const UserInfoCard = styled.div`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
`;

const UserAvatar = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #3498db;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    font-size: 24px;
    margin-right: 20px;
`;

const UserDetails = styled.div`
    flex: 1;
`;

const UserName = styled.h3`
    color: #2c3e50;
    margin: 0 0 5px 0;
    font-size: 18px;
`;

const UserRole = styled.div`
    color: #7f8c8d;
    font-size: 14px;
    margin-bottom: 5px;
`;

const UserEmail = styled.div`
    color: #7f8c8d;
    font-size: 14px;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
`;

const StatCard = styled.div`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
`;

const StatValue = styled.div`
    font-size: 24px;
    font-weight: bold;
    color: #3498db;
    margin-bottom: 5px;
`;

const StatLabel = styled.div`
    color: #7f8c8d;
    font-size: 14px;
`;

const ChartCard = styled.div`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-top: 20px;
    max-width: 100%;
    overflow: hidden;
`;

const ChartContainer = styled.div`
    max-width: 100%;
    height: 400px;
    position: relative;
`;

const ChartTitle = styled.h3`
    color: #2c3e50;
    margin-bottom: 15px;
    text-align: center;
`;

const LoadingSpinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
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

const DashboardHome = () => {
    const currentUser = authService.getCurrentUser();
    const userInitial = currentUser?.telegram_username ? currentUser.telegram_username.charAt(0).toUpperCase() : '?';
    const chartRef = useRef(null);

    const [stats, setStats] = useState({
        totalUsers: 0,
        verifiedUsers: 0,
        totalPosts: 0
    });

    const [postsByDate, setPostsByDate] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });

    // Функция для обновления размеров графика
    const updateChartDimensions = () => {
        if (chartRef.current) {
            const container = chartRef.current.parentElement;
            setChartDimensions({
                width: container.clientWidth,
                height: container.clientHeight
            });
        }
    };

    // Обработчик изменения размера окна
    useEffect(() => {
        updateChartDimensions();

        const handleResize = () => {
            updateChartDimensions();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Получаем статистику пользователей
                const usersResponse = await userService.getUsers();
                const verifiedUsersResponse = await userService.getVerifiedUsers();
                const totalUsers = usersResponse.data?.length || 0;
                const verifiedUsers = verifiedUsersResponse.data?.length || 0;

                // Получаем статистику постов
                const postsResponse = await postService.getPosts();
                const totalPosts = postsResponse.data?.length || 0;

                // Обрабатываем данные для графика
                const posts = postsResponse.data || [];
                const postsByDateMap = new Map();

                // Группируем просмотры и лайки по дате публикации
                posts.forEach(post => {
                    if (post.date_publish) {
                        const date = new Date(post.date_publish).toLocaleDateString();
                        const prev = postsByDateMap.get(date) || { views: 0, likes: 0 };
                        postsByDateMap.set(date, {
                            views: prev.views + (post.views || 0),
                            likes: prev.likes + (post.likes || 0)
                        });
                    }
                });

                // Сортируем по дате
                const sortedPostsByDate = Array.from(postsByDateMap.entries())
                    .sort((a, b) => new Date(a[0]) - new Date(b[0]));

                setStats({
                    totalUsers,
                    verifiedUsers,
                    totalPosts
                });

                setPostsByDate(sortedPostsByDate);
            } catch (err) {
                console.error('Ошибка при загрузке данных:', err);
                setError('Не удалось загрузить статистику. Пожалуйста, попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Настройки графика
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Просмотры и лайки по датам',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    // Данные для графика
    const chartData = {
        labels: postsByDate.map(item => item[0]),
        datasets: [
            {
                label: 'Просмотры',
                data: postsByDate.map(item => item[1].views),
                borderColor: 'rgb(52, 152, 219)',
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                tension: 0.1
            },
            {
                label: 'Лайки',
                data: postsByDate.map(item => item[1].likes),
                borderColor: 'rgb(231, 76, 60)',
                backgroundColor: 'rgba(231, 76, 60, 0.5)',
                tension: 0.1
            }
        ]
    };

    return (
        <DashboardContainer>
            <WelcomeCard>
                <DashboardTitle>Добро пожаловать в панель администратора</DashboardTitle>
                <p>Здесь вы можете управлять контентом сайта, пользователями и настройками.</p>
            </WelcomeCard>

            <UserInfoCard>
                <UserAvatar>{userInitial}</UserAvatar>
                <UserDetails>
                    <UserName>
                        {currentUser?.last_name && currentUser?.first_name
                            ? `${currentUser.last_name} ${currentUser.first_name} ${currentUser.sur_name || ''}`
                            : 'Гость'}
                    </UserName>
                    {currentUser?.is_superuser ? (
                        <UserRole>Суперпользователь</UserRole>
                    ) : currentUser?.is_admin ? (
                        <UserRole>Администратор</UserRole>
                    ) : null}
                    <UserEmail>{currentUser?.email || 'email@example.com'}</UserEmail>
                </UserDetails>
            </UserInfoCard>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            {isLoading ? (
                <LoadingSpinner>Загрузка статистики...</LoadingSpinner>
            ) : (
                <>
                    <StatsGrid>
                        <StatCard>
                            <StatValue>{stats.totalUsers}</StatValue>
                            <StatLabel>Всего пользователей</StatLabel>
                        </StatCard>
                        <StatCard>
                            <StatValue>{stats.verifiedUsers}</StatValue>
                            <StatLabel>Верифицированных пользователей</StatLabel>
                        </StatCard>
                        <StatCard>
                            <StatValue>{stats.totalPosts}</StatValue>
                            <StatLabel>Всего постов</StatLabel>
                        </StatCard>
                    </StatsGrid>

                    <ChartCard>
                        <ChartTitle>Статистика постов</ChartTitle>
                        <ChartContainer ref={chartRef}>
                            <Line
                                options={chartOptions}
                                data={chartData}
                                width={chartDimensions.width}
                                height={chartDimensions.height}
                            />
                        </ChartContainer>
                    </ChartCard>
                </>
            )}
        </DashboardContainer>
    );
};

export default DashboardHome;