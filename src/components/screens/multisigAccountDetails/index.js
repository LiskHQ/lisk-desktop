import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { getActiveTokenAccount } from '../../../utils/account';
import MultisigAccountDetailsComp from './multisigAccountDetails';

const MultisigAccountDetails = (props) => {
  const account = useSelector(state => getActiveTokenAccount(state));
  const { t } = useTranslation();

  return (
    <MultisigAccountDetailsComp t={t} account={account} {...props} />
  );
};

export default MultisigAccountDetails;
