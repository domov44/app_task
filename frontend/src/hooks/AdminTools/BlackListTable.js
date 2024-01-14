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

function BlackListTable() {
  const [blacklistedIPs, setBlacklistedIPs] = useState([]);
  const [childCheckboxes, setChildCheckboxes] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [deleteButtonState, setDeleteButtonState] = useState("notactive");
  const token = getToken();

  useEffect(() => {
    const blacklistPath = 'http://localhost:8081/blacklist';

    axios.get(blacklistPath, {
      headers: {
        "access-token": token,
      },
    })
      .then(response => {
        const blacklistedIPsData = response.data;
        console.log('Blacklisted IPs Data:', blacklistedIPsData);
        setBlacklistedIPs(blacklistedIPsData);

        const initialChildCheckboxes = {};
        blacklistedIPsData.forEach(entry => {
          initialChildCheckboxes[entry.ip] = false;
        });
        setChildCheckboxes(initialChildCheckboxes);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des adresses IP blacklistées :', error);
      });
  }, []);


  const handleDeleteIP = async (ip) => {
    if (await confirm({ title: `Voulez-vous vraiment supprimer l'adresse IP ${ip} de la liste noire ?`, content: "Cette adresse IP pourra de nouveau effectuer des requêtes sur l'application.", variant: "danger" })) {
      try {
        await axios.delete(`http://localhost:8081/blacklist/${ip}`, {
          headers: {
            "access-token": token,
          },
        });
        const updatedIPs = blacklistedIPs.filter(blacklistIP => blacklistIP.ip !== ip);
        setBlacklistedIPs(updatedIPs);
        notifySuccess(`Adresse IP ${ip} supprimée avec succès`);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'adresse IP blacklistée :', error);
      }
    }
  };


  const handleSelectAllChange = () => {
    const updatedChildCheckboxes = {};
    const newSelectAll = !selectAll;
    blacklistedIPs.forEach(ip => {
      updatedChildCheckboxes[ip.address] = newSelectAll;
    });
    setChildCheckboxes(updatedChildCheckboxes);
    setSelectAll(newSelectAll);

    setDeleteButtonState(newSelectAll ? "active" : "notactive");
  };

  const handleChildCheckboxChange = (ip) => {
    const updatedChildCheckboxes = { ...childCheckboxes };
    updatedChildCheckboxes[ip] = !childCheckboxes[ip];
    setChildCheckboxes(updatedChildCheckboxes);

    const atLeastOneChecked = Object.values(updatedChildCheckboxes).some(checked => checked);
    setDeleteButtonState(atLeastOneChecked ? "active" : "notactive");

    const allChildrenChecked = Object.values(updatedChildCheckboxes).every(checked => checked);
    setSelectAll(allChildrenChecked);
  };


  const handleBulkDeleteIPs = async () => {
    const selectedIPs = Object.keys(childCheckboxes).filter(ip => childCheckboxes[ip]);

    if (selectedIPs.length === 0) {
      return;
    }

    if (await confirm({ title: `Voulez-vous vraiment supprimer ${selectedIPs.length} adresse${selectedIPs.length > 1 ? 's' : ''} IP de manière définitive ?`, content: "Cette action est définitive.", variant: "danger" })) {
      for (const ip of selectedIPs) {
        try {
          await axios.delete(`http://localhost:8081/blacklist/${ip}`, {
            headers: {
              "access-token": token,
            },
          });
        } catch (error) {
          console.error('Erreur lors de la suppression de l\'adresse IP blacklistée :', error);
        }
      }

      const updatedIPs = blacklistedIPs.filter(blacklistIP => !selectedIPs.includes(blacklistIP.ip));
      setBlacklistedIPs(updatedIPs);

      const successMessage = `${selectedIPs.length} adresse${selectedIPs.length > 1 ? 's' : ''} IP supprimée${selectedIPs.length > 1 ? 's' : ''} avec succès`;
      notifySuccess(successMessage);

      setSelectAll(false);
      setChildCheckboxes({});
      setDeleteButtonState("notactive");
    }
  };


  return (
    <>
      <Container variant="normal" direction="row" justify="space-between">
        <Title level={1}>
          IP blacklistées
        </Title>
        <Container variant="normal" direction="row">
          <IconButton
            type='submit'
            width="fit-content"
            variant="danger"
            enable={deleteButtonState}
            onClick={handleBulkDeleteIPs}
          >
            Supprimer ({Object.values(childCheckboxes).filter(checked => checked).length})
          </IconButton>
          <Link to="/admin/blacklist/ajouter-ip">
            <IconButton type='submit' width="fit-content" variant="action"><CiNoWaitingSign /> Bloquer une IP</IconButton>
          </Link>
        </Container>
      </Container>

      {blacklistedIPs.length === 0 ? (
        <Text variant="subdued">Aucune adresse IP blacklistée pour le moment.</Text>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th variant="basique">
                <Checkbox type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
              </Th>
              <Th variant="basique">Date d'ajout</Th>
              <Th variant="basique">Adresse IP</Th>
              <Th variant="basique">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {blacklistedIPs.map((entry, index) => (
              <Tr key={index}>
                <Td>
                  <Checkbox
                    type="checkbox"
                    checked={childCheckboxes[entry.ip] || false}
                    onChange={() => handleChildCheckboxChange(entry.ip)}
                  />
                </Td>
                <Td>{entry.timestamp}</Td>
                <Td>{entry.ip}</Td>
                <Td>
                  <IconButton wtext="no" variant="danger" onClick={() => handleDeleteIP(entry.ip)}>
                    <CiTrash />
                  </IconButton>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default BlackListTable;
