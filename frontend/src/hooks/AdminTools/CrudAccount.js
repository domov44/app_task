import React, { useEffect, useState, useReducer } from "react";
import Button from '../../components/ui/button/Button';
import IconButton from '../../components/ui/button/IconButton'
import Title from '../../components/ui/textual/Title';
import Pastille from '../../components/ui/textual/Pastille';
import Text from '../../components/ui/textual/Text';
import TextInput from '../../components/ui/form/Textinput';
import Th from '../../components/ui/table/Th';
import Td from '../../components/ui/table/Td';
import Tr from '../../components/ui/table/Tr';
import Table from '../../components/ui/table/Table';
import Checkbox from '../../components/ui/checkbox/CheckboxItem';
import axios from 'axios';
import { CiTrash, CiEdit } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import Container from '../../components/box/container/Container';
import { successMessageEvent } from '../events/customEvents';
import { showToast, ToastContainer, notifySuccess, notifyError, notifyInfo, notifyWarning, notifyDefault } from '../../components/ui/Toastify';
import { confirm } from '../../components/confirm/ConfirmGlobal';
import CrudSkeleton from '../../components/skeleton/CrudSkeleton';
import getToken from '../getdata/getToken';

const CrudAccount = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const accountReducer = (state, action) => {
        switch (action.type) {
            case "SET_ACCOUNTS":
                setLoading(false); // Mettez à jour l'état loading après le chargement des données
                return action.payload;
            case "DELETE_ACCOUNT":
                return state.filter(account => account.id !== action.payload);
            default:
                return state;
        }
    };

    const [crudAccounts, dispatch] = useReducer(accountReducer, []);
    const [selectAll, setSelectAll] = useState(false);
    const [childCheckboxes, setChildCheckboxes] = useState({});
    const [deleteButtonState, setDeleteButtonState] = useState("notactive");
    const [selectedCount, setSelectedCount] = useState(0);
    const token = getToken();

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:8081/user', {
                headers: {
                    'access-token': token,
                },
            })
                .then(res => {
                    dispatch({ type: "SET_ACCOUNTS", payload: res.data });
                    const initialChildCheckboxes = {};
                    res.data.forEach(data => {
                        initialChildCheckboxes[data.id] = false;
                    });
                    setChildCheckboxes(initialChildCheckboxes);
                })
                .catch(err => console.log(err));
        }
    }, []);

    const handleDelete = async (id) => {
        if (await confirm({ title: "Voulez-vous vraiment supprimer définitivement ce compte ?", content: "L'utilisateur ne pourra plus se connecter sur l'application", variant: "danger" })) {
            try {
                await axios.delete(`http://localhost:8081/user/delete/${id}`, {
                    headers: {
                        "access-token": token,
                    },
                });
                dispatch({ type: "DELETE_ACCOUNT", payload: id });
                notifySuccess("Compte supprimé avec succès");
                navigate('/admin/comptes');
            } catch (err) {
                console.log(err);
            }
        }
    }

    const handleBulkDelete = async () => {
        const selectedAccountIds = Object.keys(childCheckboxes);
        let deletedCount = 0; // Pour compter le nombre de comptes supprimés

        if (await confirm({ title: `Voulez-vous vraiment supprimer ${selectedCount} compte${selectedCount > 1 ? 's' : ''} de manière définitive ?`, content: "Cette suppression sera définitive et les utilisateurs sélectionnés ne pourront plus se connecter.", variant: "danger" })) {
            for (const id of selectedAccountIds) {
                if (childCheckboxes[id]) {
                    try {
                        await axios.delete(`http://localhost:8081/user/delete/` + id, {
                            headers: {
                                "access-token": token,
                            },
                        });
                        deletedCount++;
                    } catch (err) {
                        console.log(err);
                    }
                }
            }

            // Filtrer les comptes supprimés de l'état crudAccounts
            const updatedAccounts = crudAccounts.filter(account => !childCheckboxes[account.id]);
            dispatch({ type: "SET_ACCOUNTS", payload: updatedAccounts });

            // Message de succès avec le nombre de comptes supprimés
            const successMessage = `${deletedCount} compte${deletedCount > 1 ? 's' : ''} supprimé${deletedCount > 1 ? 's' : ''} avec succès`;
            notifySuccess(successMessage);
            navigate('/admin/comptes');
            // Réinitialiser l'état après la suppression
            setSelectAll(false);
            setSelectedCount(0);
            setChildCheckboxes({});

            // Réinitialiser le bouton
            setDeleteButtonState("notactive");
        }
    };


    const handleChildCheckboxChange = (id) => {
        const updatedChildCheckboxes = { ...childCheckboxes };
        updatedChildCheckboxes[id] = !childCheckboxes[id];
        setChildCheckboxes(updatedChildCheckboxes);

        const count = Object.values(updatedChildCheckboxes).filter(checked => checked).length;
        setSelectedCount(count);

        const allChildrenChecked = Object.values(updatedChildCheckboxes).every(checked => checked);
        setSelectAll(allChildrenChecked);
    };

    useEffect(() => {
        const atLeastOneChecked = Object.values(childCheckboxes).some(checked => checked);
        setDeleteButtonState(atLeastOneChecked ? "active" : "notactive");
    }, [childCheckboxes]);

    const handleSelectAllChange = () => {
        const updatedChildCheckboxes = {};
        const newSelectAll = !selectAll;
        crudAccounts.forEach(data => {
            updatedChildCheckboxes[data.id] = newSelectAll;
        });
        setChildCheckboxes(updatedChildCheckboxes);
        setSelectAll(newSelectAll);

        const count = newSelectAll ? crudAccounts.length : 0;
        setSelectedCount(count);
    };

    return (
        <>
            <Container variant="normal" direction="row" justify="space-between">
                <Title level={1}>
                    Base de données
                </Title>
                <Container variant="normal" direction="row">
                    <IconButton
                        type='submit'
                        width="fit-content"
                        variant="danger"
                        enable={deleteButtonState}
                        onClick={deleteButtonState === "active" ? handleBulkDelete : null}
                    >
                        <CiTrash /> Supprimer ({selectedCount})
                    </IconButton>
                    <Link to="/admin/comptes/creer-compte">
                        <IconButton type='submit' width="fit-content" variant="action"><IoMdAdd /> Ajouter</IconButton>
                    </Link>
                </Container>
            </Container>
            {loading ? (
                <CrudSkeleton />
            ) : (
                <Table>
                    <thead>
                        <tr>
                            <Th variant="basique">
                                <Checkbox
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAllChange}
                                />
                            </Th>
                            <Th variant="basique">Photo</Th>
                            <Th variant="basique">ID</Th>
                            <Th variant="basique">Prénom</Th>
                            <Th variant="basique">Nom</Th>
                            <Th variant="basique">Rôle</Th>
                            <Th variant="basique">Email</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(crudAccounts) ? (
                            crudAccounts.map((data, i) => (
                                <Tr key={data.id}>
                                    <Td>
                                        <Checkbox
                                            type="checkbox"
                                            checked={childCheckboxes[data.id] || false}
                                            onChange={() => handleChildCheckboxChange(data.id)}
                                        />
                                    </Td>
                                    <Td>
                                        <img
                                            src={data.picture}
                                            className="user-picture"
                                            style={{
                                                height: '50px', width: '50px', objectFit: 'cover',
                                                borderRadius: '50%',
                                            }} alt={`user-${data.id}-picture`}
                                        />
                                    </Td>
                                    <Td>{data.id}</Td>
                                    <Td>{data.name}</Td>
                                    <Td>{data.surname}</Td>
                                    <Td>
                                        <Pastille variant={data.role_label === 'Administrateur' ? 'success' : data.role_label === 'Client' ? 'primary' : 'primary'}>
                                            {data.role_label}
                                        </Pastille>
                                    </Td>
                                    <Td>{data.email}</Td>
                                    <Td>
                                        <Link to={`/admin/compte/modifier/${data.id}`}>
                                            <IconButton type='submit' wtext="no" width="fit-content" variant="secondary-action"><CiEdit /></IconButton>
                                        </Link>
                                    </Td>
                                    <Td>
                                        <IconButton wtext="no" onClick={e => handleDelete(data.id)} variant="danger"><CiTrash /></IconButton>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <tr>
                                <Td colSpan="7">Aucun compte à afficher</Td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
        </>
    );
}

export default CrudAccount;