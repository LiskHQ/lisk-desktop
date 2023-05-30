import React from 'react';
import { useHistory } from 'react-router-dom';
import { selectSearchParamValue } from 'src/utils/searchParams';
import { useSelector } from 'react-redux';
import { selectHWAccounts } from '@hardwareWallet/store/selectors/hwSelectors';
import RemoveAccount from '../RemoveAccount/RemoveAccount';
import { useAccounts } from '../../hooks';

const RemoveSelectedAccountFlow = () => {
  const history = useHistory();
  const address = selectSearchParamValue(history.location.search, 'address');
  const { getAccountByAddress } = useAccounts();
  const hwAccounts = useSelector(selectHWAccounts);
  const nonHwAccount = getAccountByAddress(address);

  const account =
    nonHwAccount || hwAccounts.find((hwAccount) => hwAccount.metadata.address === address);

  return <RemoveAccount account={account} />;
};

export default RemoveSelectedAccountFlow;
