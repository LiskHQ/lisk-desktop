import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from 'src/theme/box';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { OutlineButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import WalletVisual from '@wallet/components/walletVisual';
import { useAccounts } from '../../hooks/useAccounts';
import styles from './AccountSelect.css';

function AccountRow({
  account, onSelect, onRemove, showRemove,
}) {
  const { metadata: { name, address } } = account;

  return (
    <button className={styles.accountWraper} onClick={() => onSelect(account)}>
      <WalletVisual address={address} size={40} />
      <div align="left">
        <b className={`${styles.addressValue}`}>
          {name}
        </b>
        <p className={`${styles.addressValue}`}>
          {address}
        </p>
      </div>
      {showRemove && (
      <button onClick={() => onRemove(account)}>
        <Icon name="deleteIcon" />
      </button>
      )}
    </button>
  );
}

const AccountSelect = ({ onSelect, onAddAccount, onRemoveAccount }) => {
  const { t } = useTranslation();
  const [accounts] = useAccounts();
  const [showRemove, setShowRemove] = useState();

  return (
    <>
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
                   onSelect={onSelect}
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
    </>
  );
};

export default AccountSelect;
