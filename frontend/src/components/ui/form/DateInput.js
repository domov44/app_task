// DateInput.js

import React from 'react';
import styled from 'styled-components';

const DateInputContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  border: solid 1px;
  border-color: ${(props) =>
    props.$variant === 'blue'
      ? 'var(--paragraph)'
      : props.$variant === 'green'
      ? 'var(--main-color)'
      : props.$variant === 'white'
      ? 'var(--bg-color)'
      : 'var(--paragraph)'};
  color: ${(props) =>
    props.$variant === 'blue'
      ? 'var(--paragraph)'
      : props.$variant === 'green'
      ? 'var(--main-color)'
      : props.$variant === 'white'
      ? 'var(--bg-color)'
      : 'var(--paragraph)'};
  padding: 10px 14px;
  font-size: 20px;
  border-radius: 5px;
  transition: 0.2s ease-in-out;

  &:focus {
    border-color: var(--main-color);
    color: var(--main-color);
    outline: none;
  }

  &:not(:placeholder-shown) + label,
  &:focus + label {
    color: var(--main-color);
    transform: translateY(-22px);
    font-size: 0.75rem;
    font-weight: 600;
    background-color: var(--secondary-bg-color);
    opacity: 1;
  }

  &:not(:focus) + label {
    color: var(--color-title);
  }
`;

const Label = styled.label`
  position: absolute;
  left: 9px;
  padding: 0px 5px;
  font-size: 20px;
  color: var(--color-title);
  pointer-events: none;
  transition: 0.2s ease-in-out;
  opacity: 0.7;
`;

const DateInput = ({ label, type, variant, className, id, onClick, children, maxLength, ...restProps }) => {
  return (
    <DateInputContainer>
      <Input {...restProps} type={type} $variant={variant} className={className} id={id} onClick={onClick} placeholder=" " maxLength={maxLength}/>
      <Label>{label}</Label>
    </DateInputContainer>
  );
};

export default DateInput;
