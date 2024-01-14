import { useState, useEffect } from 'react';
import axios from 'axios';
import getToken from './getToken';

function useRoleOptions() {
  const [roleOptions, setRoleOptions] = useState([]);
  const token = getToken();

  useEffect(() => {
    axios
      .get('http://localhost:8081/roles', {
        headers: {
          "access-token": token,
        },
      })
      .then((response) => {
        setRoleOptions(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return roleOptions;
}


export default useRoleOptions;
