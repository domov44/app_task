import React from 'react';
import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';

const MenuLi = styled.li`
  list-style: none;
  font-size: 20px;
  display: flex;
  overflow: hidden;
`;

const commonStyles = css`
  line-height: 0;
  width: 100%;
  padding: 12px 18px;
  border-radius: 5px;
  transition: 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  cursor: pointer;
`;

const classicStyles = css`
  color: var(--paragraph);
  &:hover {
    color: var(--color-title);
    background-color: var(--nav-bg-hover);
  }
`;

const dangerStyles = css`
  color: var(--error-color);
  &:hover {
    background-color: var(--error-bg);
  }
`;

const activeStyles = css`
  color: var(--color-title);
  background-color: var(--nav-bg-hover);
`;

const StyledMenuLink = styled(NavLink)`
  ${(props) => (props.$variant === 'danger' ? dangerStyles : classicStyles)}
  ${(props) => props.to && `&.${props.$activeclassname} { ${activeStyles} }`}
  ${commonStyles}

  border: none;
  list-style: none;
  font-size: 20px;
  display: flex;
  overflow: hidden;
`;

const MenuItem = ({ text, onClick, icon: Icon, variant, to }) => (
  <MenuLi>
    <StyledMenuLink to={to} onClick={onClick} $variant={variant} $activeclassname="active">
      {Icon && <Icon />} {text}
    </StyledMenuLink>
  </MenuLi>
);

export default MenuItem;
