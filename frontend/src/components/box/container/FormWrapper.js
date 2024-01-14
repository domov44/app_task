import React from 'react';
import styled from 'styled-components';

const FormContainerDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto;
  gap: 15px;
  width: 100%;

  > :nth-child(5) {
    grid-column: 1 / -1;
  }
`;

function FormContainer({ children }) {
  return <FormContainerDiv>{children}</FormContainerDiv>;
}

export default FormContainer;
