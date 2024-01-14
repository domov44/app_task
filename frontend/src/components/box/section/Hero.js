import React from 'react';
import styled from 'styled-components';

const HeroContainer = styled.section`
    margin-top: 50px;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc( 80vh - 50px - 80px);
    width: 100%;
    gap:30px;
`;

function Hero({ children }) {
    return (
        <HeroContainer>
            {children}
        </HeroContainer>
    );
}

export default Hero;