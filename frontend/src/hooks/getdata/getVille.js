import { useState, useEffect } from 'react';
import axios from 'axios';
import getToken from './getToken';

function useVilleOptions() {
  const [VilleOptions, setVilleOptions] = useState([]);
  const token = getToken();

  useEffect(() => {
    axios
      .get('http://localhost:8081/ville', {
        headers: {
          "access-token": token,
        },
      })
      .then((response) => {
        setVilleOptions(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return VilleOptions;
}


export default useVilleOptions;
