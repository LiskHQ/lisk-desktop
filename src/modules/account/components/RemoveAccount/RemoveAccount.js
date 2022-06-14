import React from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';

import routes from '@screens/router/routes';
import WalletVisual from '@wallet/components/walletVisual';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import DownloadJSON from 'src/modules/common/components/DownloadJSON/DownloadJSON';
import { PrimaryButton, SecondaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { useCurrentAccount } from '../../hooks';
import styles from './RemoveAccount.css';

const RemoveConfirmation = ({ t, account }) => (
  <>
    <h1>{t('Remove Account?')}</h1>
    <WalletVisual
      className={styles.avatar}
      address={account?.metadata?.address}
    />
    {account?.metadata?.name && (
    <p className={styles.accountName}>{account?.metadata?.name}</p>
    )}
    <p className={styles.accountAddress}>{account?.metadata?.address}</p>
    <p className={styles.subheader}>
      {t(
        'This account will no longer be stored on this device. You can backup your secret recovery phrase before remove it.',
      )}
    </p>
    <DownloadJSON
      fileName="encrypted_secret_recovery_phrase"
      encryptedPhrase={account}
    />
    <div className={styles.buttonRow}>
      <SecondaryButton className={styles.button}>
        {t('Cancel')}
      </SecondaryButton>
      <PrimaryButton className={styles.button}>{t('Remove now')}</PrimaryButton>
    </div>
  </>
);

const RemoveSuccess = ({ t, onComplete }) => (
  <>
    <h1>{t('Account was removed')}</h1>
    <div className={`${styles.accountRemovedIcon}`}>
      <Icon name="accountRemoved" />
    </div>
    <div className={styles.buttonRow}>
      <PrimaryButton className={styles.button} onClick={onComplete}>{t('Continue to Manage Accounts')}</PrimaryButton>
    </div>
  </>
);

const RemoveAccount = ({ history }) => {
  const { t } = useTranslation();
  const [account] = useCurrentAccount();

  const onComplete = () => {
    history.push(routes.manageAccounts.path);
  };

  return (
    <Box className={styles.container}>
      <BoxContent className={styles.content}>
        <RemoveConfirmation account={account} t={t} />
        <RemoveSuccess t={t} onComplete={onComplete} />
      </BoxContent>
    </Box>
  );
};

export default withRouter(RemoveAccount);
