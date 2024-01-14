// ProfileCompletionCircle.js
import React, { useContext, useEffect, useState } from 'react';
import CircleProgress from './CircleProgress';
import { UserContext } from '../../../hooks/getdata/UserContext';

const ProfileCompletionCircle = () => {
  const { userData, isUserDataLoaded } = useContext(UserContext);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    if (!isUserDataLoaded) {
      return; // Si les données utilisateur ne sont pas chargées, ne rien faire
    }

    const contextFields = ['name', 'description', 'ddn', 'surname', 'email', 'ville', 'entreprise', 'poste', 'linkedin', 'site_web'];

    const filledFields = contextFields.filter(fieldName => userData[fieldName] !== '' && userData[fieldName] !== null).length;
    const totalFields = contextFields.length;
    const percentage = Math.round((filledFields / totalFields) * 100);

    setCompletionPercentage(percentage);

  }, [userData, isUserDataLoaded]);

  return <CircleProgress progress={completionPercentage} />;
};

export default ProfileCompletionCircle;