/* eslint-disable max-statements */
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import Box from 'src/theme/box';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from 'src/theme/dialog/dialog';
import { OutlineButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import routes from 'src/routes/routes';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import { useAccounts, useCurrentAccount } from '../../hooks';
import styles from './ManageAccounts.css';
import AccountRow from '../AccountRow';

export const ManageAccountsContent = ({
  isRemoveAvailable,
  className,
  truncate,
  title: customTitle,
}) => {
  const history = useHistory();
  const { search } = useLocation();
  const { t } = useTranslation();
  const { accounts } = useAccounts();
  const [currentAccount, setAccount] = useCurrentAccount();
  const [showRemove, setShowRemove] = useState(false);
  const [showTruncate, setTruncate] = useState(truncate);
  const title = customTitle ?? t('Manage accounts');

  const queryParams = new URLSearchParams(search);
  const referrer = queryParams.get('referrer');

  const onAddAccount = useCallback(() => {
    history.push(routes.addAccountOptions.path);
  }, []);
  const removeAccount = useCallback((account) => {
    addSearchParamsToUrl(history, {
      modal: 'removeSelectedAccount',
      address: account?.metadata?.address,
    });
  }, []);
  const onSelectAccount = useCallback(
    (account) => {
      setAccount(account, referrer);
    },
    [referrer]
  );

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.headerWrapper}>
        <h1 data-testid="manage-title">{showRemove ? t('Choose account') : title}</h1>
      </div>
      <Box className={styles.accountListWrapper}>
        <>
          {accounts.map((account) => (
            <AccountRow
              key={account.metadata.address}
              account={account}
              currentAccount={currentAccount}
              onSelect={onSelectAccount}
              onRemove={showRemove && removeAccount}
              truncate={showTruncate}
            />
          ))}
        </>
      </Box>
      {showRemove ? (
        <OutlineButton
          className={`${styles.button} ${styles.addAccountBtn}`}
          onClick={() => {
            setShowRemove(false);
            setTruncate(false);
          }}
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
          {isRemoveAvailable && (
            <OutlineButton
              className={styles.button}
              onClick={() => {
                setShowRemove(true);
                setTruncate(true);
              }}
            >
              <Icon name="deleteIcon" />
              {t('Remove an account')}
            </OutlineButton>
          )}
        </>
      )}
    </div>
  );
};

function ManageAccounts(props) {
  if (props.isDialog) {
    return (
      <Dialog hasClose className={`${styles.dialogWrapper}`}>
        <ManageAccountsContent {...props} />
      </Dialog>
    );
  }

  return (
    <div className={`${styles.manageAccounts} ${grid.row}`}>
      <div
        className={`${styles.manageAccountWrapper} ${grid['col-xs-12']} ${grid['col-md-8']} ${grid['col-lg-6']}`}
      >
        <ManageAccountsContent {...props} />
      </div>
    </div>
  );
}

ManageAccounts.defaultProps = {
  isRemoveAvailable: true,
  isDialog: false,
};

export default ManageAccounts;
