import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.section`
margin-top: 50px;
max-width: 1200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc( 30vh - 50px - 80px);
    width: 100%;
`;

function Section({ children }) {
    return (
        <SectionContainer>
            {children}
        </SectionContainer>
    );
}

export default Section;