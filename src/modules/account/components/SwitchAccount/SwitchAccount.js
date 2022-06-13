import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import WalletVisual from '@wallet/components/walletVisual';
import { useAccounts } from '@account/hooks/useAccounts';
import routes from '@screens/router/routes';
import history from 'src/utils/history';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import Icon from 'src/theme/Icon';
import styles from './SwitchAccount.css';

const AccountList = ({ accounts, onAccountClick }) => (
  <div className={styles.accountList}>
    {accounts.map(account => (
      <div
        key={`switch-account-lisk-${account.metadata.address}`}
        className={styles.account}
        onClick={onAccountClick}
      >
        <WalletVisual address={account.metadata.address} />
        <div>
          <p className={styles.accountName}>{account.metadata.name}</p>
          <p className={styles.accountAddress}>{account.metadata.address}</p>
        </div>
      </div>
    ))}
  </div>
);

const SwitchAccount = () => {
  const { t } = useTranslation();
  const [accounts] = useAccounts();

  const onAccountClick = () => {
    // TODO close modal, refetch data and update redux
  };

  return (
    <Box className={styles.container}>
      <BoxContent className={styles.content}>
        <h1>{t('Switch account')}</h1>
        <AccountList accounts={accounts} onAccountClick={onAccountClick} />
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
