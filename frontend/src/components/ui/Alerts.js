// Ce fichier sert à gérer les alerts du site, du type connexion, déconnexion etc

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { AiFillCheckCircle } from 'react-icons/ai';
import { successMessageEvent } from '../../hooks/events/customEvents';

const AlertComponent = styled.span`
  line-height: 0;
  gap: 5px;
  align-items: center;
  color: ${(props) =>
    props.$variant === "error"
      ? "var(--error-color)"
      : props.$variant === "success"
      ? "var(--success-color)"
      : "none"};
  background: ${(props) =>
    props.$variant === "error"
      ? "var(--error-bg)"
      : props.$variant === "success"
      ? "var(--success-bg)"
      : "none"};
  border-left: solid 2px;
  font-size: 20px;
  position: fixed;
  top: 30px;
  padding: 10px 18px;
  display: ${(props) => (props.$visible ? "flex" : "none")};
  transition: opacity 3s;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
`;

function AlertComponents() {
  const [successMessage, setSuccessMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const hideSuccessMessage = () => {
    setIsVisible(false);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setIsVisible(true);

    // Réinitialiser le setTimeout à chaque nouvelle alerte
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(hideSuccessMessage, 3000);
  };

  useEffect(() => {
    const storedMessage = localStorage.getItem("successMessage");

    if (storedMessage) {
      localStorage.removeItem("successMessage");
      showSuccessMessage(storedMessage);
    }

    const successMessageHandler = (event) => {
      showSuccessMessage(event.detail);
    };

    window.addEventListener(successMessageEvent.type, successMessageHandler);

    return () => {
      window.removeEventListener(successMessageEvent.type, successMessageHandler);

      // Nettoyer le setTimeout lors du démontage du composant
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);


  return isVisible ? (
    <AlertComponent $variant="success" $visible={isVisible}>
      <AiFillCheckCircle /> {successMessage}
    </AlertComponent>
  ) : null;
}

export default AlertComponents;