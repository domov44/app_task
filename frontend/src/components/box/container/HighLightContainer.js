import React from 'react';
import styled, { StyleSheetManager } from 'styled-components';

const HighLightContainerDiv = styled.div`
gap:10px;
margin-top: 100px;
min-height: 150px;
padding:30px;
width: ${props =>
        props.$width === "100%"
            ? "100%"
            : props.$width === "classic"
                ? "auto"
                : "auto"};
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.03) 0px 12px 24px -4px;
  flex-direction: ${props => (props.$direction === "row" ? "row" : "column")};
  align-items: ${props => (props.$align === "center" ? "center" : "initial")};
  justify-content: ${props =>
        props.$justify === "center"
            ? "center"
            : props.$justify === "start"
                ? "start"
                : props.$justify === "space-between"
                    ? "space-between"
                    : "start"};
border-radius: 30px;
background: ${props =>
        props.$variant === "primary"
            ? "var(--secondary-bg-color)"
            : props.$variant === "secondary"
                ? "var(--secondary-color)"
                : props.$variant === "danger"
                    ? "var(--error-bg)"
                    : "var(--color-title)"};
`;

function HighLightContainer({ variant, direction, align, justify, children, width }) {
    return (
        <HighLightContainerDiv $variant={variant} $direction={direction} $align={align} $justify={justify} $width={width}>
            {children}
        </HighLightContainerDiv>
    );
}

export default HighLightContainer;
