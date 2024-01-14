import React from 'react';
import styled, { StyleSheetManager } from 'styled-components';

const StackDiv = styled.div`
gap: ${props => props.$spacing || "10px"};
width: ${props =>
    props.$width === "100%"
      ? "100%"
      : props.$width === "classic"
      ? "auto"
      : "auto"};
  display: flex;
  flex-direction: ${props => (props.$direction === "column" ? "column" : "row")};
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

function Stack({ direction, align, justify, children, width, spacing }) {
  return (
    <StackDiv $direction={direction} $align={align} $justify={justify} $width={width} $spacing={spacing}>
      {children}
    </StackDiv>
  );
}

export default Stack;
