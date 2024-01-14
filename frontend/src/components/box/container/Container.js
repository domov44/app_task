import React from 'react';
import styled, { StyleSheetManager } from 'styled-components';

const ContainerDiv = styled.div`
gap:30px;
width: ${props =>
    props.$width === "100%"
      ? "100%"
      : props.$width === "classic"
      ? "auto"
      : "auto"};
  display: flex;
  flex-direction: ${props => (props.$direction === "row" ? "row" : "column")};
  align-items: ${props => (props.$align === "center" ? "center" : "")};
  justify-content: ${props =>
    props.$justify === "center"
      ? "center"
      : props.$justify === "start"
      ? "start"
      : props.$justify === "space-between"
      ? "space-between"
      : "start"};
`;

function Container({ direction, align, justify, children, width }) {
  return (
    <ContainerDiv $direction={direction} $align={align} $justify={justify} $width={width}>
      {children}
    </ContainerDiv>
  );
}

function ContainerWithStyles(props) {
  return (
    <StyleSheetManager shouldForwardProp={(prop) => !prop.startsWith('$')}>
      <Container {...props} />
    </StyleSheetManager>
  );
}

export default ContainerWithStyles;
