// istanbul ignore file
import React from 'react';
import { useAccounts, useCurrentAccount } from '@account/hooks';
import AccountCreationTips from '@account/components/AccountCreationTips';
import { ManageAccountsContent } from '@account/components/ManageAccounts';
import Box from 'src/theme/box';
import BoxHeader from 'src/theme/box/header';
import { isEmpty } from 'src/utils/helpers';
import styles from './dashboard.css';

const Dashboard = ({ t, history }) => {
  const { accounts } = useAccounts();
  const [currentAccount] = useCurrentAccount();

  return (
    <>
      <div className={`${styles.wrapper} dashboard-container`}>
        <div className={`${styles.main}`}>
          <div className={styles.subContainer}>
            {isEmpty(currentAccount) && accounts.length === 0 && <AccountCreationTips />}
            {isEmpty(currentAccount) && accounts.length > 0 && (
              <Box className={styles.wrapper}>
                <BoxHeader>
                  <h1>{t('Manage accounts')}</h1>
                </BoxHeader>
                <ManageAccountsContent
                  truncate
                  isRemoveAvailable
                  history={history}
                  className={styles.manageAccounts}
                />
              </Box>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
