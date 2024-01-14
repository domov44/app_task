import React from 'react';
import styled from 'styled-components';

const StyledCurrentDate = styled.span`
  color: ${(props) => (props.$highlight === 'day' ? 'var(--main-color)' : 'inherit')};
  text-transform: ${(props) => (props.$uppercase ? 'capitalize' : 'none')};
`;

const formatDate = (date, variant, highlight, uppercase) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const day = new Date(date).getDate();

  if (variant === 'long') {
    options.weekday = 'long';
    options.day = day === 1 ? 'numeric' : '2-digit';
  } else if (variant === 'short') {
    options.weekday = 'short';
    options.month = 'short';
    options.day = day === 1 ? 'numeric' : '2-digit';
  } else if (variant === 'numeric') {
    options.month = 'numeric';
  }

  const formattedDate = new Date(date).toLocaleDateString('fr-FR', options);

  if (variant === 'long' || variant === 'short') {
    const dayString = formattedDate.split(' ')[0]; // Séparer le jour du reste de la date
    const dateWithoutDay = formattedDate.replace(/\b1\b/, '1er').replace(dayString, '');
    const highlightedDay = highlight === 'day' ? <StyledCurrentDate $highlight={highlight} $uppercase={uppercase}>{dayString}</StyledCurrentDate> : dayString;

    return (
      <span>
        {highlightedDay}
        {dateWithoutDay}
      </span>
    );
  }

  return formattedDate;
};

const CurrentDate = ({ variant, highlight, uppercase }) => {
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate, variant, highlight, uppercase);

  return <>{formattedDate}</>;
};

export default CurrentDate;
