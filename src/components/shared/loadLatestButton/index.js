import React, { useEffect, useState } from 'react';
import { PrimaryButton } from '../../toolbox/buttons/button';
import Icon from '../../toolbox/icon';
import useServiceSocketUpdates from '../../../hooks/useServiceSocketUpdates';
import styles from './loadLatestButton.css';

const LoadLatestButton = ({ children, onClick, event }) => {
  const [isUpdateAvailable, hideUpdateButton] = useServiceSocketUpdates(event);
  const [hasUpdatedRecently, didUpdateRecently] = useState(false);

  const handleClick = () => {
    hideUpdateButton();
    const timer = setTimeout(() => {
      didUpdateRecently(false);
    }, 10000);
    didUpdateRecently(timer);
    onClick();
  };

  // willUnmount
  useEffect(() => () => clearTimeout(hasUpdatedRecently), []);

  return (isUpdateAvailable && hasUpdatedRecently === false
    ? (
      <PrimaryButton onClick={handleClick} className={styles.button}>
        <Icon name="arrowUpCircle" className={styles.icon} />
        {children}
      </PrimaryButton>
    )
    : null);
};


export default LoadLatestButton;
