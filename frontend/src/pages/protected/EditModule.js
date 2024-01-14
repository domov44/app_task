import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../hooks/getdata/UserContext';
import Button from '../../components/ui/button/Button';
import TextInput from '../../components/ui/form/Textinput';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Title from '../../components/ui/textual/Title';
import Tips from '../../components/ui/textual/Tips';
import Hero from '../../components/box/section/Hero';
import Form from '../../components/ui/form/Form';
import PasswordInput from '../../components/ui/form/Password';
import useRoleOptions from '../../hooks/getdata/GetRole';
import getToken from '../../hooks/getdata/getToken';
import Logo from '../../components/illustration/Logo.js';
import FormError from '../../components/ui/form/FormError';
import Bento from '../../components/box/bento/Bento';
import { showToast, ToastContainer, notifySuccess, notifyError, notifyInfo, notifyWarning, notifyDefault } from '../../components/ui/Toastify';
import DefaultLayout from '../../layout/DefaultLayout'

function EditModule() {
    const { userData } = useContext(UserContext);
    const [errors, setErrors] = useState({});

    const [confirmPassword, setConfirmPassword] = useState('');

    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role_id, setRole] = useState('');
    const [password, setPassword] = useState('');
    const token = getToken();
    const roleOptions = useRoleOptions();

    const { id } = useParams();
    const Navigate = useNavigate();

    useEffect(() => {
        if (token) {
            axios
                .get(`http://localhost:8081/user/getForeachUserData/${id}`, {
                    headers: {
                        'access-token': token,
                    },
                })
                .then((res) => {
                    if (res.data && res.data.name) {
                        const { name, surname, email, role_id } = res.data;
                        setName(name);
                        setSurname(surname);
                        setEmail(email);
                        setRole(role_id);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors((prevErrors) => ({ ...prevErrors, password: '' }));

        if (password !== confirmPassword) {
            setErrors({ ...errors, password: "Les 2 mots de passe ne se correspondent pas" });
            notifyError("Le compte n'a pas pu être modifié");
            return;
        }

        // Créer l'objet requestData avec les champs communs
        const requestData = {
            surname,
            name,
            email,
            role_id
        };

        // Ajouter le mot de passe à la requête seulement s'il n'est pas vide
        if (password !== '') {
            requestData.password = password;
        } else {
            // Si le mot de passe est vide, ne pas l'inclure dans la requête
            delete requestData.password;
        }

        axios
            .put(`http://localhost:8081/user/update/${id}`, requestData, {
                headers: {
                    "access-token": token,
                },
            })
            .then((res) => {
                console.log(res);
                Navigate('/admin/comptes');
                notifySuccess("Compte modifié avec succès");
            })
            .catch((err) => {
                if (err.response && err.response.status === 409) {
                    setErrors({ ...errors, email: "Cet email est déjà associé à un compte" });
                    notifyError("Le compte n'a pas pu être modifié");
                } else {
                    console.error(err);
                }
            });
    };


    return (
        <DefaultLayout>
            <Hero>
                <Bento width="450px" highlight="highlight" padding="40px">
                    <Title level={1}>
                        Modifier un compte
                    </Title>
                    <Form autoComplete="off" onSubmit={handleSubmit}>
                        <Logo />

                        <TextInput
                            type="text"
                            variant="blue"
                            label="Prénom"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <TextInput
                            type="text"
                            variant="blue"
                            label="Nom"
                            value={surname}
                            onChange={e => setSurname(e.target.value)}
                        />
                        <TextInput
                            type="email"
                            variant="blue"
                            label="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <PasswordInput
                            type="password"
                            variant="blue"
                            label="Nouveau mot de passe"
                            autoComplete="new-password"
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
                            }}
                        />
                        <PasswordInput
                            type="password"
                            variant="blue"
                            label="Confirmer le mot de passe"
                            autoComplete="new-password"
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
                            }}
                        />
                        <Tips variant="success">
                            Pour conserver le mot de passe inchangé, laissez simplement les champs vides.
                        </Tips>
                        {errors.password && <FormError variant="error">{errors.password}</FormError>}
                        {errors.email && <FormError variant="error">{errors.email}</FormError>}
                        <select onChange={(e) => { setRole(e.target.value); }}>
                            <option value="">Choisir un rôle</option>
                            {roleOptions.map((option, index) => (
                                <option key={index} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>


                        <Button type='submit' width="full-width" variant="primary">Mettre à jour</Button>
                    </Form>
                </Bento>
            </Hero>
        </DefaultLayout>

    );
}

export default EditModule;
