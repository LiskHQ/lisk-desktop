import React from 'react';
import { useHistory } from 'react-router-dom';

import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import Icon from 'src/theme/Icon';

import styles from './toggleIcon.css';

const ToggleIcon = ({ isNotHeader, className }) => {
  const history = useHistory();
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal']);
  };

  return (
    <span
      className={`${styles.toggleIcon} ${isNotHeader ? styles.notHeader : ''} ${className}`}
      onClick={closeModal}
    >
      <Icon name="stakingQueueActive" />
    </span>
  );
};

export default ToggleIcon;
