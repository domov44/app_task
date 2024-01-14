import React, { useContext } from 'react';
import Title from '../../components/ui/textual/Title';
import Text from '../../components/ui/textual/Text';
import CurrentDate from '../../components/ui/dynamic/CurrentDate';
import { UserContext } from '../../hooks/getdata/UserContext';
import Hero from '../../components/box/section/Hero';
import Container from '../../components/box/container/Container';
import HighLightContainer from '../../components/box/container/HighLightContainer';
import Column from '../../components/box/container/Column';
import DefaultLayout from '../../layout/DefaultLayout';

function Home() {
  // Utilisez le hook useUser pour accéder aux données utilisateur
  const { userData } = useContext(UserContext);

  return (
    <DefaultLayout>
      <Hero>
        <Container variant="normal" direction="row" width="100%" justify="space-between">
          <Column width="65%">
            <Title level={3}>
              Tableau de bord
            </Title>
            <Text>
              <CurrentDate highlight="day" uppercase="true" variant="long" />
            </Text>
          </Column>
        </Container>
        <HighLightContainer variant="primary" direction="row" width="100%" justify="space-between">
          <Column width="35%">
            <img className='image-container' src='/illustration/svg/objectif.svg' alt="illustration d'un personnage"></img>
          </Column>
          <Column width="65%" justify="center">
            <Title level={1} variant="blue">
              Bienvenue, {userData.name}
            </Title>
            <Text>
              Commencez à planifier vos taches
            </Text>
          </Column>
        </HighLightContainer>
      </Hero>
    </DefaultLayout>
  );
}

export default Home;
