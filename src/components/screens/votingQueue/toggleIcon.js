import React from 'react';
import { withRouter } from 'react-router';

import { removeSearchParamsFromUrl } from '@utils/searchParams';
import Icon from '../../toolbox/icon';

import styles from './styles.css';

const ToggleIcon = ({ history, isNotHeader }) => {
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal']);
  };

  return (
    <span className={`${styles.toggleIcon} ${isNotHeader ? styles.notHeader : ''}`} onClick={closeModal}>
      <Icon name="votingQueueActive" />
    </span>
  );
};

export default withRouter(ToggleIcon);
