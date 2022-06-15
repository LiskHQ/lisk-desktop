import React from 'react';
import { useTranslation } from 'react-i18next';
import ManageAccounts from '../ManageAccounts';

const SwitchAccount = () => {
  const { t } = useTranslation();

  return (
    <ManageAccounts title={t('Switch account')} />
  );
};

export default SwitchAccount;
