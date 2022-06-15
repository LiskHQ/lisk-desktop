import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import routes from '@screens/router/routes';
import { login } from '@auth/store/action';
import history from 'src/utils/history';
import { removeSearchParamsFromUrl } from 'src/utils/searchParams';
import Box from 'src/theme/box';
import BoxContent from 'src/theme/box/content';
import ManageAccounts from '../ManageAccounts';
import styles from './SwitchAccount.css';

const SwitchAccount = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onSelectAccount = (account) => {
    removeSearchParamsFromUrl(history, ['modal']);
    dispatch(login({ publicKey: account.metadata.pubkey })); // Todo this login method is deprecated
  };

  const onAddAccount = () => {
    history.push(routes.addAccountOptions.path);
  };

  return (
    <Box className={styles.container}>
      <BoxContent className={styles.content}>
        <ManageAccounts
          title={t('Switch account')}
          onSelectAccount={onSelectAccount}
          onAddAccount={onAddAccount}
        />
      </BoxContent>
    </Box>
  );
};

export default SwitchAccount;
