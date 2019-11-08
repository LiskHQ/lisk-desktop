import React from 'react';
import { PrimaryButton } from '../../toolbox/buttons/button';
import useServiceSocketUpdates from '../../../hooks/useServiceSocketUpdates';

const LoadLatestButton = ({ children, onClick, event }) => {
  const [isUpdateAvailable, hideUpdateButton] = useServiceSocketUpdates(event);

  const handleClick = () => {
    hideUpdateButton();
    onClick();
  };

  return (isUpdateAvailable
    // TODO apply custom style and show animation of the button
    ? <PrimaryButton onClick={handleClick}>{children}</PrimaryButton>
    : null);
};


export default LoadLatestButton;
