import React from 'react';
import { withRouter } from 'react-router';
import { selectSearchParamValue } from 'src/utils/searchParams';
import RemoveAccount from '../RemoveAccount/RemoveAccount';
import { useAccounts } from '../../hooks';

const RemoveSelectedAccountFlow = ({ history }) => {
  const address = selectSearchParamValue(history.location.search, 'address');
  const { getAccountByAddress } = useAccounts();
  const account = getAccountByAddress(address);

  return <RemoveAccount account={account} />;
};

export default withRouter(RemoveSelectedAccountFlow);
