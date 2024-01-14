import React from 'react';
import { useNavigate } from 'react-router-dom';

const Link = ({ to, children }) => {
  const navigate = useNavigate();

  const handleNav= (event) => {
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleNav}>
      {children}
    </a>
  );
};

export default Link;
