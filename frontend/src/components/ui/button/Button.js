import React from "react";
import styled from "styled-components";

const ButtonComponent = styled.button`
  position: relative;
  display: inline-block;
  width:
  ${props => props.$width === "fit-content"
        ? "fit-content"
        : props.$width === "full-width"
            ? "100%"
            : "fit-content"};
  background: ${props =>
        props.$variant === "primary"
            ? "var(--bg-color)"
            : props.$variant === "secondary"
                ? "var(--bg-color)"
                : props.$variant === "danger"
                    ? "var(--error-bg)"
                    : "none"};
    color: ${props =>
        props.$variant === "primary"
            ? "var(--color-title)"
            : props.$variant === "secondary"
                ? "var(--color-title)"
                : props.$variant === "danger"
                    ? "var(--error-color)"
                : "none"};
    border:  ${props =>
        props.$variant === "primary"
            ? "2px solid var(--color-title)"
            : props.$variant === "secondary"
                ? "2px solid var(--color-title)"
                : props.$variant === "danger"
                    ? "none"
                : "none"};
  padding: 10px 14px;
  box-shadow: 10px 10px ${props =>
        props.$variant === "primary"
            ? "var(--main-color)"
            : props.$variant === "secondary"
                ? "var(--color-title)"
                : "none"};
  font-size: 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover{
    box-shadow: 5px 5px ${props =>
        props.$variant === "primary"
            ? "var(--main-color)"
            : props.$variant === "secondary"
                ? "var(--color-title)"
                : "none"};
  }

  &:active{
    box-shadow: 0px 0px ${props =>
        props.$variant === "primary"
            ? "var(--main-color)"
            : props.$variant === "secondary"
                ? "var(--color-title)"
                : "none"};
  }
`;


const Button = ({ type, variant, width, className, id, onClick, children }) => {
    return (
        <ButtonComponent
            type={type ? (type === "input" ? ["button", "input"] : type) : "button"}
            $variant={variant}
            $width={width}
            className={className ? `btn-component ${className}` : "btn-component"}
            id={id}
            onClick={onClick}
        >
            {children}
        </ButtonComponent>

    );
};

export default Button;