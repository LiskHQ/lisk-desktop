import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { OutlineButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { useAccounts } from '../../hooks/useAccounts';
import styles from './AccountSelect.css';
import AccountRow from '../AccountRow';

const AccountSelect = ({ onSelectAccount, onAddAccount, onRemoveAccount }) => {
  const { t } = useTranslation();
  const [accounts] = useAccounts();
  const [showRemove, setShowRemove] = useState(false);

  return (
    <div className={`${styles.accountSelect} ${grid.row}`}>
      <div
        className={`${styles.accountSelectWrapper} ${grid['col-xs-12']} ${grid['col-md-8']} ${grid['col-lg-6']}`}
      >
        <div className={styles.wrapper}>
          <div className={styles.headerWrapper}>
            <h1>{t(showRemove ? 'Choose account' : 'Manage accounts')}</h1>
          </div>
          <Box className={styles.accountListWrapper}>
            {
               accounts.map((account) => (
                 <AccountRow
                   key={account.uuid}
                   account={account}
                   onSelect={onSelectAccount}
                   showRemove={showRemove}
                   onRemove={onRemoveAccount}
                 />
               ))
             }
          </Box>
          { showRemove ? (
            <OutlineButton
              className={`${styles.button} ${styles.addAccountBtn}`}
              onClick={() => setShowRemove(false)}
            >
              {t('Done')}
            </OutlineButton>
          ) : (
            <>
              <OutlineButton
                className={`${styles.button} ${styles.addAccountBtn}`}
                onClick={onAddAccount}
              >
                <Icon name="personIcon" />
                {t('Add another account')}
              </OutlineButton>
              <OutlineButton
                className={styles.button}
                onClick={() => {
                  setShowRemove(true);
                }}
              >
                <Icon name="deleteIcon" />
                {t('Remove an account')}
              </OutlineButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSelect;
