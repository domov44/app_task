import React, { useEffect, useState } from "react";
import Table from '../../components/ui/table/Table';
import Th from '../../components/ui/table/Th';
import Td from '../../components/ui/table/Td';
import Tr from '../../components/ui/table/Tr';
import Checkbox from '../../components/ui/checkbox/CheckboxItem';
import IconButton from '../../components/ui/button/IconButton';
import Pastille from '../../components/ui/textual/Pastille';
import axios from 'axios';
import Button from '../../components/ui/button/Button';
import Title from '../../components/ui/textual/Title';
import Text from '../../components/ui/textual/Text';
import TextInput from '../../components/ui/form/Textinput';
import { CiTrash, CiEdit, CiNoWaitingSign } from "react-icons/ci";
import { Link } from "react-router-dom";
import Container from '../../components/box/container/Container';
import { showToast, ToastContainer, notifySuccess, notifyError, notifyInfo, notifyWarning, notifyDefault } from '../../components/ui/Toastify';
import { confirm } from '../../components/confirm/ConfirmGlobal';
import getToken from '../getdata/getToken';

function RequestLog() {
    const [logs, setLogs] = useState([]);
    const [childCheckboxes, setChildCheckboxes] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [deleteButtonState, setDeleteButtonState] = useState("notactive");
    const token = getToken();

    useEffect(() => {
        axios.get('http://localhost:8081/logs', {
            headers: {
                "access-token": token,
            },
        })
            .then(response => {
                const logsData = response.data;
                setLogs(logsData);

                const initialChildCheckboxes = {};
                logsData.forEach(log => {
                    initialChildCheckboxes[log.timestamp] = false;
                });
                setChildCheckboxes(initialChildCheckboxes);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des logs:', error);
            });
    }, []);

    const handleDeleteLog = async (timestamp) => {
        if (await confirm({ title: "Voulez-vous vraiment supprimer définitivement ce log ?", content: "Cette action est définitive et le log sera supprimé", variant: "danger" })) {
            try {
                await axios.delete(`http://localhost:8081/logs/${timestamp}`, {
                    headers: {
                        "access-token": token,
                    },
                });
                const updatedLogs = logs.filter(log => log.timestamp !== timestamp);
                setLogs(updatedLogs);
                notifySuccess("Log supprimé avec succès");
            } catch (error) {
                console.error('Erreur lors de la suppression du log:', error);
            }
        }
    };

    const handleSelectAllChange = () => {
        const updatedChildCheckboxes = {};
        const newSelectAll = !selectAll;
        logs.forEach(log => {
            updatedChildCheckboxes[log.timestamp] = newSelectAll;
        });
        setChildCheckboxes(updatedChildCheckboxes);
        setSelectAll(newSelectAll);

        setDeleteButtonState(newSelectAll ? "active" : "notactive");
    };

    const handleChildCheckboxChange = (timestamp) => {
        const updatedChildCheckboxes = { ...childCheckboxes };
        updatedChildCheckboxes[timestamp] = !childCheckboxes[timestamp];
        setChildCheckboxes(updatedChildCheckboxes);

        const atLeastOneChecked = Object.values(updatedChildCheckboxes).some(checked => checked);

        setDeleteButtonState(atLeastOneChecked ? "active" : "notactive");

        const allChildrenChecked = Object.values(updatedChildCheckboxes).every(checked => checked);
        setSelectAll(allChildrenChecked);
    };

    const handleBulkDeleteLogs = async () => {
        const selectedTimestamps = Object.keys(childCheckboxes).filter(timestamp => childCheckboxes[timestamp]);

        if (selectedTimestamps.length === 0) {
            return;
        }

        if (await confirm({ title: `Voulez-vous vraiment supprimer ${selectedTimestamps.length} log${selectedTimestamps.length > 1 ? 's' : ''} de manière définitive ?`, content: "Cette action est définitive.", variant: "danger" })) {
            for (const timestamp of selectedTimestamps) {
                try {
                    await axios.delete(`http://localhost:8081/logs/${timestamp}`, {
                        headers: {
                            "access-token": token,
                        },
                    });
                } catch (error) {
                    console.error('Erreur lors de la suppression du log:', error);
                }
            }

            const updatedLogs = logs.filter(log => !selectedTimestamps.includes(log.timestamp));
            setLogs(updatedLogs);

            const successMessage = `${selectedTimestamps.length} log${selectedTimestamps.length > 1 ? 's' : ''} supprimé${selectedTimestamps.length > 1 ? 's' : ''} avec succès`;
            notifySuccess(successMessage);

            setSelectAll(false);
            setChildCheckboxes({});
            setDeleteButtonState("notactive");
        }
    };



    return (
        <>
            <Container variant="normal" direction="row" justify="space-between" align="center">
                <Title level={1}>
                    Requêtes serveurs
                </Title>
                <Container variant="normal" direction="row">
                    <IconButton
                        type='submit'
                        width="fit-content"
                        variant="danger"
                        enable={deleteButtonState} // Utilisation de l'état pour activer/désactiver le bouton
                        onClick={handleBulkDeleteLogs}
                    >
                        Supprimer ({Object.values(childCheckboxes).filter(checked => checked).length})
                    </IconButton>
                    <Link to="/admin/blacklist/ajouter-ip">
                        <IconButton type='submit' width="fit-content" variant="action"><CiNoWaitingSign /> Bloquer une IP</IconButton>
                    </Link>
                </Container>
            </Container>
            <Table>
                <thead>
                    <tr>
                        <Th variant="basique">
                            <Checkbox type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
                        </Th>
                        <Th variant="basique">Date</Th>
                        <Th variant="basique">Requête</Th>
                        <Th variant="basique">IP</Th>
                        <Th variant="basique">Status</Th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log, index) => (
                        <Tr key={index}>
                            <Td>
                                <Checkbox
                                    type="checkbox"
                                    checked={childCheckboxes[log.timestamp] || false}
                                    onChange={() => handleChildCheckboxChange(log.timestamp)}
                                />
                            </Td>
                            <Td>{log.formattedTimestamp}</Td>
                            <Td><Pastille variant="primary">{log.requete}</Pastille></Td>
                            <Td>{log.ip}</Td>
                            <Td><Pastille variant={log.status === 'Réussie' ? 'success' : log.status === 'Échouée' ? 'danger' : 'primary'}>{log.status}</Pastille></Td>
                            <Td>
                                <IconButton wtext="no" variant="danger" onClick={() => handleDeleteLog(log.timestamp)}>
                                    <CiTrash />
                                </IconButton>
                            </Td>
                        </Tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default RequestLog;
