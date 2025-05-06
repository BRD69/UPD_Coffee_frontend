import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
`;

const LogoImage = styled.img`
  max-width: 300px;
  max-height: 300px;
  animation: spin 20s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const HomePage = () => {
    return (
        <HomeContainer>
            <LogoImage src="/logo_upd.png" alt="Logo" />
        </HomeContainer>
    );
};

export default HomePage;