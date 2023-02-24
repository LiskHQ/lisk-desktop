/* eslint-disable max-statements */
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import Spinner from 'src/theme/Spinner';
import Box from 'src/theme/box';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import Dialog from 'src/theme/dialog/dialog';
import { OutlineButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import routes from 'src/routes/routes';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import useHWAccounts from '@hardwareWallet/hooks/useHWAccounts';
import { useHWStatus } from '@hardwareWallet/hooks/useHWStatus';
import { DEVICE_STATUS } from '@libs/hwServer/constants';
import { useAccounts, useCurrentAccount } from '../../hooks';
import styles from './ManageAccounts.css';
import AccountRow from '../AccountRow';

export const ManageAccountsContent = ({
  isRemoveAvailable,
  history,
  className,
  truncate,
  title: customTitle,
}) => {
  const { t } = useTranslation();
  const { accounts } = useAccounts();
  const [, setAccount] = useCurrentAccount();
  const [showRemove, setShowRemove] = useState(false);
  const title = customTitle ?? t('Manage accounts');
  const { accounts: hwAccounts } = useHWAccounts();

  const { status } = useHWStatus();

  const onAddAccount = useCallback(() => {
    history.push(routes.addAccountOptions.path);
  }, []);
  const removeAccount = useCallback((account) => {
    addSearchParamsToUrl(history, {
      modal: 'removeSelectedAccount',
      address: account?.metadata?.address,
    });
  }, []);
  const onSelectAccount = useCallback((account) => {
    setAccount(account);
    history.push(routes.dashboard.path);
  }, []);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.headerWrapper}>
        <h1 data-testid="manage-title">{showRemove ? t('Choose account') : title}</h1>
      </div>
      <Box className={styles.accountListWrapper}>
        <>
          {[...accounts, ...hwAccounts].map((account) => (
            <AccountRow
              key={account.metadata.address}
              account={account}
              onSelect={onSelectAccount}
              onRemove={showRemove && removeAccount}
              truncate={truncate}
            />
          ))}
        </>
      </Box>
      {(status === DEVICE_STATUS.STAND_BY || hwAccounts.length === 0) && (
        <div className={styles.loaderWrapper}>
          <Spinner className={styles.spinner} />
          <span>{t('Loading hardware wallet accounts…')}</span>
        </div>
      )}
      {showRemove ? (
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
          {isRemoveAvailable && (
            <OutlineButton
              className={styles.button}
              onClick={() => {
                setShowRemove(true);
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

export default withRouter(ManageAccounts);
