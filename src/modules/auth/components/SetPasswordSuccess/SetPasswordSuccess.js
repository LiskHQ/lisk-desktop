/* istanbul ignore file */

import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { PrimaryButton } from '@theme/buttons';
import Box from '@theme/box';
import DownloadJSON from '@common/components/DownloadJSON/DownloadJSON';
import BoxContent from '@theme/box/content';
import styles from './SetPasswordSuccess.css';

function SetPasswordSuccess({ onClose, encryptedPhrase, headerText, contentText, buttonText }) {
  const { t } = useTranslation();
  const onContinue = () => onClose();
  const { metadata: { name: accountName, address, isHw } = {} } = encryptedPhrase || {};
  const appendAccountName = `-${accountName}`;
  const fileName = `${address}${accountName ? appendAccountName : ''}-lisk-account`;

  return (
    <Box className={styles.container}>
      <BoxContent className={styles.content}>
        <h1>{headerText || t("Perfect! You're all set")}</h1>
        {isHw ? (
          <p className={classNames(styles.subHeader, styles.mgb16)}>{t('Successfully edited')}</p>
        ) : (
          <>
            <p className={classNames(styles.subHeader, styles.mgb12)}>
              {contentText ||
                t(
                  'You can now download your encrypted secret recovery phrase and use it to add your account on other devices.'
                )}
            </p>
            <DownloadJSON fileName={fileName} encryptedPhrase={encryptedPhrase} />
          </>
        )}
        <PrimaryButton className={styles.continueButton} onClick={onContinue}>
          {buttonText || t('Continue to wallet')}
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
