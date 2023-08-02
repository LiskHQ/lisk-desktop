import React from 'react';
import EmptyBoxState from '@theme/box/emptyState';
import { useHistory } from 'react-router-dom';
import Illustration from 'src/modules/common/components/illustration';
import { TertiaryButton } from 'src/theme/buttons';
import routes from 'src/routes/routes';
import styles from './stakeForm.css';

const EmptyState = ({ t }) => {
  const history = useHistory();

  return (
    <EmptyBoxState className={styles.emptyState}>
      <Illustration name="emptyStakingQueueIllustration" />
      <p>{t('There are no stakes in queue, please select validators to stake.')}</p>
      <TertiaryButton onClick={() => history.push(routes.validators.path)}>
        {t('Stake now')}
      </TertiaryButton>
    </EmptyBoxState>
  );
};

export default EmptyState;
