import React, { useContext } from 'react';
import TextInput from '../../components/ui/form/Textinput';
import DateInput from '../../components/ui/form/DateInput';
import Hero from '../../components/box/section/Hero';
import Bento from '../../components/box/bento/Bento';
import Section from '../../components/box/section/Section';
import Container from '../../components/box/container/Container';
import Title from '../../components/ui/textual/Title';
import Pastille from '../../components/ui/textual/Pastille';
import Button from '../../components/ui/button/Button';
import Text from '../../components/ui/textual/Text';
import DefaultLayout from '../../layout/DefaultLayout'
import HighLightContainer from '../../components/box/container/HighLightContainer';
import Column from '../../components/box/container/Column';
import FormWrapper from '../../components/box/container/FormWrapper';
import CircleProgress from '../../components/ui/progress-bar/CircleProgress';
import Select from '../../components/ui/form/Select';
import BackgroundImageContainer from '../../components/box/container/BackgroundImageContainer';
import IconButton from '../../components/ui/button/IconButton';
import Form from '../../components/ui/form/Form';
import Textarea from '../../components/ui/form/Textarea';
import getToken from '../../hooks/getdata/getToken';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { showToast, ToastContainer, notifySuccess, notifyError, notifyInfo, notifyWarning, notifyDefault } from '../../components/ui/Toastify';
import { CiMail, CiLocationOn, CiBank, CiLinkedin, CiGlobe, CiUser, CiMedal } from "react-icons/ci";
import { UserContext } from '../../hooks/getdata/UserContext';
import usePosteOptions from '../../hooks/getdata/getPoste';
import useEntrepriseOptions from '../../hooks/getdata/getEntreprise';
import useVilleOptions from '../../hooks/getdata/getVille';

function Profil() {
    const posteOptions = usePosteOptions();
    const entrepriseOptions = useEntrepriseOptions();
    const villeOptions = useVilleOptions();
    const [reloadUserData, setReloadUserData] = useState(false);
    const [editableData, setEditableData] = useState({
        surname: '',
        name: '',
        email: '',
        ddn: '',
        description: '',
        linkedin: '',
        site_web: '',
        poste: '',
        entreprise: '',
        ville: ''
    });

    const { userData, handleUpdateUserData } = useContext(UserContext);
    const [completionPercentage, setCompletionPercentage] = useState(0);

    useEffect(() => {
        setEditableData((prevData) => ({
            ...prevData,
            surname: userData.surname,
            name: userData.name,
            email: userData.email,
            ddn: userData.ddn,
            description: userData.description,
            linkedin: userData.linkedin,
            site_web: userData.site_web,
            poste: userData.poste,
            entreprise: userData.entreprise,
            ville: userData.ville
        }));
    }, [userData]);

    useEffect(() => {
        const contextFields = ['name', 'description', 'ddn', 'poste', 'entreprise', 'ville', 'surname', 'email', 'linkedin', 'site_web'];

        const filledFields = contextFields.filter(fieldName => editableData[fieldName] !== '' && editableData[fieldName] !== null).length;
        const totalFields = contextFields.length;
        const percentage = Math.round((filledFields / totalFields) * 100);
        setCompletionPercentage(percentage);
    }, [editableData]);

    const handleInputChange = (fieldName, value) => {
        setEditableData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const rawDate = editableData.ddn;
        const dateParts = rawDate.split('/');
        const isValidDate = dateParts.length === 3 && /^\d{2}$/.test(dateParts[0]) && /^\d{2}$/.test(dateParts[1]) && /^\d{4}$/.test(dateParts[2]);

        if (isValidDate) {
            // Convertir la date au format MySQL (YYYY-MM-DD)
            const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

            const token = getToken();
            if (token) {
                try {
                    const res = await axios.put(
                        'http://localhost:8081/user/updateCurrentUser',
                        {
                            ...editableData,
                            ddn: formattedDate,
                        },
                        {
                            headers: {
                                'access-token': token,
                            },
                        }
                    );
                    console.log(res);
                    console.log(formattedDate); // Utilisez la date formatée ici
                    notifySuccess('Profil mis à jour avec succès');
                    handleUpdateUserData();
                    setReloadUserData((prevState) => !prevState);
                } catch (err) {
                    console.error(err);
                    notifyError('Erreur lors de la mise à jour du profil');
                }
            }
        } else {
            console.error('Format de date invalide :', rawDate);
            // Gérez l'erreur ou avertissez l'utilisateur du format de date incorrect
        }
    };
    return (
        <DefaultLayout>
            <div className='test'>
                <CircleProgress progress={completionPercentage} />
            </div>
            <Hero>
                <HighLightContainer variant="primary" direction="row" width="100%" justify="space-between" >
                    <Column width="10%" justify="center">
                        <CircleProgress progress={completionPercentage} />
                    </Column>
                    <Column width="75%" justify="center">
                        <Title level={3}>
                            Complétez votre profil
                        </Title>
                        <Text>Complétez votre profil à 100% pour profitez pleinement de l'application.</Text>
                    </Column>
                    <Column width="15%" align="center" justify="center">
                        <Button width="fit-content" variant="primary">Compléter</Button>
                    </Column>
                </HighLightContainer>
                <BackgroundImageContainer coverUrl={userData.cover_url}>
                    <div className="profil-container">
                        <img src={userData.picture} className="user-picture" alt="logo" />
                        <div className="user-info">
                            <div>
                                <Title level={3} variant="white">
                                    {userData.name} {userData.surname}
                                </Title>
                                <Text variant="white">{userData.role}</Text>
                            </div>
                        </div>
                    </div>
                </BackgroundImageContainer>
                <Container direction="row" align="start" width="100%">
                    <Column width="35%" gap="20px">
                        <Bento highlight="highlight">
                            <Title level={4}>
                                À propos
                            </Title>
                            <Text>{userData.description}</Text>
                            {userData.age && userData.age !== 0 && (
                                <Pastille variant="success">
                                    <CiUser />{userData.age} ans
                                </Pastille>
                            )}

                            {userData.email && userData.email !== 0 && (
                                <Pastille variant="success">
                                    <CiMail />{userData.email}
                                </Pastille>
                            )}

                            {userData.ville && userData.ville !== 0 && (
                                <Pastille variant="primary">
                                    <CiLocationOn />{userData.ville}
                                </Pastille>
                            )}

                            {userData.poste && userData.poste !== 0 && userData.entreprise && userData.entreprise !== 0 && (
                                <Pastille variant="success">
                                    <CiBank />{userData.poste} chez {userData.entreprise}
                                </Pastille>
                            )}

                            {userData.daysSinceCreation && userData.daysSinceCreation !== 0 && (
                                <Pastille variant="success">
                                    <CiMedal />Membre depuis {userData.daysSinceCreation} jours
                                </Pastille>
                            )}
                        </Bento>
                        <Bento highlight="highlight">
                            <Title level={4}>
                                Social
                            </Title>
                            {userData.linkedin && (
                                <IconButton variant="secondary-action" as="isLink" href={userData.linkedin}>
                                    <CiLinkedin />LinkedIn
                                </IconButton>
                            )}

                            {userData.site_web && (
                                <IconButton variant="secondary-action" as="isLink" href={userData.site_web}>
                                    <CiGlobe />{userData.site_web}
                                </IconButton>
                            )}

                            {!userData.linkedin && !userData.site_web && (
                                <Text>Vous n'avez pas encore renseigné de liens</Text>
                            )}
                        </Bento>
                    </Column>
                    <Column width="65%">
                        <Bento highlight="highlight">
                            <Form onSubmit={handleSubmit}>
                                <Title level={4}>
                                    Informations personnelles
                                </Title>
                                <FormWrapper>
                                    <TextInput
                                        type="text"
                                        variant="blue"
                                        label="Nom"
                                        value={editableData.surname}
                                        onChange={(e) => handleInputChange('surname', e.target.value)}
                                    />
                                    <TextInput
                                        type="text"
                                        variant="blue"
                                        label="Prénom"
                                        value={editableData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                    />

                                    <TextInput
                                        type="text"
                                        variant="blue"
                                        label="Email"
                                        value={editableData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                    <DateInput
                                        type="text"
                                        variant="blue"
                                        label="Date de naissance"
                                        maxLength="10"
                                        value={editableData.ddn}
                                        onChange={(e) => handleInputChange('ddn', e.target.value)}
                                    />
                                    <Textarea
                                        variant="blue"
                                        label="Description"
                                        value={editableData.description}
                                        maxCharCount={255}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                    />
                                    <TextInput
                                        type="text"
                                        variant="blue"
                                        label="LinkedIn"
                                        value={editableData.linkedin}
                                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                                    />
                                    <TextInput
                                        type="text"
                                        variant="blue"
                                        label="Site web"
                                        value={editableData.site_web}
                                        onChange={(e) => handleInputChange('site_web', e.target.value)}
                                    />
                                    <Select
                                        value={editableData.poste}
                                        options={posteOptions}
                                        onSelect={(selectedOption) => handleInputChange('poste_id', selectedOption.id)}
                                        defaultText="Sélectionnez un poste..."
                                    />
                                    <Select
                                        value={editableData.entreprise}
                                        options={entrepriseOptions}
                                        onSelect={(selectedOption) => handleInputChange('entreprise_id', selectedOption.id)}
                                        defaultText="Sélectionnez une entreprise..."
                                    />
                                    <Select
                                        value={editableData.ville}
                                        options={villeOptions}
                                        onSelect={(selectedOption) => handleInputChange('ville_id', selectedOption.id)}
                                        defaultText="Sélectionnez une ville..."
                                    />
                                </FormWrapper>
                                <Button type='submit' width="full-width" variant="primary">Mettre à jour</Button>
                            </Form>
                        </Bento>
                    </Column>
                </Container>
            </Hero>
            <Section>
            </Section>
        </DefaultLayout>
    );
}

export default Profil;