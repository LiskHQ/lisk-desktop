import React from 'react';
import { removeSearchParamsFromUrl } from '@utils/searchParams';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import BoxFooter from '@toolbox/box/footer';
import styles from '../styles.css';

export const ActionBar = ({
  onSignClick,
  history,
  t,
}) => (
  <BoxFooter
    direction="horizontal"
    className={styles.footer}
  >
    <SecondaryButton size="l" onClick={() => removeSearchParamsFromUrl(history, ['modal'])}>
      {t('Reject')}
    </SecondaryButton>
    <PrimaryButton size="l" onClick={onSignClick}>
      {t('Sign')}
    </PrimaryButton>
  </BoxFooter>
);

export const Feedback = ({
  t,
}) => (
  <BoxFooter
    direction="horizontal"
    className={styles.footer}
  >
    <div className={`${styles.feedback} feedback`}>
      <span>{t('Only members of the group can sign the transaction.')}</span>
    </div>
  </BoxFooter>
);
