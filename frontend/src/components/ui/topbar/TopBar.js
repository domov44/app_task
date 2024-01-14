import React, { useContext } from 'react';
import { UserContext } from '../../../hooks/getdata/UserContext';
import Title from './../textual/Title';
import Text from './../textual/Text';
import { NavLink } from 'react-router-dom';

import Toggle from './Toggle';
import '../../../assets/style/style.css';
import styled from "styled-components";

const TopBarContainer = styled.header`
  z-index: 10;
  margin-top: 30px;
  top: 30px;
  width: 100%;
  position: sticky;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
`;

const TopBar = ({ toggleSidebar }) => {
  const { userData } = useContext(UserContext);

  return (
    <TopBarContainer>
      <Toggle onClick={toggleSidebar} />
      <NavLink to="/profil">
        <div className="user-container">
          {userData.error && (
            <div>
              <p>Erreur lors de la récupération des données de l'utilisateur:</p>
              <p>{userData.error}</p>
              {userData.details && <p>Détails: {userData.details}</p>}
            </div>
          )}
          {!userData.error && (
            <>
              <img src={userData.picture} className="user-picture" alt="logo" />
              <div className="user-info">
                <div>
                  <Title level={3}>
                  {userData.name} {userData.surname}
                  </Title>
                  <Text>{userData.role}</Text>
                </div>
              </div>
            </>
          )}
        </div>
      </NavLink>
    </TopBarContainer>
  );
};

export default TopBar;
