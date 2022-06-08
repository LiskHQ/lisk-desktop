import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import WalletVisual from '@wallet/components/walletVisual';
import { useAccounts } from '@account/hooks/useAccounts';
import routes from '@screens/router/routes';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Icon from 'src/theme/Icon';
import styles from './SwitchAccount.css';

const AccountList = ({ accounts }) => (
  <div className={styles.accountList}>
    <div
      className={styles.account}
      onClick={() => {
        // TODO close modal, refetch data and update redux
      }}
    >
      <WalletVisual address="lskm555k7nhhw954rw4pqy5q9wn28n3cec94fmp4n" />
      <div>
        <p className={styles.accountName}>Lisker</p>
        <p className={styles.accountAddress}>lskm555k7nhhw954rw4pqy5q9wn28n3cec94fmp4n</p>
      </div>
    </div>
    <div className={styles.account}>
      <WalletVisual address="lskw7488a9nqy6m3zkg68x6ynsp6ohg4y7wazs3mw" />
      <div>
        <p className={styles.accountName}>bob</p>
        <p className={styles.accountAddress}>lskw7488a9nqy6m3zkg68x6ynsp6ohg4y7wazs3mw</p>
      </div>
    </div>
  </div>
);

const SwitchAccount = () => {
  const { t } = useTranslation();
  const [accounts] = useAccounts();

  return (
    <Box className={styles.container}>
      <BoxContent className={styles.content}>
        <h1>{t('Switch account')}</h1>
        <AccountList accounts={accounts} />
        <Link
          className={styles.addAccountLink}
          to={routes.addAccount.path}
        >
          <Icon name="" />
          {t('Add another account')}
        </Link>
      </BoxContent>
    </Box>
  );
};

export default SwitchAccount;
