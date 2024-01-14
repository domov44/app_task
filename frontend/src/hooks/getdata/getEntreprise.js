import { useState, useEffect } from 'react';
import axios from 'axios';
import getToken from './getToken';

function useEntrepriseOptions() {
  const [EntrepriseOptions, setEntrepriseOptions] = useState([]);
  const token = getToken();

  useEffect(() => {
    axios
      .get('http://localhost:8081/entreprise', {
        headers: {
          "access-token": token,
        },
      })
      .then((response) => {
        setEntrepriseOptions(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return EntrepriseOptions;
}


export default useEntrepriseOptions;
