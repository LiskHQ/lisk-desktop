/* eslint-disable no-extra-boolean-cast */
import React from 'react';
import { useTranslation } from 'react-i18next';
import Illustration from 'src/modules/common/components/illustration';
import { TertiaryButton } from 'src/theme/buttons';
import styles from './NoTokenBalance.css';

function NoTokenBalance({ onClick, illustrationName, message, buttonTitle }) {
  const { t } = useTranslation();

  return (
    <div className={styles.errorWrapper}>
      <Illustration
        className={styles.emptyTokenIllustration}
        name={illustrationName || 'emptyTokensIllustration'}
      />
      <p>{message || t('There are no tokens to display for this account at this moment.')}</p>
      <TertiaryButton onClick={onClick}>{buttonTitle || t('Request token')}</TertiaryButton>
    </div>
  );
}

export default NoTokenBalance;
