import { useState, useEffect } from 'react';
import axios from 'axios';
import getToken from './getToken';

function usePosteOptions() {
  const [PosteOptions, setPosteOptions] = useState([]);
  const token = getToken();

  useEffect(() => {
    axios
      .get('http://localhost:8081/poste', {
        headers: {
          "access-token": token,
        },
      })
      .then((response) => {
        setPosteOptions(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return PosteOptions;
}


export default usePosteOptions;
