import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { getActiveTokenAccount } from '../../../utils/account';
import MultisigAccountDetailsComp from './multisigAccountDetails';

const MultisigAccountDetails = ({ account }) => {
  const { t } = useTranslation();

  return (
    <MultisigAccountDetailsComp t={t} account={account} />
  );
};

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
});

/* istanbul ignore next */
const areEqual = (prevProps, nextProps) =>
  (prevProps.account && prevProps.account.address === nextProps.account.address);

export default React.memo(connect(mapStateToProps)(MultisigAccountDetails), areEqual);
