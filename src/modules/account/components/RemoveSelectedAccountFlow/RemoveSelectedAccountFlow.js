import React from 'react';
import { useHistory } from 'react-router-dom';
import { selectSearchParamValue } from 'src/utils/searchParams';
import RemoveAccount from '../RemoveAccount/RemoveAccount';
import { useAccounts } from '../../hooks';

const RemoveSelectedAccountFlow = () => {
  const history = useHistory();
  const address = selectSearchParamValue(history.location.search, 'address');
  const { getAccountByAddress } = useAccounts();
  const account = getAccountByAddress(address);

  return <RemoveAccount account={account} />;
};

export default RemoveSelectedAccountFlow;
