/* istanbul ignore file */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from 'src/theme/buttons';
import Box from 'src/theme/box';
import DownloadJSON from 'src/modules/common/components/DownloadJSON/DownloadJSON';
import BoxContent from 'src/theme/box/content';
import styles from './SetPasswordSuccess.css';

function SetPasswordSuccess({
  onClose,
  encryptedPhrase,
  accountName,
  headerText,
  contentText,
  buttonText,
}) {
  const { t } = useTranslation();
  const onContinue = () => onClose();
  const appendAccountName = `_${accountName}`;
  const fileName = `encrypted_secret_recovery_phrase${accountName ? appendAccountName : ''}`;

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
          {buttonText || t('Continue to Dashboard')}
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
