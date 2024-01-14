import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Title from '../../components/ui/textual/Title';
import Tips from '../../components/ui/textual/Tips';
import Hero from '../../components/box/section/Hero';
import Logo from '../../components/illustration/Logo.js';
import TextInput from '../../components/ui/form/Textinput';
import Textarea from '../../components/ui/form/Textarea';
import Button from '../../components/ui/button/Button';
import Form from '../../components/ui/form/Form';
import FormError from '../../components/ui/form/FormError';
import { notifySuccess, notifyError } from '../../components/ui/Toastify';
import DefaultLayout from '../../layout/DefaultLayout'
import Bento from '../../components/box/bento/Bento';
import getToken from '../../hooks/getdata/getToken';

function NewBlackListIp() {
  const [errors, setErrors] = useState({});
  const [ip, setIp] = useState('');
  const [confirmIp, setConfirmIp] = useState('');
  const [raison, setRaison] = useState(''); // État pour stocker la raison
  const Navigate = useNavigate();
  const token = getToken()

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation du formulaire
    if (!ip || !confirmIp || !raison) {
      setErrors({ message: 'Veuillez saisir toutes les informations.' });
      return;
    }

    if (ip !== confirmIp) {
      setErrors({ message: "Les adresses IP ne correspondent pas." });
      notifyError("L'adresse IP n'a pas pu être ajoutée");
      return;
    }

    // Envoyer la requête au serveur pour ajouter l'IP à la liste noire
    try {
      const response = await axios.post('http://localhost:8081/addBlacklistIp', { ip, raison }, {
        headers: {
          "access-token": token,
        },
      });
      notifySuccess('Adresse IP ajoutée avec succès à la liste noire.');
      Navigate('/admin/blacklist'); // Rediriger ou effectuer une action après ajout réussi
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'adresse IP à la liste noire :", error);
      notifyError("Erreur lors de l'ajout de l'adresse IP à la liste noire.");
    }
  };


  return (
    <DefaultLayout>
      <Hero>
        <Bento width="450px" highlight="highlight" padding="40px">
          <Title level={1}>
            Bloquer une adresse IP
          </Title>
          <Form onSubmit={handleSubmit}>
            <Logo />
            <TextInput
              type="text"
              variant="blue"
              label="Adresse IP"
              onChange={(e) => setIp(e.target.value)}
            />
            <TextInput
              type="text"
              variant="blue"
              label="Confirmez l'adresse IP"
              onChange={(e) => setConfirmIp(e.target.value)}
            />
            <Textarea
              variant="blue"
              label="Raisons du ban"
              onChange={(e) => setRaison(e.target.value)}
              value={raison}
              maxCharCount={250}
            />
            <Tips variant="warning">
              Cette adresse IP ne pourra plus se connecter à l'API, mais vous pourrez revenir en arrière plus tard.
            </Tips>
            <Button type="submit" width="full-width" variant="primary">
              Valider
            </Button>
            {errors.message && <FormError variant="error">{errors.message}</FormError>}
          </Form>
        </Bento>
      </Hero>
    </DefaultLayout>
  );
}

export default NewBlackListIp;
