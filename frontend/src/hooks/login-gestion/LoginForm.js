import { UserContext } from '../../hooks/getdata/UserContext';
import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/style/style.css';
import Button from '../../components/ui/button/Button';
import TextInput from '../../components/ui/form/Textinput';
import PasswordInput from '../../components/ui/form/Password';
import FormError from '../../components/ui/form/FormError';
import Form from '../../components/ui/form/Form';
import Checkbox from '../../components/ui/checkbox/CheckboxItem';
import Validation from './LoginValidation';
import Logo from '../../components/illustration/Logo.js';
import { showToast, ToastContainer, notifySuccess, notifyError, notifyInfo, notifyWarning, notifyDefault } from '../../components/ui/Toastify';

function LoginForm() {
    const { handleUpdateUserData } = useContext(UserContext);

    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [rememberMe, setRememberMe] = useState(false); // État pour la case à cocher
    const [globalError, setGlobalError] = useState('');

    const form = useRef(null);

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        setGlobalError("");
    };


    const handleRememberMeChange = (event) => {
        setRememberMe(event.target.checked); // Met à jour l'état "rememberMe" en fonction de la case à cocher
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);
        const hasErrors = Object.values(validationErrors).some((error) => error !== '');

        if (!hasErrors) {
            axios
                .post('http://localhost:8081/user/login', values)
                .then((res) => {
                    if (res.data.Login) {
                        if (rememberMe) {
                            localStorage.setItem("token", res.data.token);
                        } else {
                            sessionStorage.setItem("token", res.data.token);
                        }
                        notifySuccess("Connexion établie avec succès");
                        handleUpdateUserData(); // Met à jour le contexte
                        navigate('/');
                    } else {
                        setErrors({ ...errors, password: "Email ou mot de passe incorrect" });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    if (err.response && err.response.status === 429) {
                        setGlobalError("Trop de tentatives. Veuillez réessayer plus tard.");
                    } else {
                        setGlobalError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
                    }
                });
        }
    };



    return (
        <Form ref={form} onSubmit={handleSubmit} autoComplete="on">
            <Logo />
            <TextInput
                type="email"
                id="email"
                variant="blue"
                label="Email"
                name='email'
                autoComplete="email"
                onChange={handleInput}
            />
            {errors.email && <FormError variant="error">{errors.email}</FormError>}
            <PasswordInput
                type="password"
                variant="blue"
                name='password'
                label="Mot de passe"
                autoComplete="password"
                onChange={handleInput}
            />
            {errors.password && <FormError variant="error">{errors.password}</FormError>}
            {globalError && <FormError variant="error">{globalError}</FormError>}
            <Checkbox label="Se souvenir de moi" onChange={handleRememberMeChange} />
            <Button type='submit' width="full-width" variant="primary">Se connecter</Button>
        </Form>
    );
}

export default LoginForm;
