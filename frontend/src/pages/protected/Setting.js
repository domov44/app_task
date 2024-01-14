import React, { useContext } from 'react';
import Hero from '../../components/box/section/Hero';
import Container from '../../components/box/container/Container';
import ThemeSwitch from '../../Custom/Theme/ThemeSwitch';
import DefaultLayout from '../../layout/DefaultLayout'
import Title from '../../components/ui/textual/Title';
import Text from '../../components/ui/textual/Text';
import Bento from '../../components/box/bento/Bento';
import Column from '../../components/box/container/Column';
import Stack from '../../components/box/container/Stack';
import { UserContext } from '../../hooks/getdata/UserContext';
import SettingMenu from '../../components/menu/SettingMenu';


function Setting() {
    const { userData } = useContext(UserContext);
    return (
        <DefaultLayout>
            <Hero>
                <Title level={1}>
                    Paramètres
                </Title>
                <Stack>
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
                                    <Text>Réglages personnels</Text>
                                </div>
                            </div>
                        </>
                    )}
                </Stack>
                <Container direction="row" align="start" width="100%">
                    <Column width="25%" gap="20px">
                        <Bento highlight="highlight">
                            <SettingMenu />
                        </Bento>
                    </Column>
                    <Column width="75%">
                        <Bento highlight="highlight">
                            <Title level={4}>
                                Préférence de thème
                            </Title>
                            <Stack spacing="20px">
                                <ThemeSwitch />
                            </Stack>
                        </Bento>
                    </Column>
                </Container>
            </Hero>
        </DefaultLayout>
    );
}

export default Setting;