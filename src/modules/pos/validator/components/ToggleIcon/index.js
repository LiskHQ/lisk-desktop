import React from 'react';
import { withRouter } from 'react-router';

import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import Icon from 'src/theme/Icon';

import styles from './toggleIcon.css';

const ToggleIcon = ({ history, isNotHeader, className }) => {
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

export default withRouter(ToggleIcon);
