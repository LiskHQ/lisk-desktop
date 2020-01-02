import React from 'react';
import { PrimaryButton } from '../../toolbox/buttons/button';
import Icon from '../../toolbox/icon';
import useServiceSocketUpdates from '../../../hooks/useServiceSocketUpdates';
import styles from './loadLatestButton.css';

const LoadLatestButton = ({ children, onClick, event }) => {
  const [isUpdateAvailable, hideUpdateButton] = useServiceSocketUpdates(event);

  const handleClick = () => {
    hideUpdateButton();
    onClick();
  };

  return (isUpdateAvailable
    ? (
      <PrimaryButton onClick={handleClick} className={styles.button}>
        <Icon name="arrowUpCircle" className={styles.icon} />
        {children}
      </PrimaryButton>
    )
    : null);
};


export default LoadLatestButton;
