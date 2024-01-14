import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import getToken from './getToken';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const initialUserData = {
    name: '',
    description: '',
    ddn: '',
    creation_date: '',
    surname: '',
    picture: '',
    email: '',
    role: '',
    role_id: null,
    ville: '',
    entreprise: '',
    poste: '',
    poste_id: null,
    linkedin: '',
    site_web: '',
    cover_url: '',
    cover_label: '',
  };

  const [userData, setUserData] = useState(initialUserData);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);

  const [reloadUserData, setReloadUserData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();

        if (token) {
          const response = await axios.get('http://localhost:8081/user/getUserData', {
            headers: {
              'access-token': token,
            },
          });

          if (response.data && response.data.name) {
            const {
              name,
              description,
              ddn,
              creation_date,
              surname,
              picture,
              email,
              role,
              role_id,
              ville,
              entreprise,
              poste,
              poste_id,
              linkedin,
              site_web,
              cover_url,
              cover_label,
            } = response.data;

            const birthDate = new Date(ddn);
            const formattedBirthDate =
              ("0" + birthDate.getDate()).slice(-2) +
              "/" +
              ("0" + (birthDate.getMonth() + 1)).slice(-2) +
              "/" +
              birthDate.getFullYear();

            const creationDate = new Date(creation_date);

            setUserData((prevUserData) => ({
              ...prevUserData,
              name,
              description,
              ddn: formattedBirthDate,
              creation_date,
              surname,
              picture,
              email,
              role,
              role_id,
              ville,
              entreprise,
              poste,
              poste_id,
              linkedin,
              site_web,
              cover_url,
              cover_label,
            }));

            setIsUserDataLoaded(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

  }, [reloadUserData]);

  const handleUpdateUserData = () => {
    setReloadUserData((prev) => !prev);
  };

  const handleLogout = () => {
    setUserData(initialUserData);
    setReloadUserData((prev) => !prev);
  };

  const calculateAge = (birthDate) => {
    const formattedDate = birthDate.split('/').reverse().join('/');
    const today = new Date();
    const dob = new Date(formattedDate);
    let age = today.getFullYear() - dob.getFullYear();

    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
      age--;
    }

    return age >= 0 ? age : 0;
  };

  const calculateDaysSinceCreation = (creationDate) => {
    const today = new Date();
    const creation = new Date(creationDate);
    const timeDiff = today - creation;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };

  const dataWithAgeAndDays = {
    ...userData,
    age: calculateAge(userData.ddn),
    daysSinceCreation: calculateDaysSinceCreation(userData.creation_date),
  };

  return (
    <UserContext.Provider value={{ userData: dataWithAgeAndDays, handleUpdateUserData, handleLogout, isUserDataLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
