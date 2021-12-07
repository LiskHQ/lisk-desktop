import React from 'react';
import { withRouter } from 'react-router';

import { removeSearchParamsFromUrl } from '@utils/searchParams';
import Icon from '@toolbox/icon';

import styles from './styles.css';

const ToggleIcon = ({ history, isNotHeader, t }) => {
  const closeModal = () => {
    removeSearchParamsFromUrl(history, ['modal']);
  };

  return (
    <span className={`${styles.toggleIcon} ${isNotHeader ? styles.notHeader : ''}`} onClick={closeModal}>
      <Icon name="votingQueueActive" />
      <header>
        {t('Voting queue')}
      </header>
    </span>
  );
};

export default withRouter(ToggleIcon);
