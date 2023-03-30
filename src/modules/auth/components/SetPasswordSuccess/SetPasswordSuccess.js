/* istanbul ignore file */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '@theme/buttons';
import Box from '@theme/box';
import DownloadJSON from '@common/components/DownloadJSON/DownloadJSON';
import BoxContent from '@theme/box/content';
import { truncateAddress } from '@wallet/utils/account';
import styles from './SetPasswordSuccess.css';

function SetPasswordSuccess({ onClose, encryptedPhrase, headerText, contentText, buttonText }) {
  const { t } = useTranslation();
  const onContinue = () => onClose();
  const accountName = encryptedPhrase.metadata.name;
  const appendAccountName = `_${accountName}`;
  const address = truncateAddress(encryptedPhrase.metadata.address);
  const fileName = `${address}${accountName ? appendAccountName : ''}_lisk_account`;

  return (
    <Box className={styles.container}>
      <BoxContent className={styles.content}>
        <h1>{headerText || t("Perfect! You're all set")}</h1>
        <p className={styles.subheader}>
          {contentText ||
            t(
              'You can now download your encrypted secret recovery phrase and use it to add your account on other devices.'
            )}
        </p>
        <DownloadJSON fileName={fileName} encryptedPhrase={encryptedPhrase} />
        <PrimaryButton className={styles.continueButton} onClick={onContinue}>
          {buttonText || t('Continue to account')}
        </PrimaryButton>
      </BoxContent>
    </Box>
  );
}

SetPasswordSuccess.defaultProps = {
  onClose: () => null,
  encryptedPhrase: {
    error: 'no encrypted backup found',
  },
};

export default SetPasswordSuccess;
