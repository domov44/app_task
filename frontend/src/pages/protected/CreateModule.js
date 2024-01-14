import Button from '../../components/ui/button/Button';
import TextInput from '../../components/ui/form/Textinput';
import Select from '../../components/ui/form/Select';
import Upload from '../../components/ui/form/Upload';
import Form from '../../components/ui/form/Form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Bento from '../../components/box/bento/Bento';
import Title from '../../components/ui/textual/Title';
import Hero from '../../components/box/section/Hero';
import useRoleOptions from '../../hooks/getdata/GetRole';
import PasswordInput from '../../components/ui/form/Password';
import Logo from '../../components/illustration/Logo.js';
import FormError from '../../components/ui/form/FormError';
import { showToast, ToastContainer, notifySuccess, notifyError, notifyInfo, notifyWarning, notifyDefault } from '../../components/ui/Toastify';
import DefaultLayout from '../../layout/DefaultLayout'
import { CiImageOn } from "react-icons/ci";
import getToken from '../../hooks/getdata/getToken';

function CreateModule() {
    const handleImageDelete = () => {
        setImage(null);
    };
    const token = getToken()

    const [errors, setErrors] = useState({});

    const [confirmPassword, setConfirmPassword] = useState('');
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(null);
    const [role_id, setRole] = useState('');
    const [password, setPassword] = useState('');
    const Navigate = useNavigate();

    const roleOptions = useRoleOptions();

    const handlePageImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors((prevErrors) => ({ ...prevErrors, password: '' }));

        if (password !== confirmPassword) {
            setErrors({ ...errors, password: "Les 2 mots de passe ne se correspondent pas" });
            notifyError("Le compte n'a pas pu être ajouté");
            return;
        }

        else if (password === '' && confirmPassword === '') {
            setErrors({ ...errors, password: "Le mot de passe ne peut pas être vide" });
            notifyError("Le compte n'a pas pu être ajouté");
            return;
        }

        const formData = new FormData();
        formData.append('surname', surname);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role_id', role_id);
        formData.append('image', image);

        axios
            .post('http://localhost:8081/user/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "access-token" : token,
                },
            })
            .then((res) => {
                console.log(res);
                notifySuccess("Compte ajouté avec succès");
                Navigate('/admin/comptes');
            })
            .catch((err) => {
                if (err.response && err.response.status === 409) {
                    const errorMessage = err.response.data;
                    setErrors((prevErrors) => ({ ...prevErrors, email: errorMessage }));
                    notifyError("Le compte n'a pas pu être ajouté");
                }
            });

    };

    return (
        <DefaultLayout>
            <Hero>
                <Bento width="450px" highlight="highlight" padding="40px">
                    <Title level={1}>
                        Ajouter un compte
                    </Title>
                    <Form onSubmit={handleSubmit}>
                        <Logo />
                        <TextInput
                            type="text"
                            variant="blue"
                            label="Prénom"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextInput
                            type="text"
                            variant="blue"
                            label="Nom"
                            onChange={(e) => setSurname(e.target.value)}
                        />
                        <TextInput
                            type="email"
                            variant="blue"
                            label="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <PasswordInput
                            type="password"
                            variant="blue"
                            label="Mot de passe"
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
                        {errors.password && <FormError variant="error">{errors.password}</FormError>}
                        {errors.email && <FormError variant="error">{errors.email}</FormError>}
                        <Select
                            options={roleOptions}
                            onSelect={(selectedOption) => setRole(selectedOption.id)}
                            defaultText="Sélectionnez un rôle..." // Texte par défaut personnalisé
                        />
                        <Upload
                            onFileDelete={handleImageDelete}
                            name="image"
                            accept="image/png, image/jpeg"
                            onChange={handlePageImageChange}
                        />
                        <Button type="submit" width="full-width" variant="primary">
                            Valider
                        </Button>
                    </Form>
                </Bento>
            </Hero>
        </DefaultLayout>
    );
}

export default CreateModule;
