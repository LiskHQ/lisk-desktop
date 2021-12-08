import React from 'react';
import { withRouter } from 'react-router';

import { removeSearchParamsFromUrl } from '@utils/searchParams';
import Icon from '@toolbox/icon';

import styles from './styles.css';

const ToggleIcon = ({ history, title }) => {
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal']);
  };

  return (
    <span className={styles.toggleIcon} onClick={closeModal}>
      <Icon name="votingQueueActive" />
      <span className={styles.title}>{title}</span>
    </span>
  );
};

export default withRouter(ToggleIcon);
