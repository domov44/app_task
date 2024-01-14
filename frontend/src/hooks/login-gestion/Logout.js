import React, { useContext } from 'react';
import axios from 'axios';
import MenuItem from '../../components/ui/aside-section/HeaderItems';
import { CiLogout } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { showToast, ToastContainer, notifySuccess, notifyError, notifyInfo, notifyWarning, notifyDefault } from '../../components/ui/Toastify';
import { UserContext } from '../getdata/UserContext';

const Logout = () => {
    const navigate = useNavigate();
    const { handleLogout } = useContext(UserContext); // Utiliser la fonction de déconnexion du contexte

    const handleLogoutRequest = () => {
        axios.get('http://localhost:8081/user/logout')
            .then(res => {
                if (res.data.Status === "Success") {
                    // Supprime le token du localStorage et du sessionStorage
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    notifySuccess("Déconnexion réussie");
                    handleLogout(); // Fonction de déconnexion du contexte
                    navigate('/se-connecter');
                }
            })
            .catch(err => console.log(err))
    };

    return (
        <MenuItem text="Se déconnecter" onClick={handleLogoutRequest} icon={CiLogout} variant="danger" />
    );
};

export default Logout;
