import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import Illustration from 'src/modules/common/components/illustration';
import { TertiaryButton } from 'src/theme/buttons';
import styles from './NoTokenBalance.css';

function NoTokenBalance({ onRequestToken }) {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const message = queryParams.get('message');

  return (
    <div className={styles.errorWrapper}>
      <Illustration className={styles.emptyTokenIllustration} name="emptyTokensIllustration" />
      <p>{message || t('There are no tokens to display for this account at this time.')}</p>
      <TertiaryButton onClick={onRequestToken}>{t('Request token')}</TertiaryButton>
    </div>
  );
}

export default NoTokenBalance;
