import React, { useContext, useEffect, useState } from 'react';
import Logo from '../../illustration/Logo.js';
import MainMenu from '../../menu/MainMenu';
import Text from '../../ui/textual/Text';
import AdminMenu from '../../menu/AdminMenu';
import SecondaryMenu from '../../menu/SecondaryMenu';
import { UserContext } from '../../../hooks/getdata/UserContext';
import styled from 'styled-components';
import ProfileCompletionCircle from '../../ui/progress-bar/ProfileCompletionCircle';
import Title from '../../ui/textual/Title';
import { NavLink } from 'react-router-dom';
import Column from '../../box/container/Column';
import Bento from '../../box/bento/Bento';
import Animation from '../../animation/Animation.js';
import firework from '../../animation/storageAnimation/fireworks2.json';

const StyledAside = styled.aside`
  background: var(--bg-color);
  padding: 15px;
  width: 280px;
  border-right: 2px solid var(--grey-color);
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  z-index: 2;
  transition: 0.3s;
  transform: translateX(${(props) => (props.$isopen === 'true' ? '0px' : '-100%')});
`;

function Header({ isopen }) {
  const { userData, isLoading, isUserDataLoaded } = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isBentoVisible, setIsBentoVisible] = useState(false);
  const [isCompletionFull, setIsCompletionFull] = useState(false);

  useEffect(() => {
    if (isLoading || !isUserDataLoaded) {
      return;
    }

    setIsAdmin(userData.role_id === 1);

    const contextFields = ['name', 'description', 'ddn', 'surname', 'email', 'ville', 'entreprise', 'poste', 'linkedin', 'site_web'];

    const filledFields = contextFields.filter(fieldName => userData[fieldName] !== '' && userData[fieldName] !== null).length;
    const totalFields = contextFields.length;
    const percentage = Math.round((filledFields / totalFields) * 100);

    setCompletionPercentage(percentage);

    if (percentage === 100) {
      setIsCompletionFull(true);

      const timeoutId = setTimeout(() => {
        setIsBentoVisible(false);
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
        setIsCompletionFull(false);
      };
    } else {
      setIsBentoVisible(true);
      setIsCompletionFull(false);
    }

  }, [isLoading, userData, isUserDataLoaded]);

  return (
    <StyledAside className="banner" $isopen={isopen.toString()}>
      <section className="bloc-1">
        <div className="logo-container">
          <Logo />
        </div>
        <nav className="navigation">
          {isLoading && (
            <div>Chargement...</div>
          )}

          {isUserDataLoaded && isBentoVisible && (
            <NavLink to="profil">
              <Bento highlight="highlight" direction="row" padding="10px">
                {isCompletionFull && (
                  <Animation
                    animationData={firework}
                    loop="false"
                    autoplay="false"
                  />
                )}
                <Column width="35%" justify="center">
                  <ProfileCompletionCircle />
                </Column>
                <Column width="65%" justify="center">
                  {isCompletionFull ? (
                    <Title level={5}>
                      Votre profil est complet
                    </Title>
                  ) : (
                    <Title level={5}>
                      Complétez votre profil
                    </Title>
                  )}
                </Column>
              </Bento>
            </NavLink>
          )}
          <MainMenu />
          {isAdmin && <AdminMenu />}
          <SecondaryMenu />
          <Text>Réalisé par Ronan Scotet</Text>
        </nav>
      </section>
    </StyledAside>
  );
}

export default Header;
